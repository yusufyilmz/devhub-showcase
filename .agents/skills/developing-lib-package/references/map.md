# Lib file map

Workspace package: `@shared/lib` in `packages/lib`. Read [the catalog](../../../../packages/lib/CATALOG.md) and `packages/lib/package.json` for the full export map. All paths below are relative to `packages/lib`.

| Area                     | Source                               | Public imports                                                                        |
| ------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------- |
| Aggregate                | `src/index.ts`                       | `@shared/lib` (Fitness and Studio aggregates; not every subpath)                      |
| Database                 | `src/db/`                            | `@shared/lib/db/*`, `@shared/lib/migrations/*`                                        |
| Typed auth clients       | `src/db/clients/`                    | `@shared/lib/supabase`, `@shared/lib/supabase/browser`, `@shared/lib/supabase/server` |
| Generated database types | `src/db/generated/database.types.ts` | `@shared/lib/types`                                                                   |
| Repositories             | `src/repositories/`                  | Exported `@shared/lib/repositories/*` entries                                         |
| Domain services          | `src/services/`                      | Exported domain and `@shared/lib/services/*` entries                                  |
| Validation               | `src/schemas/`                       | `@shared/lib/schemas`, `@shared/lib/profiles`, `@shared/lib/section`                  |
| Models                   | `src/types/`                         | `@shared/lib/types`                                                                   |
| Redis                    | `src/cache/`                         | `@shared/lib/cache`                                                                   |
| General rate limiter     | `src/services/rate-limiter/index.ts` | `@shared/lib/rate-limiter`                                                            |

Services are grouped by profile, portfolio, management, workspace, task, schedule, meal, notifications, companion, rate-limiter, Fitness and Studio. Repositories are grouped by profile, portfolio, management, workspace and notifications. RLS fixtures live in `src/db/rls/`.

## Redis limits

| Helper                                     | Source                                | Limits and key prefixes                                                                                                                                      |
| ------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `allowCvImport(userId)`                    | `src/cache/cv-import-limit.ts`        | 3/user/hour, configurable global/day (default 100); `cv-import:user:<userId>`, `cv-import:global`                                                            |
| `allowPortfolioChat(profileId, sessionId)` | `src/cache/portfolio-chat-limit.ts`   | 10/visitor/minute, 100/portfolio/hour, 500/global/day; `mydevstudio:chat:<profileId>:<sessionId>`, `mydevstudio:chat:<profileId>`, `mydevstudio:chat:global` |
| `allowStudioAssistant(account)`            | `src/cache/studio-assistant-limit.ts` | 10/account/hour, 100/global/day; `studio-assistant:user:<account>`, `studio-assistant:global`                                                                |
| `allowFitnessAssistant(account)`           | `src/cache/studio-assistant-limit.ts` | Independent 10/account/hour, 100/global/day; `fitness-assistant:user:<account>`, `fitness-assistant:global`                                                  |
| `RedisCacheClient`                         | `src/cache/redis-cache.ts`            | Default key prefix `devhub-showcase`; `get`, `set`, `expire`, `incr`                                                                                         |

Lua results become booleans (`1` allowed, `0` refused). The Lua constants in the helper files and the cache types/store are internal, not package exports. The general `RateLimiter.isAllowed` throws on refusal; do not substitute it for the boolean helpers without adapting the caller.

## Call sites

- Visitor limits: `packages/assistant/src/services/main-portfolio-chat.ts` and `packages/assistant/src/services/premium-portfolio-chat.ts`.
- CV imports: `apps/my-dev-studio/app/api/cv-import/route.ts`.
- Studio/job assistant: `apps/my-dev-studio/app/api/assistant/route.ts` and `apps/my-dev-studio/app/api/assistant/job/route.ts`.
- Fitness assistant: `apps/my-fitness-app/app/api/assistant/route.ts`.

## Other owners

`@shared/utils/cache` owns the service-worker cache manager. Routes own HTTP cache headers, authorization and failure responses. `@shared/runtime` owns browser fetch/debounce helpers. Neither app's env module may be imported by lib.
