import { notificationWorker } from "@shared/notifications/worker";

export function GET() {
  return new Response(
    notificationWorker({
      cacheName: "fitness-notifications-v1",
      icon: "/icon-192.png",
      offlineUrl: "/offline.html",
      title: "Fitness OS",
    }),
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/javascript; charset=utf-8",
        "Service-Worker-Allowed": "/",
      },
    },
  );
}
