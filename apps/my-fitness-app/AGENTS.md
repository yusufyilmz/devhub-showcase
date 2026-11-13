<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## My Fitness Studio app

This file applies to `apps/my-fitness-app` only. Package name `my-fitness-app`. Product and domain notes are in [docs/fitness-app](../../docs/fitness-app/README.md). How to run this package is in [README.md](README.md).

### Where code goes

Stop at the first yes.

1. A URL, metadata file, or HTTP handler belongs under `app/`. Keep the route thin. `/api/state` loads and saves the signed-in account's workspace. `/preview` stays read-only and uses fictional data.
2. Fitness screens and app-only coordination stay in `features/`: task workspace, task tree, task editor, agenda, calendar, weekly planner, and notifications.
3. Task rules, scheduling, and repository contracts stay in this app's `lib/`. Shared sign-in is `@shared/auth`. Controls and theme are `@shared/ui`. Push delivery is `@shared/notifications`. Fitness assistant workflows that are shared belong in `@shared/assistant`.

Do not import this app from a shared package. Do not serve one account's tasks to another. A save must keep the owner filter and the revision check.

### Access

The API uses the verified cookie session or bearer token. Signed-out and unconfirmed requests get 401. A changed account or stale revision gets 409. The demo does not call the private state API.

### Checks

```sh
pnpm --filter my-fitness-app dev
pnpm --filter my-fitness-app typecheck
pnpm --filter my-fitness-app test
pnpm --filter my-fitness-app build
```

The dev server is port 3002. Colocate a route test with its route. Domain and persistence tests live in `tests/`. Browser tests live in `e2e/`. Use fixtures. Do not point tests at production Supabase, OpenAI, or Redis.
