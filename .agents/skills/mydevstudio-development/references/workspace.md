# Workspace map

The Next.js app is `apps/my-dev-studio` (`my-dev-studio`). Shared libraries use `@shared/*`. There is no `apps/web` or `packages/sections` package. Older docs that name those paths are stale; use this map and `AGENTS.md`.

| Location                  | Responsibility                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `apps/my-dev-studio`      | Next.js routes in `app/` and feature data access in `features/`                         |
| `apps/my-fitness-app`     | Fitness OS app. Its tables are in `supabase/migrations` and belong to `auth.users`      |
| `apps/storybook-app`      | Storybook for `packages/ui`                                                             |
| `packages/ui`             | Controls, sections, studio and portfolio surfaces, theme, notifications, and global CSS |
| `packages/config`         | Profile types, themes, section registry, and custom-section metadata                    |
| `packages/content`        | Page copy, including the home FAQ                                                       |
| `packages/auth`           | Supabase session helpers and Google sign-in                                             |
| `packages/assistant`      | CV PDF rendering                                                                        |
| `packages/assistant`      | Portfolio and editing assistants                                                        |
| `packages/lib`            | Shared services, repositories, validation, database clients and Redis cache             |
| `packages/runtime`        | Shared runtime helpers, including notifications                                         |
| `packages/utils`          | Logging and other shared utilities                                                      |
| `packages/trello`         | Trello board UI                                                                         |
| `tools/typescript-config` | Shared TypeScript configs                                                               |
| `tests`                   | Vitest unit, API, and UI coverage                                                       |
| `e2e`                     | Playwright scenarios grouped by page, and the local fake Supabase transport             |
| `supabase/migrations`     | Reviewed schema and RLS history                                                         |
| `docs`                    | Architecture and product references                                                     |

App features, and what stays out of shared packages:

| Feature      | Owns                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| `admin`      | Workspace auth, session handlers, Google profile import, owner edit link        |
| `billing`    | Stripe gateway, billing client, pricing, premium configuration, account status  |
| `chat`       | Visitor chat and main portfolio chat access                                     |
| `home`       | Home session links                                                              |
| `management` | Managed portfolios and their API helpers                                        |
| `platform`   | Site URL, platform metadata, page presentation, document request client         |
| `portfolio`  | Published and public profiles, metadata, branding, CV responses, page resources |

Root scripts coordinate packages with Turborepo. `pnpm-workspace.yaml` is the external dependency catalog. Add external versions there and reference `catalog:` in manifests. Use `workspace:*` for internal dependencies. Keep package export maps explicit. Do not add another package manager or lockfile.

Section renderers and editors live in `packages/ui/src/sections`. Import them through `@shared/ui/sections`. `RenderSection` and `EditSection` live in `src/sections/renderers` and `src/sections/editors`. Keep auth and database access in app routes and `features/`. Do not add a feature file that only re-exports a shared component. See `docs/reference/pageforge-section-migration.md` for source families.
