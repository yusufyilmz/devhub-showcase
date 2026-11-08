import { readFileSync } from "node:fs";

import { afterEach, describe, expect, it, vi } from "vitest";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import type { Database } from "../../db/client";
import { database } from "../../db/client";
import * as schema from "../../db/schema";
import { WorkspaceRepository } from "../../services/workspace/index";
import {
  disableDevice,
  enqueueReminder,
  fitnessDeliveryQueue,
  notificationAccountIds,
  saveDevice,
} from "./index";

vi.mock("../../db/client", () => ({ database: vi.fn() }));
const owner = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
const subscription = {
  endpoint: "https://fcm.googleapis.com/fixture",
  keys: {
    auth: Buffer.alloc(16).toString("base64url"),
    p256dh: Buffer.alloc(65, 4).toString("base64url"),
  },
};
const message = { body: "Open app", id: "fixture", title: "Fitness OS", url: "/" };
// PGlite returns {rows}; postgres-js returns the row array. Normalize that driver
// difference only in this test adapter, leaving real SQL and transactions intact.
function postgresResultAdapter<T extends object>(target: T): T {
  return new Proxy(target, {
    get(object, key) {
      const value = Reflect.get(object, key);
      if (typeof value !== "function") return value;
      if (key === "execute")
        return async (...args: unknown[]) => (await value.apply(object, args)).rows;
      if (key === "transaction")
        return (callback: (tx: T) => unknown) =>
          value.call(object, (tx: T) => callback(postgresResultAdapter(tx)));
      return value.bind(object);
    },
  });
}
async function fixture() {
  const engine = new PGlite();
  await engine.exec(
    `create role authenticated; create role anon; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema public,auth to authenticated,anon,service_role; insert into auth.users values ('${owner}'),('${other}');`,
  );
  for (const name of [
    "20261101120000_fitness_task_workspaces.sql",
    "20261105120000_reusable_notifications.sql",
  ]) {
    await engine.exec(
      readFileSync(new URL(`../../../../../supabase/migrations/${name}`, import.meta.url), "utf8"),
    );
  }
  const db = postgresResultAdapter(drizzle(engine, { schema })) as unknown as Database;
  vi.mocked(database).mockReturnValue(db);
  return { engine, repository: new WorkspaceRepository(db) };
}
describe("notification persistence and privacy", () => {
  afterEach(() => vi.clearAllMocks());
  it("publishes only committed revision invalidations with owner-only RLS and server-only device access", async () => {
    const { engine, repository } = await fixture();
    try {
      const first = await repository.load(owner);
      await repository.load(other);
      await repository.save(owner, first.state, 0);
      const event = await engine.query<{ message: unknown }>(
        "select message from notification_events",
      );
      expect(event.rows).toEqual([{ message: { revision: 1 } }]);
      await engine.exec(
        `begin; update task_workspaces set revision=2 where user_id='${owner}'; rollback;`,
      );
      expect((await engine.query("select * from notification_events")).rows).toHaveLength(1);
      await engine.exec(
        `set role authenticated; select set_config('request.jwt.claim.sub','${other}',false);`,
      );
      expect((await engine.query("select * from notification_events")).rows).toHaveLength(0);
      await expect(engine.query("select * from notification_devices")).rejects.toThrow();
      await expect(engine.query("select * from notification_deliveries")).rejects.toThrow();
      await engine.exec(`select set_config('request.jwt.claim.sub','${owner}',false);`);
      expect((await engine.query("select * from notification_events")).rows).toHaveLength(1);
      await engine.exec("reset role;set role anon");
      await expect(engine.query("select * from notification_events")).rejects.toThrow();
    } finally {
      await engine.close();
    }
  });
  it("deduplicates fan-out, rejects account reassignment and fences stale delivery receipts", async () => {
    const { engine, repository } = await fixture();
    try {
      const first = await repository.load(owner);
      first.state.settings.reminders = true;
      await repository.save(owner, first.state, 0);
      await saveDevice(owner, subscription);
      await saveDevice(owner, subscription);
      await expect(saveDevice(other, subscription)).rejects.toThrow(/belongs to another account/);
      await enqueueReminder(owner, "fixture", message, undefined, 1);
      await enqueueReminder(owner, "fixture", message, undefined, 1);
      expect((await engine.query("select * from notification_deliveries")).rows).toHaveLength(1);
      expect(await fitnessDeliveryQueue(other).claim(10)).toHaveLength(0);
      expect(await fitnessDeliveryQueue(owner, "another-test").claim(10)).toHaveLength(0);
      const queue = fitnessDeliveryQueue(owner);
      const [claimed] = await queue.claim(10);
      expect(claimed).toBeDefined();
      expect(await queue.claim(10)).toHaveLength(0);
      await queue.finish({ ...claimed!, lease: crypto.randomUUID() }, "expired");
      expect(
        (await engine.query<{ enabled: boolean }>("select enabled from notification_devices"))
          .rows[0]?.enabled,
      ).toBe(true);
      await queue.finish(claimed!, "retry");
      await engine.exec(
        "update notification_deliveries set next_attempt=now()-interval '1 second'",
      );
      const [retry] = await queue.claim(10);
      expect(retry?.attempt).toBe(2);
      await queue.finish(claimed!, "expired"); // A previous worker cannot disable a renewed lease.
      await queue.finish(retry!, "expired");
      expect(
        (await engine.query<{ enabled: boolean }>("select enabled from notification_devices"))
          .rows[0]?.enabled,
      ).toBe(false);
      await saveDevice(owner, subscription);
      await disableDevice(other, subscription.endpoint);
      expect(
        (await engine.query<{ enabled: boolean }>("select enabled from notification_devices"))
          .rows[0]?.enabled,
      ).toBe(true);
      await disableDevice(owner, subscription.endpoint);
      expect(await queue.claim(10)).toHaveLength(0);
    } finally {
      await engine.close();
    }
  });
  it("caps active devices while permitting refresh of an already active subscription", async () => {
    const { engine } = await fixture();
    try {
      for (let i = 0; i < 10; i++)
        await saveDevice(owner, {
          ...subscription,
          endpoint: `https://fcm.googleapis.com/device-${i}`,
        });
      await expect(saveDevice(owner, subscription)).rejects.toThrow(/Device limit/);
      await saveDevice(owner, { ...subscription, endpoint: "https://fcm.googleapis.com/device-0" });
      await disableDevice(owner, "https://fcm.googleapis.com/device-0");
      await saveDevice(owner, subscription);
      await expect(
        saveDevice(owner, { ...subscription, endpoint: "https://fcm.googleapis.com/device-0" }),
      ).rejects.toThrow(/Device limit/);
    } finally {
      await engine.close();
    }
  });
  it("skips queued reminders after a workspace edit and enforces composite ownership", async () => {
    const { engine, repository } = await fixture();
    try {
      const first = await repository.load(owner);
      first.state.settings.reminders = true;
      await repository.save(owner, first.state, 0);
      await saveDevice(owner, subscription);
      await saveDevice(other, { ...subscription, endpoint: "https://fcm.googleapis.com/other" });
      expect((await notificationAccountIds()).sort()).toEqual([owner, other]);
      await disableDevice(other, "https://fcm.googleapis.com/other");
      expect(await notificationAccountIds()).toEqual([owner]);
      await enqueueReminder(owner, "stale", message, undefined, 1);
      await repository.save(owner, first.state, 1);
      expect(await fitnessDeliveryQueue(owner).claim(10)).toHaveLength(0);
      await expect(
        engine.exec(
          `insert into notification_deliveries(event_id,device_id,user_id,app_id) select e.id,d.id,e.user_id,e.app_id from notification_events e cross join notification_devices d where e.dedupe_key='stale' and d.user_id='${other}'`,
        ),
      ).rejects.toThrow();
    } finally {
      await engine.close();
    }
  });
});
