import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { test } from "vitest";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import type { Database } from "../lib/db/client";
import * as schema from "../lib/db/schema";
import { DrizzleWorkspaceRepository } from "../lib/repositories/drizzle-workspace-repository";
import { RevisionConflictError } from "../lib/repositories/workspace-repository";
import { WeeklyPlanningService } from "../lib/services/weekly-planning-service";

const owner = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
test("real SQL migrations, ORM roundtrip, conflicts, rollback and owner isolation", async () => {
  const engine = new PGlite();
  try {
    await engine.exec(
      `create role authenticated; create role anon; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema public,auth to authenticated,anon; insert into auth.users(id) values ('${owner}'),('${other}');`,
    );
    const migration = fileURLToPath(
      new URL(
        "../../../supabase/migrations/20261101120000_fitness_task_workspaces.sql",
        import.meta.url,
      ),
    );
    await engine.exec(readFileSync(migration, "utf8"));
    // Both adapters expose Drizzle's PostgreSQL query/transaction interface. This
    // test uses embedded PostgreSQL, while production uses Supabase's pooler.
    const db = drizzle(engine, { schema }) as unknown as Database;
    const repository = new DrizzleWorkspaceRepository(db);
    assert.equal(await repository.find(owner), null);
    const first = await repository.load(owner);
    assert.equal((await repository.find(owner))?.revision, 0);
    assert.equal(first.revision, 0);
    assert.equal(first.state.tasks.filter((t) => t.kind === "workout").length, 4);
    const generated = new WeeklyPlanningService().generate(first.state, "2026-10-19");
    generated.settings.name = "Owner A";
    assert.equal(await repository.save(owner, generated, 0), 1);
    const loaded = await repository.load(owner);
    assert.equal(loaded.state.settings.name, "Owner A");
    assert.equal(
      loaded.state.tasks.filter((t) => t.kind === "shopping_item").length,
      generated.tasks.filter((t) => t.kind === "shopping_item").length,
    );
    await assert.rejects(repository.save(owner, first.state, 0), RevisionConflictError);
    await repository.load(other);
    assert.equal((await repository.load(other)).state.settings.name, "Yusuf");
    const broken = structuredClone(loaded.state);
    const brokenTask = broken.tasks[0];
    if (!brokenTask) throw new Error("Expected a task.");
    brokenTask.parentId = "missing-parent";
    await assert.rejects(repository.save(owner, broken, 1));
    assert.equal((await repository.load(owner)).revision, 1);
    await engine.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${other}',false);`,
    );
    const rows = await engine.query<{ user_id: string }>("select user_id from task_workspaces");
    assert.deepEqual(
      rows.rows.map((r) => r.user_id),
      [other],
    );
    const count = await engine.query<{ count: number }>(
      `select count(*)::int as count from fitness_tasks where user_id='${owner}'`,
    );
    assert.equal(count.rows[0]?.count, 0);
    await engine.exec("reset role; set role anon;");
    await assert.rejects(engine.query("select * from fitness_tasks"));
    await engine.exec(`reset role; delete from auth.users where id='${owner}';`);
    assert.equal(
      (
        await engine.query<{ count: number }>(
          `select count(*)::int as count from fitness_tasks where user_id='${owner}'`,
        )
      ).rows[0]?.count,
      0,
    );
  } finally {
    await engine.close();
  }
});
