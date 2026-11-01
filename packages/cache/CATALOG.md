# Cache catalog

Rate limits and the Redis client for `@shared/cache`. Import from the package root. A limit helper returns whether the action may continue. It does not authorize the caller.

| Symbol                 | Path                                   | Use                          |
| ---------------------- | -------------------------------------- | ---------------------------- |
| `allowCvImport`        | `src/lib/cv-import-limit.ts`           | CV import attempt limit      |
| `allowPortfolioChat`   | `src/services/portfolio-chat-limit.ts` | Visitor chat attempt limit   |
| `allowStudioAssistant` | `src/lib/studio-assistant-limit.ts`    | Private editor attempt limit |
| `RedisCacheClient`     | `src/lib/redis-cache.ts`               | Shared Redis access          |
