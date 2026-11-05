// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { capturePwaInstall, NotificationClient, requestWebNotificationPermission } from "./client";
import { localNotificationUrl, notificationCapabilities, stableNotificationId } from "./index";

function browser(ios = false, installed = false) {
  vi.stubGlobal("matchMedia", () => ({ matches: installed }));
  vi.stubGlobal("isSecureContext", true);
  vi.stubGlobal("PushManager", class {});
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(ios ? "iPhone" : "Desktop");
  const requestPermission = vi.fn().mockResolvedValue("granted");
  const shown = vi.fn();
  class TestNotification {
    static permission = "granted";
    static requestPermission = requestPermission;
    constructor(title: string) {
      shown(title);
    }
  }
  vi.stubGlobal("Notification", TestNotification);
  const unsubscribe = vi.fn().mockResolvedValue(true);
  const subscription = {
    endpoint: "https://fcm.googleapis.com/device",
    toJSON: () => ({
      endpoint: "https://fcm.googleapis.com/device",
      keys: { auth: "auth", p256dh: "key" },
    }),
    unsubscribe,
  };
  const subscribe = vi.fn().mockResolvedValue(subscription);
  const register = vi.fn().mockResolvedValue({
    active: {},
    pushManager: { getSubscription: async () => null, subscribe },
  });
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      getRegistration: async () => ({ pushManager: { getSubscription: async () => subscription } }),
      register,
    },
  });
  return { register, requestPermission, shown, subscribe, unsubscribe };
}
describe("browser notifications and PWA consent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(navigator, "serviceWorker");
  });
  it("requests permission immediately from a click before service worker work", async () => {
    const h = browser();
    const client = new NotificationClient({
      applicationServerKey: "AA",
      workerUrl: "/notifications-sw.js",
    });
    const pending = client.enablePush();
    expect(h.requestPermission).toHaveBeenCalledTimes(1);
    expect(h.register).not.toHaveBeenCalled();
    await pending;
    expect(h.subscribe).toHaveBeenCalledWith(expect.objectContaining({ userVisibleOnly: true }));
    expect(await client.disablePush()).toBe("https://fcm.googleapis.com/device");
    expect(h.unsubscribe).toHaveBeenCalled();
  });
  it("requires iOS installation and handles denied permission without subscribing", async () => {
    const h = browser(true);
    expect(notificationCapabilities().requiresHomeScreen).toBe(true);
    await expect(requestWebNotificationPermission()).rejects.toThrow("Home Screen");
    expect(h.requestPermission).not.toHaveBeenCalled();
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Desktop");
    h.requestPermission.mockResolvedValue("denied");
    await expect(
      new NotificationClient({ applicationServerKey: "AA", workerUrl: "/sw.js" }).enablePush(),
    ).rejects.toThrow("blocked");
    expect(h.subscribe).not.toHaveBeenCalled();
  });
  it("deduplicates fallback display only after success", async () => {
    const h = browser();
    h.register.mockRejectedValue(new Error("unsupported"));
    h.shown.mockImplementationOnce(() => {
      throw new Error("OS refused");
    });
    const client = new NotificationClient({ workerUrl: "/sw.js" });
    const message = { body: "", id: "one", title: "One", url: "/" };
    await expect(client.show(message)).rejects.toThrow("OS refused");
    await client.show(message);
    await client.show(message);
    expect(h.shown).toHaveBeenCalledTimes(2);
    expect(() => localNotificationUrl("//evil.test/", "https://app.test")).toThrow();
    expect(() => localNotificationUrl("javascript:alert(1)", "https://app.test")).toThrow();
    expect(await stableNotificationId("same")).toBe(await stableNotificationId("same"));
  });
  it("captures installation without prompting until the user chooses Install", async () => {
    browser();
    const onAvailable = vi.fn();
    const installer = capturePwaInstall(onAvailable);
    const prompt = vi.fn().mockResolvedValue(undefined);
    const event = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
      prompt,
      userChoice: Promise.resolve({ outcome: "accepted" }),
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(prompt).not.toHaveBeenCalled();
    expect(await installer.install()).toBe("accepted");
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(await installer.install()).toBe("unavailable");
    installer.dispose();
    onAvailable.mockClear();
    window.dispatchEvent(event);
    expect(onAvailable).not.toHaveBeenCalled();
  });
});
