<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## MyDevStudio app

This file applies to `apps/my-dev-studio` only. Package name `my-dev-studio`. The longer map is [Developing the MyDevStudio app](../../.agents/skills/developing-my-dev-studio-app/SKILL.md). Product notes are indexed in [docs/dev-studio](../../docs/dev-studio/README.md).

### Where code goes

Stop at the first yes.

1. A URL, metadata file, or HTTP handler belongs under `app/`. Keep the route thin.
2. Session, cookie, environment, or navigation binding stays beside that route. Admin, billing, and management may keep their existing feature modules.
3. Shared database and domain workflows belong in `@shared/lib`. Chat and assistant workflows belong in `@shared/assistant`. Controls belong in `@shared/ui`.

Do not add a file that only re-exports a shared component. Do not recreate removed `features/home`, `features/reviews`, `features/portfolio`, `features/platform`, or `features/chat` folders. There is no `lib` folder here and no `apps/web` package.

### Route rules

- A public profile route serves the published snapshot only. An unknown or private username is 404 and must not fall back to someone else's profile.
- Studio routes require the confirmed owner. Managed portfolios are a separate administrator flow. Transfer is explicit.
- Mutating personal APIs check origin, then the workspace guard. Profile saves keep the revision conflict response. Do not log the body.
- Do not publish a profile, transfer ownership, assign a role, or run a production migration as a side effect of editing a route.

### Checks

```sh
pnpm --filter my-dev-studio dev
pnpm --filter my-dev-studio typecheck
pnpm --filter my-dev-studio build
pnpm exec vitest run --project unit apps/my-dev-studio/app/api/admin/profile/route.test.ts
```

Colocate `route.test.ts` with `route.ts`. Browser tests live in `e2e/`. Use fixtures, not production Supabase, Stripe, OpenAI, or Redis.
