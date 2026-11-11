---
name: developing-lib-package
description: Develops shared services, repositories, database clients, schemas,
  models and Redis caching in packages/lib (@shared/lib). Use when editing
  profile or portfolio backends, Fitness persistence, validation, Supabase
  types, RedisCacheClient, or CV, chat, Studio and Fitness attempt limits.
---

# Developing the lib package

`packages/lib` is the workspace package `@shared/lib`. It owns shared backend implementations, validation, database/chat models, typed clients and Redis caching. Cache helpers are the `@shared/lib/cache` subpath, not a separate package.

Read [the file map](references/map.md), [the lib catalog](../../../packages/lib/CATALOG.md), and the current `packages/lib/package.json` exports before adding or moving a public entry point.

## Choose the owning layer

- Put database connections, Drizzle tables, client adapters and generated schema types in `src/db/`.
- Put persistence implementations in `src/repositories/<domain>/`; keep owner filters and transaction boundaries there.
- Put domain workflows in `src/services/<domain>/`. Pass repositories and configuration where the current API supports them.
- Put Zod validation in `src/schemas/<domain>/` and shared models in `src/types/`.
- Put Redis clients and atomic attempt helpers in `src/cache/`; export public helpers from its `index.ts` and `./cache` in the package manifest.

App routes own HTTP transport, verified identity, origin checks, cookies and app env wiring. Shared code must not import either app. Generic browser/cache/logging utilities remain in `@shared/utils`; portable UI remains in `@shared/ui`; AI provider workflows remain in `@shared/assistant`.

## Package boundaries

Use relative imports inside lib and declared public exports across packages. `@shared/lib/cache` is an import path; the pnpm filter is `@shared/lib`. Do not recreate forwarding `services` or `cache` workspace packages. Read `package.json` rather than inventing deep imports. Public paths have at most two segments after the package name.

Import generated `Database` and `Json` through `@shared/lib/types`, and typed auth clients through `@shared/lib/supabase` or its exported browser/server entry points. Do not hand-edit generated Supabase schema files. Update schemas, persisted types, save/import boundaries and renderers together when stored data changes; preserve documents that omit newer fields.

## Authorization and persistence

Preserve caller-scoped authenticated clients, owner isolation, revision conflicts and transaction atomicity. Public profile reads use explicit published website/CV snapshots; missing or private profiles never fall back to another owner. Private saves do not implicitly publish. Do not apply production migrations, change roles, transfer ownership or publish content as a side effect of development.

## Redis and rate limits

The boolean helpers in `@shared/lib/cache` limit attempts; they do not authenticate or authorize. Derive account/profile keys on the server, and preserve separate visitor, Studio, Fitness and global buckets. Read [the limit map](references/map.md#redis-limits) before changing thresholds or key prefixes.

Keep increment/expiry operations atomic with Redis Lua. Missing or failed Redis calls must not become permission to continue. The CV daily cap defaults to 100 when its configured value is missing, non-positive or non-integer. `RedisCacheClient` defaults to the `devhub-showcase` prefix; preserve caller overrides and TTL behavior. Never store raw profile documents, prompts, CV text or credentials in rate-limit counters.

`REDIS_URL` and `REDIS_TOKEN` are server settings; `CV_IMPORT_DAILY_LIMIT` is optional. Keep examples and relevant app schemas aligned when configuration changes. Never import app env modules into lib or require live Redis for tests. The service-worker cache in `@shared/utils/cache` is a separate concern.

## Verification

Run from the repository root, using the installed Node/pnpm versions:

```sh
pnpm --filter @shared/lib typecheck
pnpm check:exports
pnpm exec vitest run --project unit packages/lib
pnpm exec vitest run --project unit apps/my-dev-studio/app/api/cv-import/route.test.ts
pnpm exec vitest run --project unit apps/my-dev-studio/app/api/assistant/route.test.ts
pnpm exec vitest run --project unit apps/my-fitness-app/app/api/assistant/route.test.ts
```

Choose affected API and domain tests; use stubbed providers and fictional accounts. Add colocated tests for changed thresholds, isolation, revision handling and failure behavior. Run both app builds when package boundaries can affect bundling. Report actual local checks separately from manual, provider and deployed verification. Update the catalog and applicable manual testing guide when behavior changes.

## Related skills

- [Shared development](../mydevstudio-development/SKILL.md)
- [Business rules](../mydevstudio-business/SKILL.md)
- [Assistant package](../developing-assistant-package/SKILL.md)
- [Auth package](../developing-auth-package/SKILL.md)
- [MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)
