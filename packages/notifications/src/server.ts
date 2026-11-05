import { createHash } from "node:crypto";

import webPush from "web-push";
import { z } from "zod";

import { type NotificationMessage, notificationSchema } from "./index";

export const pushSubscriptionSchema = z
  .object({
    endpoint: z.url().max(2048),
    expirationTime: z.number().nullable().optional(),
    keys: z
      .object({
        auth: z.string().regex(/^[A-Za-z0-9_-]{22}$/),
        p256dh: z.string().regex(/^[A-Za-z0-9_-]{87}$/),
      })
      .strict(),
  })
  .strict();
export type StoredSubscription = z.infer<typeof pushSubscriptionSchema>;
const hosts = [
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  "web.push.apple.com",
  "notify.windows.com",
];
export function validatePushSubscription(input: unknown, allowedHosts: readonly string[] = hosts) {
  const subscription = pushSubscriptionSchema.parse(input);
  const url = new URL(subscription.endpoint);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.hash ||
    (url.port && url.port !== "443") ||
    !allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))
  )
    throw new Error("Unsupported push service.");
  if (
    Buffer.from(subscription.keys.p256dh, "base64url").length !== 65 ||
    Buffer.from(subscription.keys.auth, "base64url").length !== 16
  )
    throw new Error("Invalid push keys.");
  return subscription;
}
export function subscriptionFingerprint(endpoint: string) {
  return createHash("sha256").update(endpoint).digest("hex");
}
export function createPushSender(vapid: {
  subject: string;
  publicKey: string;
  privateKey: string;
}) {
  return async (subscription: StoredSubscription, message: NotificationMessage) => {
    validatePushSubscription(subscription);
    const payload = notificationSchema.parse(message);
    await webPush.sendNotification(subscription, JSON.stringify(payload), {
      TTL: 300,
      timeout: 8000,
      topic: createHash("sha256")
        .update(payload.tag ?? payload.id)
        .digest("base64url")
        .slice(0, 32),
      urgency: "normal",
      vapidDetails: vapid,
    });
  };
}
export type PushDelivery = {
  id: string;
  lease: string;
  attempt: number;
  subscription: StoredSubscription;
  message: NotificationMessage;
};
export interface DeliveryQueue {
  claim(limit: number): Promise<PushDelivery[]>;
  finish(delivery: PushDelivery, outcome: "sent" | "expired" | "retry" | "failed"): Promise<void>;
}
export async function deliverQueuedNotifications(
  queue: DeliveryQueue,
  send: (subscription: StoredSubscription, message: NotificationMessage) => Promise<unknown>,
  limit = 20,
) {
  const deliveries = await queue.claim(Math.max(1, Math.min(limit, 50)));
  const outcomes = await Promise.allSettled(
    deliveries.map(async (delivery) => {
      let outcome: "sent" | "expired" | "retry" | "failed" = "sent";
      try {
        await send(delivery.subscription, delivery.message);
      } catch (error) {
        outcome = failureOutcome(error, delivery.attempt);
      }
      await queue.finish(delivery, outcome);
      return outcome;
    }),
  );
  if (outcomes.some((result) => result.status === "rejected"))
    throw new Error("Notification queue persistence unavailable.");
  const count = (value: string) =>
    outcomes.filter((result) => result.status === "fulfilled" && result.value === value).length;
  return {
    expired: count("expired"),
    failed: count("failed"),
    processed: deliveries.length,
    retry: count("retry"),
    sent: count("sent"),
  };
}
function failureOutcome(error: unknown, attempt: number) {
  const status =
    error && typeof error === "object" && "statusCode" in error ? error.statusCode : undefined;
  if (status === 404 || status === 410) return "expired";
  if (attempt >= 3) return "failed";
  if (typeof status === "number" && status >= 400 && status < 500 && status !== 429)
    return "failed";
  return "retry";
}
