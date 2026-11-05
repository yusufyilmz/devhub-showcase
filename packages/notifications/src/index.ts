import { z } from "zod";

export const notificationSchema = z
  .object({
    body: z.string().max(300).default(""),
    id: z.string().min(1).max(200),
    tag: z.string().max(200).optional(),
    title: z.string().min(1).max(100),
    url: z.string().max(1000).default("/"),
  })
  .strict();
export type NotificationMessage = z.infer<typeof notificationSchema>;
export type ConnectionState = "connecting" | "connected" | "disconnected";
export function localNotificationUrl(value: string, origin: string) {
  const url = new URL(value, origin);
  if (
    url.origin !== origin ||
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("Notification links must stay in the application.");
  return url.href;
}
export function notificationCapabilities() {
  const browser = typeof window !== "undefined";
  const standalone =
    browser &&
    (window.matchMedia?.("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true);
  const ios =
    browser &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
  return {
    installed: standalone,
    notifications: browser && "Notification" in window,
    permission:
      browser && "Notification" in window ? Notification.permission : ("unsupported" as const),
    push: browser && "serviceWorker" in navigator && "PushManager" in window,
    requiresHomeScreen: ios && !standalone,
    secure: browser && window.isSecureContext,
  };
}

export async function stableNotificationId(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
