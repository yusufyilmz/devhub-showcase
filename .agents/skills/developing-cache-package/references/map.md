# Cache package map

Package `@shared/cache` in `packages/cache`. Import from `@shared/cache`.

| Symbol                 | File                                   | Returns                                             |
| ---------------------- | -------------------------------------- | --------------------------------------------------- |
| `allowCvImport`        | `src/lib/cv-import-limit.ts`           | Whether another CV import attempt may continue      |
| `allowPortfolioChat`   | `src/services/portfolio-chat-limit.ts` | Whether another visitor chat attempt may continue   |
| `allowStudioAssistant` | `src/lib/studio-assistant-limit.ts`    | Whether another private editor attempt may continue |
| `RedisCacheClient`     | `src/lib/redis-cache.ts`               | Prefixed get, set, expire, and incr                 |
| `cvImportLimitScript`  | `src/lib/cv-import-limit.ts`           | Lua used by the CV helper                           |
| `studioLimitScript`    | `src/lib/studio-assistant-limit.ts`    | Lua used by the studio helper                       |

`src/lib/cache.ts` and `src/types/index.ts` support the client. The package root is `src/index.ts`.

## Call sites

| Helper                 | Caller                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| `allowPortfolioChat`   | `features/chat/portfolio-chat.ts` and `features/chat/premium-chat.ts` |
| `allowStudioAssistant` | `app/api/admin/assistant/route.ts`                                    |
| `allowCvImport`        | `app/api/admin/cv-import/route.ts`                                    |

## Not this package

| Lookalike                                        | Actual owner                        |
| ------------------------------------------------ | ----------------------------------- |
| `@shared/lib/cache` and `packages/lib/src/cache` | Service-worker cache manager        |
| Profile snapshot cache headers                   | The route that sets `Cache-Control` |
| Browser fetch debounce                           | `@shared/runtime`                   |

## Environment names

- `REDIS_URL`
- `REDIS_TOKEN`
- `CV_IMPORT_DAILY_LIMIT` optional, default 100

## Checks

```sh
pnpm --filter @shared/cache typecheck
```
