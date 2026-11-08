---
name: developing-my-dev-studio-app
description: Develop the Next.js app in apps/my-dev-studio. Use when adding a
  route, API handler, feature data-access module, page metadata, sitemap entry,
  or app-only admin, billing, chat, home, management, platform, or portfolio
  behavior.
---

# Developing the MyDevStudio app

`apps/my-dev-studio` is the Next.js app, package name `my-dev-studio`. Routes and metadata live in `app/`. App-specific data access and transport bindings are colocated with their owning pages/routes under `app/`. Portable persistence and domain workflows live in `@shared/lib`; chat/assistant workflows live in `@shared/assistant`. There is no `lib` folder in this app, and there is no `apps/web` package. Primitive controls come from `@shared/ui`; portfolio, studio, chat and companion compositions come from `@shared/assistant`.

Read [the file map](references/map.md). Read [mydevstudio-development](../mydevstudio-development/SKILL.md) for commands and [mydevstudio-business](../mydevstudio-business/SKILL.md) before changing ownership, publication, usernames, transfers, or CV privacy. `docs/architecture.md` still says `apps/web`. Follow this skill and `AGENTS.md`.

## Where code goes

Stop at the first yes.

1. A URL, metadata file, or HTTP handler must exist. Add it under `app/`. Keep the route file thin. Parse and status codes can live there. Use the shared domain workflow and colocate its app-specific binding.
2. The code binds app sessions, cookies, environment, navigation or API transport. Colocate that adapter with its page or route; a private sibling module may serve a route family. Put shared database/service logic in `@shared/lib` and chat/assistant workflows in `@shared/assistant`, with injected app dependencies.
3. Otherwise it belongs in a shared package. Use that package's skill. Do not add a feature file that only re-exports a shared component.

Feature folders:

| Feature      | Owns                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| `admin`      | Workspace auth, session handlers, Google profile import, owner edit link       |
| `billing`    | Stripe gateway, billing client, pricing, premium configuration, account status |
| `management` | Managed portfolios, transfer helpers, management UI wiring                     |

`features/admin/auth-handlers.ts` builds `@shared/auth` handlers with `/login`, `/admin`, and `/auth/callback`. `/admin/login` redirects to `/login`. `requireWorkspace` is the portfolio guard. It is not a generic login helper. Do not copy it into `@shared/auth`.

## Route rules

| Family          | Examples                                                                       | Rule                                                                              |
| --------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Public profile  | `app/[username]/page.tsx`, `app/[username]/cv.pdf/route.ts`                    | Published snapshot only. Unknown or private username is 404 with no other profile |
| Studio          | `app/[username]/edit/page.tsx`, `app/admin/page.tsx`                           | Confirmed owner                                                                   |
| Personal API    | `app/api/admin/profile/route.ts`, `app/api/admin/cv/route.ts`                  | Origin check on mutations, then `requireWorkspace`                                |
| Managed         | `app/admin/portfolios`, `app/api/admin/managed`                                | Separate administrator flow. Transfer is explicit                                 |
| Billing         | `app/api/billing/checkout`, `portal`, `webhook`, `pricing`                     | Gateway in `features/billing`                                                     |
| Chat and import | `app/api/portfolio-chat`, `app/api/admin/assistant`, `app/api/admin/cv-import` | Access, then `@shared/lib/cache`, then the assistant model                        |
| Compatibility   | `app/p/[id]`, `app/p/examples/[slug]`, `app/cv.pdf`                            | Keep the documented fallback. Do not use it for arbitrary usernames               |
| Platform        | `app/page.tsx`, `app/sitemap.ts`, `app/robots.ts`                              | Home and metadata. Personal metadata belongs on the username route                |

The profile save route reads the body as text, rejects a body over 250000 characters, parses JSON as `unknown`, and calls `ProfileService.save`. Keep the revision conflict response. Do not log the body.

Mutating handlers call `sameOrigin`. Return paths for auth come from `auth-handlers.ts`, not from the query string.

A new persisted field still updates `@shared/config`, `@shared/lib`, the renderer, and the PDF together. The route only maps errors: `ZodError`, `ProfileAccessError`, `ProfileConflictError`, `ProfileSetupError`, `ProfileNotFoundError`, and `ProfileUsernameError` stay distinct.

Do not publish a profile, transfer ownership, assign a role, or run a production migration as a side effect of editing a route.

## Presentation

Import studio and portfolio surfaces from `@shared/assistant` (`studio`, `portfolio`, `sections`). Import controls from `@shared/ui/<folder>`. The root layout loads `@shared/ui/globals.css` and wraps children in `PageShell` using `app/_presentation.ts`.

Pass fetched data and links into the shared screen. `app/[username]/_engineer-portfolio.tsx` is a route-family client boundary pattern. Add `"use client"` only for hooks and interaction.

`app/api/cv/_response.ts` binds the CV template to `@shared/assistant/cv-response`. Visibility and authorization stay in the route that calls it. `@shared/assistant/cv` does not know which route is public.

## Tests

Colocate `route.test.ts` next to `route.ts` and `module.test.ts` next to the feature module. Start with `describe`. Use synthetic users and the existing mocks. Do not point tests at production Supabase, Stripe, OpenAI, or Redis.

Browser coverage lives in `e2e/` by page: `home`, `portfolio`, `edit`, `login`, `admin/billing`, `admin/portfolios`, and `examples`. A flow that edits and then checks the published page stays in `edit`. Playwright uses fixture transport. Do not retarget it at a real database.

```sh
pnpm --filter my-dev-studio dev
pnpm --filter my-dev-studio typecheck
pnpm exec vitest run --project unit apps/my-dev-studio/app/api/admin/profile/route.test.ts
pnpm --filter my-dev-studio build
```

For a UI or route change, exercise the flow in the browser against the dev server: load, submit, and open the other page that reads the same state. Check a narrow viewport when layout changes. Run `pnpm test:e2e` after a production build when the change affects a covered flow. The dev script is `next dev --webpack`. The build script is `next build --webpack`.

`pnpm --filter my-dev-studio demo:seed` runs `scripts/seed-demo.mjs` with `.env.local` if it exists. Do not run it against production. Do not commit seed output that contains private data.

## Verification before a PR

Run `pnpm check` and `pnpm test`. For a route or UI change that can affect the production build, also run `pnpm --filter my-dev-studio build`. State which commands ran. A local build does not prove a Vercel deployment.

## Related skills

- [Developing the UI package](../developing-ui-package/SKILL.md)
- [Shared backend development](../mydevstudio-development/SKILL.md)
- [Developing the auth package](../developing-auth-package/SKILL.md)
- [Developing the lib package](../developing-lib-package/SKILL.md)
- [Developing the assistant package](../developing-assistant-package/SKILL.md)
- [Business rules](../mydevstudio-business/SKILL.md)

## Colocated routes and generated catalogs

Do not recreate `features/home`, `features/reviews`, `features/portfolio`, `features/platform` or `features/chat`. Their single-use bindings live in page/route entry points; shared route-family bindings and tests are private siblings under `app`. Existing admin, billing and management integrations remain separate.

Workspace catalogs are generated with `pnpm generate:catalogs` and checked with `pnpm check:catalogs`. Edit `catalog.template.md` for authored guidance and package metadata/source for the generated reference. UI registry markers still work; the UI-specific commands are compatibility aliases. Never hand-edit a generated `CATALOG.md`.
