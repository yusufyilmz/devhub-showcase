---
name: developing-auth-package
description: Change Supabase session helpers and Google sign-in in @shared/auth.
  Use when editing requireConfirmedUser, createAuthHandlers, the browser or
  server client, session middleware, origin checks, or Google profile consent
  and People API scopes in packages/auth.
---

# Developing the auth package

`packages/auth` is `@shared/auth`. It proves a confirmed identity and refreshes a Supabase session. It does not decide who owns a portfolio, who may publish, or who may transfer a managed profile. Those checks stay in the app feature and in `@shared/lib`, with RLS behind them.

Read [the file map](references/map.md) and [packages/auth/CATALOG.md](../../../packages/auth/CATALOG.md). The app wires handlers in `apps/my-dev-studio/features/admin/auth-handlers.ts`. Read [mydevstudio-business](../mydevstudio-business/SKILL.md) before changing what happens after sign-in.

A client-supplied id is not authority. Do not read a return path from a query parameter or a forwarded host. Do not add a service-role key.

## Identity versus authorization

`requireConfirmedUser` calls `auth.getUser()` and requires `email_confirmed_at`. Otherwise it throws `AuthAccessError`. Session-refresh middleware is not an authorization guard. After this helper returns, the app still checks ownership for the portfolio being edited.

`sameOrigin` compares the request `Origin` header with the request URL origin. Mutating auth and profile routes use it. A missing or mismatched origin fails closed.

Google proves identity through Supabase. It does not grant portfolio ownership. `afterSignIn` runs only after the user is verified. The MyDevStudio handler passes `requireWorkspace` there. A failed verification or failed provisioning clears the local session.

## Handlers

`createAuthHandlers` in `src/handlers.ts` builds Google, password, callback, and sign-out handlers. Paths come from the options object:

| Option         | MyDevStudio value  | Rule                               |
| -------------- | ------------------ | ---------------------------------- |
| `loginPath`    | `/login`           | Local path only                    |
| `successPath`  | `/admin`           | Local path only                    |
| `callbackPath` | `/auth/callback`   | Local path only                    |
| `createClient` | app server client  | Supplied by the app                |
| `afterSignIn`  | `requireWorkspace` | App provisioning, not generic auth |

`appPath` rejects a path that does not start with `/`, starts with `//`, or contains a backslash. Keep that check. Register the callback in Supabase and the origin in Google when an environment changes. Sharing this package does not share cookies across domains.

Route files in the app export the handler methods. The package does not contain Next.js route files. Browser code imports `@shared/auth/client`. Server code imports `@shared/auth/server`. Middleware imports `@shared/auth/middleware` for `updateSession`. Keep those entry points split so a client component does not import Next.js server APIs.

Public Supabase URL and key are read in `src/config.ts`. Names of public configuration live in `.env.example`. Do not print values in logs or tests.

## Google profile import

`src/google-consent.ts` is the one-time consent gate for importing a Google profile. `src/google-profile-scopes.ts` lists profile categories and People API scopes. Reviewing which fields may be copied onto a portfolio is `@shared/lib/profiles`. The app route is `app/api/admin/google-profile`. Change the scope list, the consent flag, the reviewed field mapping, and the route together.

Do not request a broader scope than the import uses. Do not store the provider token in a portfolio document or a log line.

## Add an export

Current exports are `.`, `./handlers`, `./client`, `./server`, `./middleware`, `./config`, `./google-consent`, and `./google-profile-scopes`. Add a file, a `package.json` export, and a catalog row. Run `pnpm check:exports`.

This package may depend on Supabase and Zod. It must not depend on `@shared/ui`, `@shared/lib` portfolio repositories, or `apps/my-dev-studio`. The app depends on auth, not the other way around.

## Tests

Colocate tests next to the module. Existing coverage includes `google-consent.test.ts`, `shared-auth.test.ts`, and `supabase-config.test.ts`. Add cases for an unconfirmed user, a bad origin, a non-local return path, and a provisioning failure that clears the session. App route tests in `app/auth/callback/route.test.ts` and `app/api/admin/google/route.test.ts` cover the wired paths. Use synthetic users. Do not call a real Google OAuth server.

```sh
pnpm --filter @shared/auth typecheck
pnpm exec vitest run --project unit packages/auth
pnpm exec vitest run --project unit apps/my-dev-studio/app/auth/callback/route.test.ts
```

## Related skills

- [Shared backend development](../mydevstudio-development/SKILL.md)
- [Developing the MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)
- [Business rules](../mydevstudio-business/SKILL.md)
