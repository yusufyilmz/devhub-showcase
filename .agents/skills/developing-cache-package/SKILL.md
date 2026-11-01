---
name: developing-cache-package
description: Change Redis rate limits and the cache client in @shared/cache. Use
  when editing visitor chat limits, CV import limits, studio assistant limits,
  Redis key names, or RedisCacheClient in packages/cache.
---

# Developing the cache package

`packages/cache` is `@shared/cache`. It owns Upstash Redis access and the attempt limits for visitor chat, CV import, and the studio assistant. A limit helper returns whether the action may continue. It does not authorize the caller. The app route checks identity first, then asks the limiter.

Read [the file map](references/map.md) and [packages/cache/CATALOG.md](../../../packages/cache/CATALOG.md).

`@shared/lib/cache` is a different module, the service-worker cache manager. Do not add Redis counters there. Do not store profile documents, prompts, CV text, or tokens in Redis. Counters and key prefixes only.

## Current limits

The scripts increment counters and set a TTL on the first hit. They return `1` when allowed and `0` when the action must stop. The helpers return a boolean.

| Helper                                     | Windows                                                                       | Keys                                                                                                  |
| ------------------------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `allowPortfolioChat(profileId, sessionId)` | 10 per visitor per 60 seconds, 100 per portfolio per hour, 500 global per day | `mydevstudio:chat:<profileId>:<sessionId>`, `mydevstudio:chat:<profileId>`, `mydevstudio:chat:global` |
| `allowCvImport(userId)`                    | 3 per user per hour, and a daily global cap                                   | `cv-import:user:<userId>`, `cv-import:global`                                                         |
| `allowStudioAssistant(account)`            | 10 per account per hour, 100 global per day                                   | `studio-assistant:user:<account>`, `studio-assistant:global`                                          |

The CV import daily cap reads `CV_IMPORT_DAILY_LIMIT`, defaulting to 100. A non-positive or non-integer value falls back to 100. Keep that fallback.

`RedisCacheClient` prefixes keys with `devhub-showcase` unless the caller passes another prefix. `get`, `set`, `expire`, and `incr` are the operations. Limits above use `@upstash/redis` `eval` directly so the check stays atomic. Prefer that pattern for a new limit. Do not split the increment and the expiry into separate round trips.

## Add or change a limit

1. Identify the caller. Visitor chat limits are used from `features/chat/portfolio-chat.ts` and `features/chat/premium-chat.ts`. CV import and the studio assistant call their helpers from `app/api/admin/cv-import/route.ts` and `app/api/admin/assistant/route.ts`.
2. Add a script and helper under `src/lib`. Export the helper from `src/index.ts` and add a catalog row.
3. Key by the server-derived profile id, user id, or account. Do not key only by a client-supplied address or a body field the caller can rotate to reset the bucket, unless the existing visitor-session key is the pattern you are extending on purpose.
4. Fail closed when Redis is missing or errors, at the route. Read the route before changing that behavior. These helpers construct a client from `REDIS_URL` and `REDIS_TOKEN` and will reject if that call fails. Do not catch that error inside the helper and return true.
5. Do not log the Redis token, the script result alongside user content, or the request body.
6. A refused limit is not an authorization failure. Keep the route's 401 or 403 path separate from the limit response.

This package's `package.json` exposes the root through `main` (`src/index.ts`) and has no `exports` map. Callers import `@shared/cache`. If you add a subpath, add an `exports` map and keep `pnpm check:exports` passing.

## Configuration

`REDIS_URL` and `REDIS_TOKEN` are server environment variables. `CV_IMPORT_DAILY_LIMIT` is optional. Document a new name in `.env.example` without a real value. A credential-free build and the unit tests must still run. Do not require a live Redis server in Vitest.

## Verification

```sh
pnpm --filter @shared/cache typecheck
pnpm exec vitest run --project unit apps/my-dev-studio/features/chat
pnpm exec vitest run --project unit apps/my-dev-studio/app/api/admin/cv-import/route.test.ts
pnpm exec vitest run --project unit apps/my-dev-studio/app/api/admin/assistant/route.test.ts
```

Add a colocated test next to a new helper if the script's thresholds are the behavior under test. Stub Redis. Do not point tests at production.

## Related skills

- [Developing the assistant package](../developing-assistant-package/SKILL.md)
- [Developing the lib package](../developing-lib-package/SKILL.md)
- [Developing the MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)
