import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  accounts: vi.fn(),
  claim: vi.fn(),
  cleanNotifications: vi.fn(),
  disableDevice: vi.fn(),
  due: vi.fn(),
  enqueueReminder: vi.fn(),
  execute: vi.fn(),
  find: vi.fn(),
  finish: vi.fn(),
  identity: vi.fn(),
  origin: vi.fn(),
  saveDevice: vi.fn(),
  send: vi.fn(),
}));
vi.mock("@/lib/auth", async (original) => ({
  ...(await original<typeof import("@/lib/auth")>()),
  requestIdentity: mocks.identity,
  sameOrigin: mocks.origin,
}));
vi.mock("@shared/services/db/client", () => ({ database: () => ({ execute: mocks.execute }) }));
vi.mock("@shared/services/workspace", () => ({
  WorkspaceRepository: class {
    find = mocks.find;
  },
}));
vi.mock("./store", () => ({
  cleanNotifications: mocks.cleanNotifications,
  disableDevice: mocks.disableDevice,
  enqueueReminder: mocks.enqueueReminder,
  fitnessDeliveryQueue: () => ({ claim: mocks.claim, finish: mocks.finish }),
  notificationAccountIds: mocks.accounts,
  saveDevice: mocks.saveDevice,
}));
vi.mock("./reminders", () => ({ dueFitnessReminders: mocks.due }));
vi.mock("web-push", () => ({ default: { sendNotification: mocks.send } }));

import { dispatchReminders, notificationRequest, testNotification } from "./server";

const owner = "00000000-0000-4000-8000-000000000001";
const second = "00000000-0000-4000-8000-000000000002";
const secret = "fixture-cron-secret-at-least-32-characters";
function request(method: string, body?: unknown) {
  return new Request("https://app.test/api/notifications", {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
describe("fitness notification routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.identity.mockResolvedValue({ user: { email_confirmed_at: "2026-11-01", id: owner } });
    mocks.origin.mockReturnValue(true);
    mocks.execute.mockResolvedValue([{ revision: 7 }]);
    mocks.claim.mockResolvedValue([]);
    mocks.find.mockResolvedValue(null);
    mocks.accounts.mockResolvedValue([owner, second]);
    mocks.due.mockReturnValue([]);
    vi.stubEnv("WEB_PUSH_PUBLIC_KEY", "public-fixture-key");
    vi.stubEnv("WEB_PUSH_PRIVATE_KEY", "private-fixture-key");
    vi.stubEnv("WEB_PUSH_SUBJECT", "mailto:test@example.com");
    vi.stubEnv("CRON_SECRET", secret);
  });
  afterEach(() => vi.unstubAllEnvs());
  it("exposes only the public key and current revision to a confirmed account", async () => {
    const result = await notificationRequest(request("GET"));
    expect(result.headers.get("cache-control")).toBe("private, no-store");
    expect(await result.json()).toEqual({
      configured: true,
      publicKey: "public-fixture-key",
      revision: 7,
    });
    for (const user of [
      null,
      { email_confirmed_at: "yes", id: second, is_anonymous: true },
      { id: owner },
    ]) {
      mocks.identity.mockResolvedValue({ user });
      expect((await notificationRequest(request("GET"))).status).toBe(403);
    }
    expect(mocks.execute).toHaveBeenCalledTimes(1);
  });
  it("rejects cross-origin changes, oversized input, invalid endpoints and unavailable setup", async () => {
    mocks.origin.mockReturnValue(false);
    expect(
      (await notificationRequest(request("DELETE", { endpoint: "https://fcm.googleapis.com/x" })))
        .status,
    ).toBe(403);
    mocks.origin.mockReturnValue(true);
    expect(
      (
        await notificationRequest(
          new Request("https://app.test", { body: "x".repeat(8193), method: "POST" }),
        )
      ).status,
    ).toBe(413);
    expect((await notificationRequest(request("POST", { subscription: {} }))).status).toBe(400);
    vi.stubEnv("WEB_PUSH_PRIVATE_KEY", "");
    expect((await notificationRequest(request("POST", { subscription: {} }))).status).toBe(503);
    expect(mocks.saveDevice).not.toHaveBeenCalled();
    expect(mocks.disableDevice).not.toHaveBeenCalled();
  });
  it("accepts only a registered-device endpoint for tests and does not accept custom message text", async () => {
    expect(
      (
        await testNotification(
          request("POST", { endpoint: "https://fcm.googleapis.com/fixture", title: "attacker" }),
        )
      ).status,
    ).toBe(503);
    expect(mocks.enqueueReminder).not.toHaveBeenCalled();
    const result = await testNotification(
      request("POST", { endpoint: "https://fcm.googleapis.com/fixture" }),
    );
    expect(result.status).toBe(503); // No subscribed delivery: never claim success.
    expect(mocks.enqueueReminder).toHaveBeenCalledWith(
      owner,
      expect.any(String),
      expect.objectContaining({ title: "Fitness OS" }),
      "https://fcm.googleapis.com/fixture",
    );
  });
  it("guards the worker, processes devices across accounts and avoids sensitive reminder text", async () => {
    expect((await dispatchReminders(request("GET"))).status).toBe(403);
    expect(mocks.find).not.toHaveBeenCalled();
    mocks.find.mockResolvedValue({ revision: 9, state: {} });
    mocks.due.mockReturnValue([
      {
        key: "fixture",
        notes: "Private dosage",
        taskTitle: "Private health title",
        url: "/?view=day&date=2026-11-06",
      },
    ]);
    const result = await dispatchReminders(
      new Request("https://app.test/api/cron/notifications?user=other", {
        headers: { authorization: `Bearer ${secret}` },
      }),
    );
    expect(result.status).toBe(200);
    expect(mocks.find).toHaveBeenCalledWith(owner);
    expect(mocks.find).toHaveBeenCalledWith(second);
    expect(mocks.enqueueReminder).toHaveBeenCalledWith(
      owner,
      expect.any(String),
      expect.objectContaining({
        body: "You have a task due. Open the app to see it.",
        title: "Fitness OS reminder",
      }),
      undefined,
      9,
    );
    expect(mocks.enqueueReminder).toHaveBeenCalledWith(
      second,
      expect.any(String),
      expect.anything(),
      undefined,
      9,
    );
    expect(JSON.stringify(mocks.enqueueReminder.mock.calls)).not.toContain("Private");
  });
});
