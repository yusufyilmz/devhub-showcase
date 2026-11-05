# Notifications and PWA — manual testing

**Scope/status:** Implemented reusable package and Fitness OS integration. Hosted
acceptance requires configuration; live provider and physical iOS checks are not
complete. No production migration or scheduler has been applied by this work.

**Prerequisites:** [Notification setup](../../notifications.md), a disposable
confirmed Fitness account, a different account, a signed-out
browser and fictional tasks. Start Fitness OS locally on port 3002, or replace
`http://localhost:3002` below with the actual HTTPS Fitness OS preview origin.
The studio deployment is a different app: do not use its host for these routes.
Apply the notification migration, enable Realtime, configure VAPID/CRON_SECRET and
schedule the minute worker before hosted delivery checks. Use an iPhone/iPad with
iOS/iPadOS 16.4+ for installation checks.

**Manual result:** Not run against a hosted provider or physical device. Local
fixture evidence is listed separately below; it does not complete these steps.

| Step | Clickable URL                                                   | Route path                | Action                                                                                                                                                                 | Expected result                                                                                                                                             | Actual result / evidence                                                            |
| ---- | --------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1    | [Owner login](http://localhost:3002/login)                      | `/login`                  | Sign in as the confirmed Fitness account. Open More.                                                                                                                   | Device notification panel appears; no permission prompt on page load.                                                                                       | Not run; browser consent covered by unit fixtures.                                  |
| 2    | [Notification settings](http://localhost:3002/?view=More)       | `/?view=More`             | Select Enable notifications on this device and grant browser permission.                                                                                               | Device becomes subscribed only after the server saves it. Reload preserves subscription.                                                                    | Not run against a provider.                                                         |
| 3    | [Notification settings](http://localhost:3002/?view=More)       | `/?view=More`             | Select Send test notification, then click the delivered notification.                                                                                                  | Visible Fitness OS notification opens settings on the same origin. A provider failure does not claim success.                                               | Not run against a provider; worker and route fixtures cover failure/navigation.     |
| 4    | [Notification settings](http://localhost:3002/?view=More)       | `/?view=More`             | Enable routine reminders and set lead minutes to zero. Save a pending meal/water/supplement/workout for the next few minutes; close the app.                           | Minute worker sends a generic reminder without sensitive task title or notes. Click opens the correct date/task.                                            | Not run; requires scheduler, keys and a real subscribed device.                     |
| 5    | [Day view](http://localhost:3002/?view=day)                     | `/?view=day`              | Complete or reschedule a due task before worker claim; repeat with global reminders off.                                                                               | Old queued task reminder is not claimed; unrelated edits never overwrite another device's unsaved view.                                                     | SQL stale-revision tests passed; physical delivery not run.                         |
| 6    | [Workspace](http://localhost:3002/)                             | `/`                       | Open two owner sessions. Save in one, then disconnect/reconnect the other session.                                                                                     | Realtime status reflects connection; second session requests reload for newer revision without overwriting edits. Reconnect checks current server revision. | Adapter fixtures cover owner filter and reconnect resync; hosted WebSocket not run. |
| 7    | [Notification settings](http://localhost:3002/?view=More)       | `/?view=More`             | Disable this device; reload. Re-enable, revoke browser permission, and try enabling again.                                                                             | Unsubscribe persists; denied permission shows an actionable error and no false subscription success.                                                        | Browser client/UI unit fixtures passed; real device not run.                        |
| 8    | [Notification settings](http://localhost:3002/?view=More)       | `/?view=More`             | Select Sign out; then sign in as a different account. Try device controls and protected API calls.                                                                     | Current device is revoked/unsubscribed before logout; another account can register its own devices and cannot access the previous account’s subscription.   | SQL RLS and route authorization fixtures passed; live auth/device not run.          |
| 9    | [Public demo](http://localhost:3002/preview?view=More)          | `/preview?view=More`      | Open signed out and as another account.                                                                                                                                | Demo data is fictional and read-only. Device mutations are disabled. No permission prompt.                                                                  | Desktop/mobile fixture browser checks passed; live role checks not run.             |
| 10   | [Installable app](http://localhost:3002/)                       | `/`                       | On a supporting desktop/Android browser, use Install app when offered. On iOS use Share → Add to Home Screen, launch the installed app and enable notifications there. | Manifest has stable id/scope/icons; install prompt is user initiated; iOS browser explains installation before enabling.                                    | Physical install not run; capability/install event unit fixtures passed.            |
| 11   | [Workspace offline](http://localhost:3002/preview)              | `/preview`                | After worker activation, switch browser offline and navigate/reload. Inspect Cache Storage. Restore network and retry.                                                 | Public reconnect page only; cache contains offline fallback, no API/health data or private HTML. Online Retry returns to the app.                           | Desktop/mobile real worker and offline fallback checks passed.                      |
| 12   | [Worker endpoint](http://localhost:3002/api/cron/notifications) | `/api/cron/notifications` | Request without authorization, then use an approved test client with the server secret header. Never put the secret in a URL.                                          | Unauthorized request is 403. Configured worker returns aggregate counts; missing setup returns safe 503.                                                    | API fixtures passed; hosted scheduler not run.                                      |
| 13   | [Owner device API](http://localhost:3002/api/notifications)     | `/api/notifications`      | In disposable API tests, try another origin, oversized body, an arbitrary HTTPS endpoint and malformed keys.                                                           | Writes are rejected; endpoint destinations are restricted to trusted browser push providers. Private key and subscriptions never appear in GET output.      | API and sender fixtures passed.                                                     |
| 14   | [Foreground permission](http://localhost:3002/?view=More)       | `/?view=More`             | With background keys unset, choose Allow open-app reminders, grant permission and enable routine reminders.                                                            | Open-app reminders can display without a push subscription; closing the app requires configured background delivery.                                        | UI/client unit fixtures passed; physical display not run.                           |

## Local verification

- `pnpm check`: passed (format, lint, complexity, docs, exports and types).
- `pnpm test`: passed; final counts are recorded in the PR.
- Package, Fitness OS, MyDevStudio and Storybook production builds: passed.
- `pnpm exec playwright test --config playwright.fitness.config.ts`: four checks
  across desktop and mobile Chromium, using fictional local fixtures at
  [localhost:3200](http://localhost:3200/), path `/`.
- This browser environment returned denied notification permission despite an
  automation grant. The real worker correctly returned a failed-display
  acknowledgement; successful display/deduplication is covered with a simulated
  OS in worker unit tests. Actual visible OS delivery is **Not run**.
- To repeat browser checks, first build Fitness OS with the same fixture public
  Supabase URL/key used by `playwright.fitness.config.ts`, then run the command
  above. Its local server uses placeholder credentials and REST responses are
  intercepted; no live database or push provider is contacted.

## Related evidence

- Shared transport/worker/browser/sender tests:
  `packages/notifications/src/*.test.ts`.
- Database/route/timing/realtime adapter tests:
  `apps/my-fitness-app/features/notifications/*.test.ts`.
- Reusable settings UI and stories:
  `packages/ui/src/forms/notification-preferences/`.
- Optional operator-run scheduler:
  `supabase/setup/fitness-notification-cron.sql`.
- Automated browser checks, configuration and execution results are recorded in
  the PR. These use local fictional data and do not contact a live push service.
