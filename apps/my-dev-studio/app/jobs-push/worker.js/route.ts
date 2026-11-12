import { notificationWorker } from "@shared/notifications/worker";

export function GET() {
  return new Response(
    notificationWorker({
      cacheName: "job-hunter-notifications-v1",
      icon: "/studio-icon.svg",
      offlineUrl: "/studio-icon.svg",
      title: "Job Hunter",
    }),
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/javascript; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
