import { runInNewContext } from "node:vm";

import { describe, expect, it, vi } from "vitest";

import { notificationWorker } from "./worker";

function harness() {
  const listeners = new Map<string, (event: Record<string, unknown>) => void>();
  const showNotification = vi.fn().mockResolvedValue(undefined);
  const add = vi.fn().mockResolvedValue(undefined);
  const match = vi.fn().mockResolvedValue("public offline page");
  const navigate = vi.fn().mockResolvedValue(undefined);
  const focus = vi.fn().mockResolvedValue(undefined);
  runInNewContext(
    notificationWorker({
      cacheName: "test-v1",
      icon: "/icon.png",
      offlineUrl: "/offline.html",
      title: "Test",
    }),
    {
      caches: { match, open: async () => ({ add }) },
      crypto,
      Date,
      fetch: vi.fn().mockRejectedValue(new Error("offline")),
      indexedDB: {
        open() {
          throw new Error("unavailable");
        },
      },
      Response,
      self: {
        addEventListener: (type: string, cb: (event: Record<string, unknown>) => void) =>
          listeners.set(type, cb),
        clients: {
          claim: async () => undefined,
          matchAll: async () => [{ focus, navigate, url: "https://app.test/" }],
        },
        location: { origin: "https://app.test" },
        registration: { showNotification },
      },
      URL,
    },
  );
  async function dispatch(type: string, value: Record<string, unknown>) {
    let pending: Promise<unknown> | undefined;
    listeners.get(type)?.({
      ...value,
      respondWith: (work: Promise<unknown>) => {
        pending = work;
      },
      waitUntil: (work: Promise<unknown>) => {
        pending = work;
      },
    });
    return await pending;
  }
  const ack = vi.fn();
  const message = { body: "Open the app", id: "one", title: "Reminder", url: "https://evil.test/" };
  const foreground = () =>
    dispatch("message", {
      data: { message, type: "show-notification" },
      ports: [{ postMessage: ack }],
      source: { url: "https://app.test/" },
    });
  return { ack, add, dispatch, focus, foreground, match, message, navigate, showNotification };
}
describe("notification service worker", () => {
  it("deduplicates foreground updates after successful display and keeps pushed duplicates visible", async () => {
    const h = harness();
    await h.foreground();
    await h.foreground();
    expect(h.showNotification).toHaveBeenCalledTimes(1);
    expect(h.ack).toHaveBeenLastCalledWith({ ok: true });
    await h.dispatch("push", { data: { text: () => JSON.stringify(h.message) } });
    expect(h.showNotification).toHaveBeenCalledTimes(2);
    expect(h.showNotification).toHaveBeenLastCalledWith(
      "Reminder",
      expect.objectContaining({
        data: { id: "one", url: "https://app.test/" },
        renotify: false,
        tag: "one",
      }),
    );
  });
  it("allows retry after a failed display and rejects messages from another origin", async () => {
    const h = harness();
    h.showNotification.mockRejectedValueOnce(new Error("OS refused"));
    await h.foreground();
    expect(h.ack).toHaveBeenLastCalledWith({ ok: false });
    await h.foreground();
    expect(h.showNotification).toHaveBeenCalledTimes(2);
    await h.dispatch("message", {
      data: { message: { ...h.message, id: "evil" }, type: "show-notification" },
      source: { url: "https://evil.test/" },
    });
    expect(h.showNotification).toHaveBeenCalledTimes(2);
  });
  it("caches only the public fallback and does not intercept API responses", async () => {
    const h = harness();
    await h.dispatch("install", {});
    expect(h.add).toHaveBeenCalledExactlyOnceWith("/offline.html");
    expect(
      await h.dispatch("fetch", { request: { mode: "navigate", url: "https://app.test/private" } }),
    ).toBe("public offline page");
    h.match.mockClear();
    await h.dispatch("fetch", { request: { mode: "cors", url: "https://app.test/api/state" } });
    expect(h.match).not.toHaveBeenCalled();
  });
  it("shows safe malformed pushes and focuses a same-origin client on click", async () => {
    const h = harness();
    await h.dispatch("push", { data: { text: () => "invalid json" } });
    expect(h.showNotification).toHaveBeenCalledWith("Test", expect.any(Object));
    const close = vi.fn();
    await h.dispatch("notificationclick", {
      notification: { close, data: { url: "javascript:alert(1)" } },
    });
    expect(close).toHaveBeenCalled();
    expect(h.navigate).toHaveBeenCalledWith("https://app.test/");
    expect(h.focus).toHaveBeenCalled();
    expect(() =>
      notificationWorker({
        cacheName: "test",
        icon: "/i",
        offlineUrl: "//evil.test",
        title: "Test",
      }),
    ).toThrow();
  });
});
