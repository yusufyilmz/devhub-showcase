# @shared/notifications

Reusable WebSocket updates, Web Notifications, Web Push and PWA installation
helpers. Source exports work in this monorepo; `pnpm --filter @shared/notifications
build` also produces separate browser/server bundles. This workspace package is
private; publication to a registry is not part of this change.

## Browser setup

Add `@shared/notifications: workspace:*` to the consuming app. Serve the worker
from your own origin, and provide a manifest with stable id, start_url, scope,
standalone display and 192/512 icons. Register once on mount without requesting
permission. Capture the install event early and dispose it on unmount.

```ts
import { NotificationClient, capturePwaInstall } from "@shared/notifications/client";

const notifications = new NotificationClient({
  workerUrl: "/notifications-sw.js",
  scope: "/",
  applicationServerKey: publicVapidKey,
});
await notifications.register();
const install = capturePwaInstall(showInstallButton);
// Inside a user click handler, before any network awaits:
const subscription = await notifications.enablePush();
// POST subscription to an authenticated, same-origin server endpoint.
// If saving fails, unsubscribe locally and let the user retry.
// Disable: revoke this account's stored device, then notifications.disablePush().
// Install button: install.install(); unmount: install.dispose().
```

Push requires HTTPS (localhost is suitable for local browser checks), explicit
permission and a supported browser. iOS/iPadOS 16.4+ requires installation on the
Home Screen and opening that installed app before requesting permission. Call
`notificationCapabilities()` to distinguish unsupported, permission and install
states. Safari on iOS uses Share → Add to Home Screen rather than a Chromium
installation prompt. See [WebKit's platform guidance](https://webkit.org/blog/13878/).

## Service worker

Return `notificationWorker({cacheName, offlineUrl, icon, title})` from a JavaScript
route with `Content-Type: application/javascript`, `Cache-Control: no-cache,
no-store` and a suitable `Service-Worker-Allowed` header. Keep assets same-origin.
The worker caches only a public offline HTML fallback. It never caches API data,
authenticated pages or queued writes. Offline writes are outside this package.

Foreground display uses a worker message/acknowledgement. Receipts are written
only after display succeeds, expire after 24 hours, and fall back to bounded memory
when IndexedDB is unavailable. A duplicate _push_ still calls showNotification
with a stable tag and `renotify: false`, honoring user-visible push requirements;
foreground duplicates are suppressed. Click destinations stay within the app.

## Instant updates

```ts
import { connectNotificationSocket } from "@shared/notifications/websocket";

const disconnect = connectNotificationSocket({
  url: getFreshAuthenticatedSocketUrl,
  onMessage: displayInApp,
  onState: showConnectionState,
});
// Close on logout/unmount; authorization and token rotation stay with your app.
disconnect();
```

The client accepts WSS (WS on localhost only), validates messages, reconnects with
backoff and a fresh URL, ignores invalid/duplicate messages and stops on disposal.
Do not put a service credential in a WebSocket URL. Fitness OS instead adapts its
existing authenticated Supabase Realtime WebSocket client, including owner RLS,
SDK token refresh and a revision resync after reconnect. Other apps can use either
transport; no second WebSocket server is required by this package.

## Background delivery

Import `createPushSender` and `deliverQueuedNotifications` only in server code.
Supply VAPID subject/public/private keys per sender and implement DeliveryQueue:
atomically claim bounded jobs with a lease; finish only if that lease still owns
the job; persist retries and disable subscriptions on 404/410. The sender validates
subscriptions at admission and delivery and permits only known browser push
services, preventing arbitrary outbound request destinations. Custom deployments
may pass their own explicitly trusted hosts to validation, but must also adapt the
sender's validation policy. Browser code must never import the server entry point.

Delivery defaults to 20 concurrent jobs, capped at 50; Fitness OS uses 10. Retries
are bounded to three attempts. 404/410 expires a device, 429/network/5xx can retry,
and other 4xx fail. The 8-second provider timeout is a socket inactivity timeout;
run delivery in a bounded worker with expiring leases. Delivery is at least once:
a process failure after sending but before recording success may retry. Stable
notification IDs/tags reduce duplicate alerts but do not promise exactly-once OS
display or exact-time delivery. Provider acceptance does not prove device display.

See [Fitness OS setup](../../docs/notifications.md) for the working integration,
migration, minute worker configuration and configuration rollback.
