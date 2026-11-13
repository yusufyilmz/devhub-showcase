# Utils catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "logger" --package @shared/utils --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/utils`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

Logging and generic helpers for `@shared/utils`. Domain validation stays in `@shared/lib`.

| Export                        | Path                   | Use                                 |
| ----------------------------- | ---------------------- | ----------------------------------- |
| `@shared/utils`               | `src/index.ts`         | URLs, dates, ids, and debug helpers |
| `@shared/utils/logger`        | `src/logger`           | Server logger                       |
| `@shared/utils/client-logger` | `src/logger/client.ts` | Browser logger                      |
| `@shared/utils/cli-logger`    | `src/logger/cli.ts`    | CLI logger                          |
| `@shared/utils/i18n`          | `src/i18n`             | Shared i18n helpers                 |

| Symbol                                     | Use               |
| ------------------------------------------ | ----------------- |
| `createUUID`                               | Identifier helper |
| `joinUrl`, `toAbsoluteUrl`                 | URL joining       |
| `formatDateRange`, `capitalizeFirstLetter` | Text formatting   |
| `fetchTimeout`, `sleepMs`                  | Timing helpers    |
| `flatten`, `unflattenObject`               | Object flattening |

## Shared helper modules

| Export                     | Source                         | Use                                                                 |
| -------------------------- | ------------------------------ | ------------------------------------------------------------------- |
| `@shared/utils`            | `src/index.ts`                 | Existing helpers plus camel-case conversion, API client and fetcher |
| `@shared/utils/date`       | `src/date/index.ts`            | Date keys, shifting, week starts and labels                         |
| `@shared/utils/cache`      | `src/cache/index.ts`           | Browser service-worker cache management                             |
| `@shared/utils/errors`     | `src/errors/index.ts`          | Request errors and standard JSON error responses                    |
| `@shared/utils/types`      | `src/types/api.ts`             | Generic API response type                                           |
| `@shared/utils/axios`      | `src/http/axios.ts`            | Instrumented Axios client                                           |
| `@shared/utils/api-client` | `src/http/api-client.ts`       | Configured JSON API client                                          |
| `@shared/utils/fetcher`    | `src/http/fetcher.ts`          | JSON fetch helper                                                   |
| `@shared/utils/converters` | `src/converters/camel-case.ts` | Camel-case conversion                                               |

Localized portfolio periods use `formatPortfolioPeriod` from `@shared/config`; utilities do not depend on services or config. Cache hooks use the React entry through the explicit cache module.

## Generated package reference

<!-- catalog:exports -->

<!-- catalog:scripts -->

<!-- catalog:dependencies -->
