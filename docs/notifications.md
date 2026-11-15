# Reusable notifications and Fitness OS setup

## When to read

Read this before changing browser push, Fitness reminders, or the shared notifications package. It covers permission, device subscriptions, the scheduled worker, and how `@shared/notifications` stays separate from toast UI.

`@shared/notifications` separates browser capabilities, service worker delivery,
WebSocket transport and the server push sender from fitness scheduling. Its
[package guide](../packages/notifications/README.md) and
[catalog](../packages/notifications/CATALOG.md) describe reuse in other apps.
Existing toast notifications in `@shared/runtime` remain a separate UI concern.

## Implemented flow

1. A saved Fitness OS revision inserts a revision-only event in the same database
   transaction. The owner's Supabase Realtime WebSocket receives it. Other-device
   changes show a reload/conflict message without overwriting current edits.
   Reconnecting checks the current server revision to catch missed events.
2. More → Notifications on this device requests permission only after a click,
   registers the worker and saves that owner's device subscription. Installation
   and notification consent remain separate actions. Allow open-app reminders
   requests foreground permission even when background keys are not configured.
3. Every minute, a secret-authenticated worker checks accounts with enabled devices,
   finds pending meal/supplement/water/workout reminders and queues each logical
   reminder once per enabled device. Open-app reminders remain a fallback.
4. The worker claims up to ten jobs per account with two-minute leases, sends Web Push and
   records bounded retries. Completed/edited schedules are rechecked by workspace
   revision before claim. A changed workspace cancels stale reminders implicitly;
   a still-due reminder is refreshed on the next minute run.
5. The service worker displays push notifications while the app is closed. A click
   opens a same-origin task link. Offline navigation shows a public reconnect page.

Background payloads use a generic title/body, without meal names, notes or dosage.
Device endpoints and keys have no browser database grants. Authenticated event
reads are account-scoped and expire. API requests and worker queries scope each
operation to its account because pooled database credentials can bypass RLS.

## Operator prerequisites

This code does **not** apply migrations, create secrets, configure a hosted job or
change production. Complete these steps in an approved preview environment first.

1. Apply the shared migration history including
   `supabase/migrations/20261105120000_reusable_notifications.sql`. It requires the
   Fitness OS workspace migration. Verify `notification_events` is in the existing
   `supabase_realtime` publication; the migration adds it if that publication
   exists. Enable that publication separately if the project has no Realtime setup.
2. Keep the Fitness project’s `SUPABASE_DB_URL`, Supabase public configuration and exact-origin `APP_URL` set.
3. Generate a VAPID key pair in a trusted local terminal:
   `pnpm --filter @shared/notifications exec web-push generate-vapid-keys`.
   Set `WEB_PUSH_PUBLIC_KEY`, server-only `WEB_PUSH_PRIVATE_KEY` and
   `WEB_PUSH_SUBJECT` (a real contact `mailto:` or HTTPS URL). Do not commit the
   output. Use matching keys across deployments sharing the same subscriptions.
   Key rotation requires disabling/re-enabling each subscribed device.
4. Generate an independent random `CRON_SECRET` of at least 32 characters, e.g.
   `openssl rand -hex 32`. Store it only in server configuration and the scheduler's
   secret store. Redeploy after configuring values. Only the public VAPID key is
   exposed by the owner-authorized settings endpoint.
5. Configure a minute scheduler for the HTTPS app endpoint
   `/api/cron/notifications`, GET with `Authorization: Bearer <CRON_SECRET>`.
   The reviewed optional script is
   [fitness-notification-cron.sql](../supabase/setup/fitness-notification-cron.sql).
   It uses existing Supabase Cron, pg_net and Vault; create Vault values
   `fitness_notification_origin` and `fitness_notification_cron_secret` first.
   The origin has no trailing slash and points to Fitness OS, not MyDevStudio.
   This script is separate from automatic migrations and is never run by tests.
6. Inspect both job execution and HTTP response status, not just whether cron ran.
   A successful worker response reports aggregate processed/sent/retry/expired/
   failed counts without subscription details. `failedAccounts` counts accounts whose worker operations could not finish. 403 means missing/wrong/short
   secret; 503 means configuration, storage or delivery unavailable.

[Supabase's scheduling guidance](https://supabase.com/docs/guides/functions/schedule-functions)
uses Cron, pg_net and Vault. pg_net temporarily stores decrypted authorization
headers while its HTTP request is queued, so database login/extension access must
remain restricted. An equivalent scheduler can call this endpoint; ensure its
frequency and timeout match reminder requirements. No minute-frequency Vercel Cron
job is silently enabled by this change.

## Behavior and operational limits

- Web Push requires HTTPS and a supporting browser. On iOS/iPadOS 16.4+, install
  via Share → Add to Home Screen, open the installed app, then enable notifications
  from that user action. See [WebKit guidance](https://webkit.org/blog/13878/).
- Browser/OS power and focus policies affect arrival. Provider acceptance is not
  proof of display. Delivery is at least once, not guaranteed exactly once or at
  an exact minute. Stable IDs and tags reduce repeated alerts.
- The worker catches up two minutes (maximum configurable lookback five minutes).
  Longer scheduler outages do not replay old reminders. Queue events expire after
  five minutes; processing is bounded and retry attempts stop at three.
- DST gaps are skipped; the first occurrence of a repeated wall-clock minute is
  used. Lead times crossing midnight still target the correct task date.
- Browser permission is per origin/device. The global reminder switch schedules
  tasks, while device subscription opts that device into delivery. Global opt-out
  prevents claiming queued task reminders; an already submitted push cannot be
  recalled. The test notification is independent of the scheduling switch.
- The app caps active devices at ten. A 404/410 disables that subscription. Sign
  out attempts to revoke this device and unsubscribe locally before logout.
- Expired events older than one day are pruned during worker runs and workspace
  revision writes. Delivery rows cascade with their event. Private subscriptions
  remain until disabled or the account is deleted; they are never put in caches.
- PWA offline support is a public fallback only. It does not cache private HTML,
  API data, health records or writes. The app needs a connection to edit/save.
- Browser and server entries stay separate. Never send VAPID private keys, cron
  secrets, database credentials or raw provider errors to a client or log.

## Rollback and verification

Pause the scheduler with `select cron.unschedule('fitness-os-notifications');`,
then disable this device in the app if needed. Removing VAPID configuration disables
background delivery without deleting fitness data. Revert application code before
considering removal of notification tables/trigger, in an approved migration.

Follow the [manual acceptance guide](testing/manual/notifications.md). Automated
fixtures test real SQL/transactions/RLS, simulated push providers and local browser
behavior. They do not verify live Supabase Realtime, provider delivery, scheduler
permissions or a physical iPhone. Those checks remain explicitly Not run until an
operator configures a deployment and records the device result.
