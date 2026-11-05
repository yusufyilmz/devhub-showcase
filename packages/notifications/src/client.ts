import {
  localNotificationUrl,
  type NotificationMessage,
  notificationCapabilities,
  notificationSchema,
} from "./index";

export type PushRecord = {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
};
export class NotificationClient {
  private readonly displayed = new Map<string, number>();
  constructor(
    private readonly options: {
      workerUrl: string;
      scope?: string;
      icon?: string;
      applicationServerKey?: string;
    },
  ) {}
  async register() {
    const capabilities = notificationCapabilities();
    if (!capabilities.secure || !("serviceWorker" in navigator))
      throw new Error("Push notifications need a secure, supported browser.");
    const url = localNotificationUrl(this.options.workerUrl, location.origin);
    const registration = await navigator.serviceWorker.register(url, {
      scope: this.options.scope ?? "/",
      updateViaCache: "none",
    });
    if (!registration.active)
      await new Promise<void>((resolve, reject) => {
        const worker = registration.installing ?? registration.waiting;
        if (!worker) {
          reject(new Error("Notification worker unavailable."));
          return;
        }
        const timeout = setTimeout(() => {
          worker.removeEventListener("statechange", changed);
          reject(new Error("Notification worker did not activate."));
        }, 15000);
        function changed() {
          if (worker?.state !== "activated" && worker?.state !== "redundant") return;
          clearTimeout(timeout);
          worker.removeEventListener("statechange", changed);
          if (worker.state === "activated") resolve();
          else reject(new Error("Notification worker unavailable."));
        }
        worker.addEventListener("statechange", changed);
        changed();
      });
    return registration;
  }
  // Call directly from the user's click, before awaiting network or registration work.
  async enablePush(): Promise<PushRecord> {
    const capabilities = notificationCapabilities();
    if (capabilities.requiresHomeScreen)
      throw new Error(
        "Add this app to your Home Screen, open it there, then enable notifications.",
      );
    if (!capabilities.notifications || !capabilities.push || !capabilities.secure)
      throw new Error("Push notifications are unavailable in this browser.");
    if (!this.options.applicationServerKey)
      throw new Error("Background reminders are not configured yet.");
    const permission = await requestWebNotificationPermission();
    if (permission !== "granted")
      throw new Error(
        "Notifications are blocked. Change the permission in your browser or device settings.",
      );
    const registration = await this.register();
    const current = await registration.pushManager.getSubscription();
    const subscription =
      current ??
      (await registration.pushManager.subscribe({
        applicationServerKey: decodeKey(this.options.applicationServerKey),
        userVisibleOnly: true,
      }));
    const value = subscription.toJSON();
    if (!value.endpoint || !value.keys?.p256dh || !value.keys.auth)
      throw new Error("Incomplete push subscription.");
    return {
      endpoint: value.endpoint,
      expirationTime: value.expirationTime,
      keys: { auth: value.keys.auth, p256dh: value.keys.p256dh },
    };
  }
  async subscription() {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
    const registration = await navigator.serviceWorker.getRegistration(this.options.scope ?? "/");
    return registration?.pushManager?.getSubscription() ?? null;
  }
  async disablePush() {
    const subscription = await this.subscription();
    if (subscription && !(await subscription.unsubscribe()))
      throw new Error("Could not disable this device's notifications. Try again.");
    return subscription?.endpoint;
  }
  async show(input: NotificationMessage) {
    if (typeof window === "undefined" || typeof Notification === "undefined") return false;
    const message = notificationSchema.parse(input);
    const url = localNotificationUrl(message.url, location.origin);
    if (Notification.permission !== "granted") return false;
    const registration = await this.register().catch(() => null);
    if (registration) {
      const worker = registration.active;
      if (!worker) throw new Error("Notification worker unavailable.");
      await new Promise<void>((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => {
          channel.port1.close();
          reject(new Error("Notification worker did not respond."));
        }, 10000);
        channel.port1.onmessage = (event) => {
          clearTimeout(timer);
          channel.port1.close();
          if (event.data?.ok) resolve();
          else reject(new Error("Could not display notification."));
        };
        worker.postMessage({ message: { ...message, url }, type: "show-notification" }, [
          channel.port2,
        ]);
      });
    } else {
      if (Date.now() - (this.displayed.get(message.id) ?? 0) < 86400000) return true;
      const notification = new Notification(message.title, {
        body: message.body,
        icon: this.options.icon,
        tag: message.tag ?? message.id,
      });
      this.displayed.set(message.id, Date.now());
      if (this.displayed.size > 500)
        this.displayed.delete(this.displayed.keys().next().value ?? "");
      notification.onclick = () => {
        notification.close();
        window.focus();
        location.assign(url);
      };
    }
    return true;
  }
}
function decodeKey(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export type InstallPrompt = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
export function capturePwaInstall(onAvailable: (available: boolean) => void) {
  let prompt: InstallPrompt | null = null;
  const before = (event: Event) => {
    event.preventDefault();
    prompt = event as InstallPrompt;
    onAvailable(true);
  };
  const installed = () => {
    prompt = null;
    onAvailable(false);
  };
  window.addEventListener("beforeinstallprompt", before);
  window.addEventListener("appinstalled", installed);
  return {
    dispose() {
      window.removeEventListener("beforeinstallprompt", before);
      window.removeEventListener("appinstalled", installed);
    },
    async install() {
      const current = prompt;
      if (!current) return "unavailable" as const;
      prompt = null;
      onAvailable(false);
      await current.prompt();
      return (await current.userChoice).outcome;
    },
  };
}

export async function requestWebNotificationPermission() {
  const capabilities = notificationCapabilities();
  if (capabilities.requiresHomeScreen)
    throw new Error("Add this app to your Home Screen, open it there, then enable notifications.");
  if (!capabilities.notifications) throw new Error("This browser does not support notifications.");
  return Notification.requestPermission();
}
