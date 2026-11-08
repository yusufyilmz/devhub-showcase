# Lib catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "profile" --package @shared/lib --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/lib`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.ai/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

`@shared/lib` owns shared backend services, repositories, validation, domain models, database clients, and Redis caching. It uses one shared database layer. Source files are grouped by layer; services and repositories are organized into domain folders within each layer.

## Source layout

| Directory           | Responsibility                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/cache/`        | Redis cache access and atomic attempt limits, exported through `@shared/lib/cache`                            |
| `src/db/`           | Shared Postgres connection, anonymous Supabase discovery client, Drizzle tables, seeds and v1 data conversion |
| `src/repositories/` | Profile, workspace, task, planning and portfolio resource persistence                                         |
| `src/services/`     | Profile, portfolio, scheduling, meal planning, companion progress and rate limiting                           |
| `src/types/`        | Task, workspace and nutrition models and model defaults                                                       |
| `src/schemas/`      | Zod schemas and workspace validation                                                                          |

Repositories receive the database client or transaction they need. Services receive repositories where applicable. The shared database layer does not replace caller-scoped authenticated clients with a global session.

## Public entry points

Public imports use at most **two** path segments after the package name (see AGENTS.md). Existing domain entry points remain available and resolve directly into the new layers.

| Export                               | Path                                        | Use                                                                  |
| ------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------- |
| `@shared/lib`                        | `src/index.ts`                              | Existing fitness and studio aggregate                                |
| `@shared/lib/cache`                  | `src/cache/index.ts`                        | Redis client and CV, visitor chat, Studio and Fitness attempt limits |
| `@shared/lib/db/*`                   | `src/db/*`                                  | Shared clients, tables, seeds and v1 conversion                      |
| `@shared/lib/repositories/profile`   | `src/repositories/profile/index.ts`         | Supabase profile persistence                                         |
| `@shared/lib/repositories/workspace` | `src/repositories/workspace/index.ts`       | Owner-scoped workspace transactions                                  |
| `@shared/lib/repositories/task`      | `src/repositories/workspace/task.ts`        | Task storage                                                         |
| `@shared/lib/repositories/planning`  | `src/repositories/workspace/planning.ts`    | Planning storage                                                     |
| `@shared/lib/services/profile`       | `src/services/profile/index.ts`             | Profile saves and profile aggregate                                  |
| `@shared/lib/services/task`          | `src/services/task/index.ts`                | Task operations                                                      |
| `@shared/lib/services/rate-limiter`  | `src/services/rate-limiter/index.ts`        | Rate limiting                                                        |
| `@shared/lib/types`                  | `src/types/index.ts`                        | Models, defaults, date helpers and existing validation exports       |
| `@shared/lib/schemas`                | `src/schemas/index.ts`                      | Validation schemas and workspace validation                          |
| `@shared/lib/profile`                | `src/services/profile/index.ts`             | Profile repository contracts, errors and services                    |
| `@shared/lib/published-profile`      | `src/services/profile/published-profile.ts` | Public snapshot reads and username resolution                        |
| `@shared/lib/user-profile`           | `src/services/profile/user-profile.ts`      | Verified-account profile bootstrap                                   |
| `@shared/lib/portfolio`              | `src/services/portfolio/index.ts`           | Published portfolio resources                                        |
| `@shared/lib/studio`                 | `src/services/studio/index.ts`              | Portfolio persistence and resource services                          |
| `@shared/lib/fitness`                | `src/services/fitness/index.ts`             | Existing fitness aggregate                                           |
| `@shared/lib/workspace`              | `src/services/workspace/index.ts`           | Workspace repositories, access and saves                             |
| `@shared/lib/schedule`               | `src/services/schedule/index.ts`            | Schedule, agenda and task operations                                 |
| `@shared/lib/meal`                   | `src/services/meal/index.ts`                | Meal, shopping and weekly planning                                   |
| `@shared/lib/companion-progress`     | `src/services/companion/index.ts`           | Private feature completion                                           |
| `@shared/lib/rate-limiter`           | `src/services/rate-limiter/index.ts`        | Rate limiting                                                        |

Portfolio resource persistence classes retain their existing `*Service` names for callers; their implementations now live under `repositories/`.

Public profile reads use separate explicit website/CV snapshots. Canonical repository saves remain private; the existing publication argument does not publish. Username alias resolution returns no private document or account identity.

Task validation preserves earlier basic details, standalone exercise prescriptions/set history and postponed-workout details without rewriting stored JSON. Workspace writes retain owner filters, atomic transactions and revision conflict guards.

Billing remains owned by `@shared/billing`; this package does not duplicate its implementation.

## Shared app backends

App adapters supply verified identity, cookies and configuration. Shared implementations never import either app.

| Export                                        | Implementation                            | Responsibility                                        |
| --------------------------------------------- | ----------------------------------------- | ----------------------------------------------------- |
| `@shared/lib/fitness-notifications`           | `src/repositories/notifications/index.ts` | Owner-scoped devices, queues and delivery leases      |
| `@shared/lib/fitness-notification-handlers`   | `src/services/notifications/index.ts`     | Subscriptions, test delivery and reminder dispatch    |
| `@shared/lib/fitness-reminders`               | `src/services/notifications/reminders.ts` | Timezone/DST-aware reminder calculations              |
| `@shared/lib/workspace-defaults`              | `src/services/workspace/defaults.ts`      | Empty and fictional demo workspaces                   |
| `@shared/lib/managed-portfolios`              | `src/services/management/index.ts`        | Managed workspace access composition and saves        |
| `@shared/lib/repositories/managed-portfolios` | `src/repositories/management/index.ts`    | Membership checks, manager-filtered reads and inserts |
| `@shared/lib/portfolio-publication`           | `src/services/portfolio/publication.ts`   | Publication status and guarded changes                |
| `@shared/lib/publication-schedule`            | `src/services/portfolio/schedule.ts`      | Schedule, cancel and status operations                |
| `@shared/lib/profile-history`                 | `src/services/profile/history.ts`         | Owner-scoped saved revision reads                     |
| `@shared/lib/portfolio-password`              | `src/services/portfolio/password.ts`      | Password hashing and signed browser grants            |
| `@shared/lib/portfolio-access`                | `src/services/portfolio/access.ts`        | Cookie-bound protected snapshot reads                 |
| `@shared/lib/db/portfolio-access`             | `src/db/portfolio-access.ts`              | Client creation from supplied URL/key                 |
| `@shared/lib/portfolio-unlock`                | `src/services/portfolio/unlock.ts`        | Bounded password verification and attempt limits      |
| `@shared/lib/portfolio-resources`             | `src/services/portfolio/resources.ts`     | Published resources and optional testimonials         |
| `@shared/lib/portfolio-reviews`               | `src/services/portfolio/reviews.ts`       | Review queue, moderation and referral intake          |
| `@shared/lib/google-profile`                  | `src/services/profile/google-profile.ts`  | Selected Google People fields and bounded IO          |

Existing app API tests exercise configured adapters. Persistence, password, reminder and Google IO tests are colocated with shared implementations.

## Domain folders

Services: `profile/`, `portfolio/`, `management/`, `workspace/`, `task/`, `schedule/`, `meal/`, `notifications/`, `companion/`, `rate-limiter/`, `fitness/`, and `studio/`.

Repositories: `profile/`, `portfolio/`, `management/`, `workspace/`, and `notifications/`.

Each domain contains its implementation files and colocated tests. `index.ts` is the domain entry point or the implementation itself. Database code, schemas and common models remain shared under `db/`, `schemas/`, and `types/`. Package exports map existing shallow module imports directly to their owning files; there are no files at the roots of `services/` or `repositories/`.

## Validation, models and database clients

| Export                          | Source                                        | Use                                                            |
| ------------------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| `@shared/lib/profiles`          | `src/schemas/profile/index.ts`                | Profile, CV variant, username, proposal and context validation |
| `@shared/lib/section`           | `src/schemas/section/index.ts`                | Section schemas                                                |
| `@shared/lib/section-templates` | `src/schemas/section/templates.ts`            | Versioned template import/export validation                    |
| `@shared/lib/project-schemas`   | `src/schemas/project/index.ts`                | Project request validation                                     |
| `@shared/lib/pageforge-import`  | `src/services/portfolio/pageforge-import.ts`  | PageForge conversion                                           |
| `@shared/lib/cv-import`         | `src/services/profile/cv-import.ts`           | Reviewed CV drafts                                             |
| `@shared/lib/cv-file`           | `src/services/profile/cv-file.ts`             | Bounded CV upload validation                                   |
| `@shared/lib/referral-category` | `src/services/portfolio/referral-category.ts` | Referral category guard                                        |
| `@shared/lib/types`             | `src/types/index.ts`                          | Shared domain, chat, database and resource models              |
| `@shared/lib/supabase`          | `src/db/clients/index.ts`                     | Typed browser/server clients and auth middleware               |

Generated Supabase schema types live in `src/db/generated/database.types.ts`. Import them through `@shared/lib/types`. Database ownership/publication fixture tests are under `src/db/rls`. Typed auth clients reuse `@shared/auth` without importing an app.

## Redis cache and attempt limits

Import these helpers from `@shared/lib/cache`, a subpath of `@shared/lib`, not a standalone workspace package. They are not re-exported by the package root.

| Symbol                                     | Source                                | Behavior                                                                                                                                  |
| ------------------------------------------ | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `allowCvImport(userId)`                    | `src/cache/cv-import-limit.ts`        | 3 attempts per user/hour plus a global daily cap; `CV_IMPORT_DAILY_LIMIT` defaults to 100 for missing, non-positive or non-integer values |
| `allowPortfolioChat(profileId, sessionId)` | `src/cache/portfolio-chat-limit.ts`   | 10 per visitor/minute, 100 per portfolio/hour, 500 global/day                                                                             |
| `allowStudioAssistant(account)`            | `src/cache/studio-assistant-limit.ts` | 10 per account/hour, 100 global/day under `studio-assistant` keys                                                                         |
| `allowFitnessAssistant(account)`           | `src/cache/studio-assistant-limit.ts` | Separate 10 per account/hour and 100 global/day under `fitness-assistant` keys                                                            |
| `RedisCacheClient`                         | `src/cache/redis-cache.ts`            | Prefixed `get`, `set`, `expire`, and `incr`; default prefix is `devhub-showcase`                                                          |

The attempt helpers use atomic Redis Lua scripts and return booleans. They do not authorize callers. Routes bind verified identities and handle Redis failures without granting access. Server configuration is `REDIS_URL`, `REDIS_TOKEN`, and optional `CV_IMPORT_DAILY_LIMIT`.

`src/cache/cache.ts` and `src/cache/types.ts` are internal cache adapters and contracts, not public exports. The separate `@shared/lib/rate-limiter` (`src/services/rate-limiter/index.ts`) uses `RedisCacheClient` and exposes a throwing `RateLimiter`; it is not the boolean attempt-helper API. The browser service-worker cache belongs to `@shared/utils/cache`.

## Updating this catalog

Check `package.json` exports and the owning barrel before adding an import. Keep paths shallow and update this catalog with public API changes. Use relative imports within lib; app modules and app env files must never become dependencies of this package. Test with fictional fixtures and stub Redis rather than using a live provider.

## Generated package reference

<!-- catalog:exports -->

<!-- catalog:scripts -->

<!-- catalog:dependencies -->
