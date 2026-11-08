# Auth catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "session" --package @shared/auth --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/auth`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.ai/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

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

## Generated package reference

<!-- catalog:exports -->

<!-- catalog:scripts -->

<!-- catalog:dependencies -->
