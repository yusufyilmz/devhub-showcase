import { describe, expect, it, vi } from "vitest";

import {
  createPushSender,
  deliverQueuedNotifications,
  type PushDelivery,
  validatePushSubscription,
} from "./server";

const transport = vi.hoisted(() => vi.fn());
vi.mock("web-push", () => ({ default: { sendNotification: transport } }));
const subscription = {
  endpoint: "https://fcm.googleapis.com/test",
  keys: {
    auth: Buffer.alloc(16).toString("base64url"),
    p256dh: Buffer.alloc(65, 4).toString("base64url"),
  },
};
const message = { body: "Open app", id: "reminder-1", title: "Reminder", url: "/" };
function delivery(attempt = 1): PushDelivery {
  return { attempt, id: "one", lease: "lease-1", message, subscription };
}

describe("push delivery boundaries", () => {
  it("rejects arbitrary endpoints, credentials, ports and lookalike hosts", () => {
    for (const endpoint of [
      "http://fcm.googleapis.com/a",
      "https://127.0.0.1/",
      "https://fcm.googleapis.com.evil.test/a",
      "https://user@fcm.googleapis.com/a",
      "https://fcm.googleapis.com:444/a",
    ]) {
      expect(() => validatePushSubscription({ ...subscription, endpoint })).toThrow();
    }
    expect(validatePushSubscription(subscription)).toEqual(subscription);
    expect(
      validatePushSubscription({
        ...subscription,
        endpoint: "https://example.web.push.apple.com/a",
      }).endpoint,
    ).toContain("apple.com");
  });
  it("validates keys and payload and supplies VAPID per call without global state", async () => {
    expect(() =>
      validatePushSubscription({ ...subscription, keys: { ...subscription.keys, auth: "bad" } }),
    ).toThrow();
    const vapid = {
      privateKey: "private-test-key",
      publicKey: "public-test-key",
      subject: "mailto:test@example.com",
    };
    await createPushSender(vapid)(subscription, message);
    expect(transport).toHaveBeenLastCalledWith(
      subscription,
      JSON.stringify(message),
      expect.objectContaining({
        TTL: 300,
        timeout: 8000,
        topic: expect.stringMatching(/^[\w-]{32}$/),
        vapidDetails: vapid,
      }),
    );
    await expect(
      createPushSender(vapid)(subscription, { ...message, title: "a".repeat(101) }),
    ).rejects.toThrow();
  });
  it.each([
    [410, 1, "expired"],
    [404, 3, "expired"],
    [429, 1, "retry"],
    [503, 1, "retry"],
    [503, 3, "failed"],
    [400, 1, "failed"],
  ] as const)(
    "classifies provider %s on attempt %s as %s",
    async (statusCode, attempt, expected) => {
      const finish = vi.fn();
      const row = delivery(attempt);
      const claim = vi.fn().mockResolvedValue([row]);
      const result = await deliverQueuedNotifications(
        { claim, finish },
        async () => {
          throw Object.assign(new Error("Provider refused"), { statusCode });
        },
        200,
      );
      expect(claim).toHaveBeenCalledWith(50);
      expect(finish).toHaveBeenCalledWith(row, expected);
      expect(result[expected]).toBe(1);
    },
  );
  it("finishes every claimed send before reporting a persistence failure", async () => {
    const finish = vi
      .fn()
      .mockRejectedValueOnce(new Error("private database error"))
      .mockResolvedValueOnce(undefined);
    const send = vi.fn().mockResolvedValue(undefined);
    await expect(
      deliverQueuedNotifications(
        { claim: async () => [delivery(), { ...delivery(), id: "two" }], finish },
        send,
      ),
    ).rejects.toThrow("Notification queue persistence unavailable.");
    expect(finish).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenCalledTimes(2);
  });
});
