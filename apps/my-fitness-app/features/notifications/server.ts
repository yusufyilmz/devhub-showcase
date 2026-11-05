import { timingSafeEqual } from "node:crypto";

import { sql } from "drizzle-orm";
import { z } from "zod";

import { stableNotificationId } from "@shared/notifications";
import {
  createPushSender,
  deliverQueuedNotifications,
  validatePushSubscription,
} from "@shared/notifications/server";
import { database } from "@shared/services/db/client";
import { WorkspaceRepository } from "@shared/services/workspace";

import { requestIdentity, sameOrigin, workspaceOwnerId } from "@/lib/auth";

import { dueFitnessReminders } from "./reminders";
import {
  cleanNotifications,
  disableDevice,
  enqueueReminder,
  fitnessDeliveryQueue,
  saveDevice,
} from "./store";

const headers = { "Cache-Control": "private, no-store" };
export function pushConfiguration() {
  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY;
  const subject = process.env.WEB_PUSH_SUBJECT;
  return publicKey && privateKey && subject ? { privateKey, publicKey, subject } : null;
}
async function owner(request: Request) {
  const { user } = await requestIdentity(request);
  if (!user?.email_confirmed_at || user.id !== workspaceOwnerId()) throw new AccessDenied();
  return user.id;
}
class AccessDenied extends Error {}
export async function notificationRequest(request: Request) {
  if (request.method !== "GET" && !sameOrigin(request))
    return new Response(null, { headers, status: 403 });
  try {
    const user = await owner(request);
    const config = pushConfiguration();
    if (request.method === "GET") {
      const rows = await database().execute(
        sql`select revision from public.task_workspaces where user_id=${user}::uuid`,
      );
      return Response.json(
        {
          configured: Boolean(config),
          publicKey: config?.publicKey ?? null,
          revision: Number(rows[0]?.revision ?? -1),
        },
        { headers },
      );
    }
    const text = await request.text();
    if (text.length > 8192) return new Response(null, { headers, status: 413 });
    const value: unknown = JSON.parse(text);
    if (request.method === "DELETE") {
      const input = z
        .object({ endpoint: z.url().max(2048) })
        .strict()
        .parse(value);
      await disableDevice(user, input.endpoint);
    } else {
      if (!config)
        return Response.json(
          { error: "Background reminders are not configured yet." },
          { headers, status: 503 },
        );
      const input = z.object({ subscription: z.unknown() }).strict().parse(value);
      await saveDevice(user, validatePushSubscription(input.subscription));
    }
    return Response.json({ ok: true }, { headers });
  } catch (error) {
    return notificationFailure(error);
  }
}
function notificationFailure(error: unknown) {
  const status =
    error instanceof AccessDenied
      ? 403
      : error instanceof z.ZodError || error instanceof SyntaxError
        ? 400
        : 503;
  return Response.json(
    {
      error:
        status === 403
          ? "Owner access required."
          : "Could not save this device's notification settings.",
    },
    { headers, status },
  );
}

export async function testNotification(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { headers, status: 403 });
  try {
    const user = await owner(request);
    const config = pushConfiguration();
    if (!config) throw new Error("setup");
    const input = z
      .object({ endpoint: z.url().max(2048) })
      .strict()
      .parse(await request.json());
    // One logical test/device/minute; only this owner's registered device is targeted.
    const key = await stableNotificationId(
      `test:${user}:${input.endpoint}:${Math.floor(Date.now() / 60000)}`,
    );
    await enqueueReminder(
      user,
      key,
      {
        body: "Notifications are working on this device.",
        id: key,
        title: "Fitness OS",
        url: "/?view=More",
      },
      input.endpoint,
    );
    const result = await deliverQueuedNotifications(
      fitnessDeliveryQueue(user, key),
      createPushSender(config),
      10,
    );
    return Response.json(
      result.sent > 0
        ? result
        : {
            error:
              "No test was delivered. Wait a minute before retrying, and check this device's subscription.",
          },
      { headers, status: result.sent > 0 ? 200 : 503 },
    );
  } catch (error) {
    return Response.json(
      { error: "Could not send the test notification." },
      { headers, status: error instanceof AccessDenied ? 403 : 503 },
    );
  }
}
export async function dispatchReminders(request: Request) {
  const expected = Buffer.from(`Bearer ${process.env.CRON_SECRET ?? ""}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  if (
    !process.env.CRON_SECRET ||
    process.env.CRON_SECRET.length < 32 ||
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  )
    return new Response(null, { headers, status: 403 });
  try {
    const config = pushConfiguration();
    if (!config) throw new Error("setup");
    const user = workspaceOwnerId();
    const snapshot = await new WorkspaceRepository(database()).find(user);
    if (snapshot)
      for (const reminder of dueFitnessReminders(snapshot.state)) {
        const key = await stableNotificationId(`fitness-os:${reminder.key}`);
        await enqueueReminder(
          user,
          key,
          {
            body: "You have a task due. Open the app to see it.",
            id: key,
            title: "Fitness OS reminder",
            url: reminder.url,
          },
          undefined,
          snapshot.revision,
        );
      }
    await cleanNotifications(user);
    return Response.json(
      await deliverQueuedNotifications(fitnessDeliveryQueue(user), createPushSender(config), 10),
      { headers },
    );
  } catch {
    return Response.json({ error: "Reminder delivery is unavailable." }, { headers, status: 503 });
  }
}
