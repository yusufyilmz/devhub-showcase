<!-- Generated from tools/cli/catalog/templates/package.md.hbs, package.json, the pnpm-workspace.yaml catalog, and declared public exports. Run pnpm generate:catalogs. -->

# Auth catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "session" --package @shared/auth --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/auth`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

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

| Import                    | Source / condition         | Declared symbols                                                                                                                                                                         |
| ------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@shared/auth`            | `./src/index.ts`           | `AuthAccessError`, `requireConfirmedUser`, `sameOrigin`, `type AuthClient`                                                                                                               |
| `@shared/auth/client`     | `./src/client.ts`          | `createClient`                                                                                                                                                                           |
| `@shared/auth/config`     | `./src/config/index.ts`    | `supabaseConfig`, `supabaseConfigured`                                                                                                                                                   |
| `@shared/auth/handlers`   | `./src/handlers/index.ts`  | `createAuthHandlers`, `type AuthHandlerOptions`                                                                                                                                          |
| `@shared/auth/middleware` | `./src/middleware.ts`      | `updateSession`                                                                                                                                                                          |
| `@shared/auth/providers`  | `./src/providers/index.ts` | `googleProfileCategories`, `googleProfilePermissions`, `grantedGoogleCategories`, `loadGoogleConsent`, `requestGoogleProfileConsent`, `type GoogleConsent`, `type GoogleProfileCategory` |
| `@shared/auth/server`     | `./src/server.ts`          | `createClient`, `createRequestClient`                                                                                                                                                    |

Symbol names are read statically from TypeScript declarations without executing their implementation modules. Wildcard package paths, external star re-exports and non-code assets are not expanded into symbol claims. Verify source contracts before importing.

| Script         | Command                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| `build`        | `tsdown`                                                                  |
| `clean`        | `node -e "require('node:fs').rmSync('dist',{recursive:true,force:true})"` |
| `format`       | `biome format --write .`                                                  |
| `format:check` | `biome format .`                                                          |
| `lint`         | `biome lint .`                                                            |
| `lint:check`   | `biome lint .`                                                            |
| `lint:fix`     | `biome lint --write .`                                                    |
| `typecheck`    | `tsc --noEmit`                                                            |
| `types:check`  | `pnpm typecheck`                                                          |

| Dependency                  | Declared version | Kind            |
| --------------------------- | ---------------- | --------------- |
| `@shared/config`            | `workspace:*`    | dependencies    |
| `@shared/env`               | `workspace:*`    | dependencies    |
| `@supabase/ssr`             | `0.12.7`         | dependencies    |
| `@supabase/supabase-js`     | `2.119.0`        | dependencies    |
| `next`                      | `16.4.5`         | dependencies    |
| `react`                     | `19.3.1`         | dependencies    |
| `react-dom`                 | `19.3.1`         | dependencies    |
| `zod`                       | `4.6.7`          | dependencies    |
| `@shared/cli`               | `workspace:*`    | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@types/node`               | `26.6.6`         | devDependencies |
| `@types/react`              | `19.3.0`         | devDependencies |
| `@types/react-dom`          | `19.3.0`         | devDependencies |
| `typescript`                | `7.0.2`          | devDependencies |
