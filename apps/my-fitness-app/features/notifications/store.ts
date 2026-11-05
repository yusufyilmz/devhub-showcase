import { randomUUID } from "node:crypto";

import { sql } from "drizzle-orm";

import type { NotificationMessage } from "@shared/notifications";
import { notificationSchema } from "@shared/notifications";
import {
  type DeliveryQueue,
  type PushDelivery,
  type StoredSubscription,
  subscriptionFingerprint,
  validatePushSubscription,
} from "@shared/notifications/server";
import { database } from "@shared/services/db/client";

const appId = "fitness-os";
export async function saveDevice(owner: string, subscription: StoredSubscription) {
  const valid = validatePushSubscription(subscription);
  const result = await database().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`${appId}:${owner}`},0))`);
    return tx.execute(sql`
      with capacity as (select count(*) n from public.notification_devices where user_id=${owner}::uuid and app_id=${appId} and enabled),
      saved as (insert into public.notification_devices(user_id,app_id,endpoint_hash,subscription)
      select ${owner}::uuid,${appId},${subscriptionFingerprint(valid.endpoint)},${JSON.stringify(valid)}::jsonb from capacity
      where n<10 or exists(select 1 from public.notification_devices where user_id=${owner}::uuid and app_id=${appId} and endpoint_hash=${subscriptionFingerprint(valid.endpoint)} and enabled)
      on conflict(app_id,endpoint_hash) do update set subscription=excluded.subscription,enabled=true,updated_at=now()
      where notification_devices.user_id=excluded.user_id returning id)
      select id from saved`);
  });
  if (!result.length)
    throw new Error("Device limit reached or this subscription belongs to another account.");
}
export async function disableDevice(owner: string, endpoint: string) {
  await database().execute(
    sql`update public.notification_devices set enabled=false,updated_at=now() where user_id=${owner}::uuid and app_id=${appId} and endpoint_hash=${subscriptionFingerprint(endpoint)}`,
  );
}
export async function enqueueReminder(
  owner: string,
  key: string,
  message: NotificationMessage,
  endpoint?: string,
  revision?: number,
) {
  const safe = notificationSchema.parse(message);
  await database().execute(sql`
    with event as (insert into public.notification_events(user_id,app_id,kind,topic,dedupe_key,message,expires_at,source_revision)
      values(${owner}::uuid,${appId},'notification',${endpoint ? "test" : "reminders"},${key},${JSON.stringify(safe)}::jsonb,now()+interval '5 minutes',${revision ?? null})
      on conflict(user_id,app_id,dedupe_key) do update set source_revision=excluded.source_revision returning id,user_id,app_id)
    insert into public.notification_deliveries(event_id,device_id,user_id,app_id)
    select event.id,d.id,event.user_id,event.app_id from event join public.notification_devices d on d.user_id=event.user_id and d.app_id=event.app_id
    where d.enabled and (${endpoint === undefined} or d.endpoint_hash=${endpoint ? subscriptionFingerprint(endpoint) : ""}) on conflict do nothing`);
}
export function fitnessDeliveryQueue(owner: string, eventKey?: string): DeliveryQueue {
  return {
    async claim(limit) {
      const lease = randomUUID();
      const rows = await database().execute(sql`
        with candidates as (select q.event_id,q.device_id from public.notification_deliveries q
          join public.notification_events e on e.id=q.event_id join public.notification_devices d on d.id=q.device_id
          where q.user_id=${owner}::uuid and q.app_id=${appId} and d.enabled and e.expires_at>now()
          and (${eventKey === undefined} or e.dedupe_key=${eventKey ?? ""})
          and (e.topic='test' or exists(select 1 from public.task_workspaces w where w.user_id=q.user_id and w.reminders and w.revision=e.source_revision))
          and q.attempts<3 and q.next_attempt<=now() and (q.state='pending' or (q.state='leased' and q.lease_until<now()))
          order by q.next_attempt limit ${limit} for update of q skip locked),
        claimed as (update public.notification_deliveries q set state='leased',attempts=attempts+1,lease=${lease}::uuid,lease_until=now()+interval '2 minutes'
          from candidates c where q.event_id=c.event_id and q.device_id=c.device_id returning q.*)
        select c.event_id,c.device_id,c.attempts,d.subscription,e.message from claimed c join public.notification_devices d on d.id=c.device_id join public.notification_events e on e.id=c.event_id`);
      return rows.map((row) => ({
        attempt: Number(row.attempts),
        id: `${row.event_id}/${row.device_id}`,
        lease,
        message: notificationSchema.parse(row.message),
        subscription: validatePushSubscription(row.subscription),
      }));
    },
    async finish(delivery: PushDelivery, outcome) {
      const [event, device] = delivery.id.split("/");
      await database().transaction(async (tx) => {
        const updated =
          await tx.execute(sql`update public.notification_deliveries set state=${outcome === "retry" ? "pending" : outcome},lease=null,lease_until=null,next_attempt=now()+interval '1 minute' * ${delivery.attempt}
          where event_id=${event}::uuid and device_id=${device}::uuid and user_id=${owner}::uuid and app_id=${appId} and lease=${delivery.lease}::uuid and state='leased' and lease_until>now() returning device_id`);
        if (updated.length && outcome === "expired")
          await tx.execute(
            sql`update public.notification_devices set enabled=false where id=${device}::uuid and user_id=${owner}::uuid and app_id=${appId}`,
          );
      });
    },
  };
}
export async function cleanNotifications(owner: string) {
  await database().execute(
    sql`update public.notification_deliveries set state='failed',lease=null,lease_until=null where user_id=${owner}::uuid and app_id=${appId} and state='leased' and lease_until<now() and attempts>=3`,
  );
  await database().execute(
    sql`delete from public.notification_events where user_id=${owner}::uuid and app_id=${appId} and expires_at<now()-interval '1 day'`,
  );
}
