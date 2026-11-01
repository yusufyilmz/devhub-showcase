# Auth catalog

Session helpers and Google sign-in for `@shared/auth`. Import a specific entry point. Do not treat a client-supplied id as authority.

| Export                         | Path                           | Use                                                     |
| ------------------------------ | ------------------------------ | ------------------------------------------------------- |
| `@shared/auth`                 | `src/index.ts`                 | `requireConfirmedUser`, `AuthAccessError`, `sameOrigin` |
| `@shared/auth/handlers`        | `src/handlers.ts`              | `createAuthHandlers` for Google and password sign-in    |
| `@shared/auth/client`          | `src/client.ts`                | Browser `createClient`                                  |
| `@shared/auth/server`          | `src/server.ts`                | Server `createClient`                                   |
| `@shared/auth/middleware`      | `src/middleware.ts`            | `updateSession` for middleware                          |
| `@shared/auth/config`          | `src/config.ts`                | Public Supabase URL and key                             |
| `@shared/auth/google-consent`  | `src/google-consent.ts`        | One-time Google profile consent                         |
| `@shared/auth/google-provider` | `src/google-profile-scopes.ts` | Profile categories and People API scopes                |
