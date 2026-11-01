# Auth package map

Package `@shared/auth` in `packages/auth`.

| Export                               | File                           | Use                                                                   |
| ------------------------------------ | ------------------------------ | --------------------------------------------------------------------- |
| `@shared/auth`                       | `src/index.ts`                 | `requireConfirmedUser`, `AuthAccessError`, `sameOrigin`, `AuthClient` |
| `@shared/auth/handlers`              | `src/handlers.ts`              | `createAuthHandlers`                                                  |
| `@shared/auth/client`                | `src/client.ts`                | Browser `createClient`                                                |
| `@shared/auth/server`                | `src/server.ts`                | Server `createClient`                                                 |
| `@shared/auth/middleware`            | `src/middleware.ts`            | `updateSession`                                                       |
| `@shared/auth/config`                | `src/config.ts`                | Public Supabase URL and key                                           |
| `@shared/auth/google-consent`        | `src/google-consent.ts`        | One-time Google profile consent                                       |
| `@shared/auth/google-profile-scopes` | `src/google-profile-scopes.ts` | People API scopes and categories                                      |

## App wiring

| App file                                             | Role                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| `apps/my-dev-studio/features/admin/auth-handlers.ts` | Builds handlers with portfolio paths and `requireWorkspace` |
| `apps/my-dev-studio/features/admin/admin-auth.ts`    | Workspace guard used after identity exists                  |
| `apps/my-dev-studio/app/auth/callback/route.ts`      | Callback route                                              |
| `apps/my-dev-studio/app/api/admin/google/route.ts`   | Google start                                                |
| `apps/my-dev-studio/app/api/admin/session/route.ts`  | Session                                                     |
| `apps/my-dev-studio/app/admin/login/page.tsx`        | Login page                                                  |

`LoginPanel` presentation is `@shared/components/login`. It receives endpoints as props.

## Invariants

- `requireConfirmedUser` demands `email_confirmed_at`.
- Return paths are options, never request input.
- `afterSignIn` sees a verified user only.
- Failed verification or provisioning clears the local session.
- Middleware refresh is not ownership.
- No service-role key in this package.
- Tests use fakes. They do not prove production OAuth or production RLS.

## Checks

```sh
pnpm --filter @shared/auth typecheck
pnpm exec vitest run --project unit packages/auth
```
