# Notifications catalog

| Entry                             | Responsibility                                                                                                                           |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `@shared/notifications`           | Validated message shape, same-origin URL guard, browser capability detection and stable message IDs                                      |
| `@shared/notifications/client`    | NotificationClient: explicit permission, worker registration, push subscription/unsubscription and foreground display; capturePwaInstall |
| `@shared/notifications/websocket` | Backend-independent authenticated WebSocket client, reconnect/backoff, bounded message validation and duplicate filtering                |
| `@shared/notifications/server`    | Server-only VAPID sender, restricted push endpoint validation, subscription fingerprint and lease-aware delivery queue contract          |
| `@shared/notifications/worker`    | Generates a service worker for visible push, safe click navigation, receipt-based foreground deduplication and public offline fallback   |

No React, Supabase, fitness scheduling, user identity or database access is required
by the package. Apps own authorization, persistence, scheduling and their manifest.
The companion `@shared/ui/notification-preferences` accepts presentation props and
callbacks; it does not choose an API or store subscriptions.
