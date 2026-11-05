"use client";

import {
  type NotificationMessage,
  notificationCapabilities,
  notificationSchema,
} from "@shared/notifications";
import {
  capturePwaInstall,
  NotificationClient,
  type PushRecord,
} from "@shared/notifications/client";

import { authorizationHeaders, browserAuth } from "@/lib/browser-session";

export const fitnessNotifications = new NotificationClient({
  icon: "/icon-192.png",
  workerUrl: "/notifications-sw.js",
});
let installer: ReturnType<typeof capturePwaInstall> | undefined;
let installAvailable = false;
let liveState = "disconnected";
const liveListeners = new Set<() => void>();
export const fitnessLiveState = () => liveState;
export function watchFitnessLive(listener: () => void) {
  liveListeners.add(listener);
  return () => {
    liveListeners.delete(listener);
  };
}
function updateLiveState(state: string) {
  liveState = state;
  liveListeners.forEach((listener) => listener());
}
const installListeners = new Set<() => void>();
export function initializeFitnessNotifications() {
  installer = capturePwaInstall((available) => {
    installAvailable = available;
    installListeners.forEach((listener) => listener());
  });
  fitnessNotifications.register().catch(() => undefined);
  return () => {
    installer?.dispose();
    installer = undefined;
  };
}
export const canInstallFitness = () => installAvailable;
export function watchFitnessInstall(listener: () => void) {
  installListeners.add(listener);
  return () => {
    installListeners.delete(listener);
  };
}
export async function installFitnessPwa() {
  return installer?.install() ?? "unavailable";
}
export async function notificationApi(method = "GET", body?: unknown, path = "/api/notifications") {
  const response = await fetch(path, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(await authorizationHeaders()) },
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok)
    throw new Error(
      "Notification settings could not be saved. Check your connection and try again.",
    );
  return response.json() as Promise<{
    configured: boolean;
    publicKey: string | null;
    revision?: number;
  }>;
}
export async function registerFitnessDevice(publicKey: string): Promise<PushRecord> {
  const client = new NotificationClient({
    applicationServerKey: publicKey,
    icon: "/icon-192.png",
    workerUrl: "/notifications-sw.js",
  });
  const subscription = await client.enablePush();
  try {
    await notificationApi("POST", { subscription });
  } catch (error) {
    await client.disablePush().catch(() => undefined);
    throw error;
  }
  return subscription;
}
export async function disableFitnessDevice() {
  const subscription = await fitnessNotifications.subscription();
  if (!subscription) return;
  try {
    await notificationApi("DELETE", { endpoint: subscription.endpoint });
  } finally {
    await fitnessNotifications.disablePush();
  }
}
export function subscribeFitnessNotifications(handlers: {
  revision: (revision: number) => void;
  message: (message: NotificationMessage) => void;
}) {
  let active = true;
  updateLiveState("connecting");
  let stop: () => void = () => undefined;
  browserAuth()
    .auth.getSession()
    .then(({ data }) => {
      const user = data.session?.user;
      if (!active) return;
      if (!user) {
        updateLiveState("disconnected");
        return;
      }
      const channel = browserAuth()
        .channel(`fitness-notifications:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            filter: `user_id=eq.${user.id}`,
            schema: "public",
            table: "notification_events",
          },
          (event) => {
            if (active && event.new.app_id === "fitness-os" && event.new.user_id === user.id)
              deliverFitnessEvent(event.new, handlers);
          },
        )
        .subscribe((status) => {
          if (!active) return;
          updateLiveState(status === "SUBSCRIBED" ? "connected" : "reconnecting");
          if (status === "SUBSCRIBED")
            notificationApi()
              .then((value) => {
                if (active && typeof value.revision === "number") handlers.revision(value.revision);
              })
              .catch(() => undefined);
        });
      stop = () => {
        browserAuth()
          .removeChannel(channel)
          .catch(() => undefined);
      };
    })
    .catch(() => {
      if (active) updateLiveState("disconnected");
    });
  return () => {
    active = false;
    updateLiveState("disconnected");
    stop();
  };
}

function deliverFitnessEvent(
  row: Record<string, unknown>,
  handlers: { revision: (value: number) => void; message: (message: NotificationMessage) => void },
) {
  if (row.kind === "invalidate" && row.topic === "workspace") {
    const value = row.message;
    if (
      value &&
      typeof value === "object" &&
      "revision" in value &&
      typeof value.revision === "number"
    )
      handlers.revision(value.revision);
    return;
  }
  if (row.kind !== "notification") return;
  const parsed = notificationSchema.safeParse(row.message);
  if (!parsed.success) return;
  handlers.message(parsed.data);
  if (notificationCapabilities().permission === "granted")
    fitnessNotifications.show(parsed.data).catch(() => undefined);
}
