# Utils package map

Package `@shared/utils` in `packages/utils`.

| Export                        | File                   |
| ----------------------------- | ---------------------- |
| `@shared/utils`               | `src/index.ts`         |
| `@shared/utils/logger`        | `src/logger/index.ts`  |
| `@shared/utils/client-logger` | `src/logger/client.ts` |
| `@shared/utils/cli-logger`    | `src/logger/cli.ts`    |
| `@shared/utils/i18n`          | `src/i18n/index.ts`    |

## Helpers on the package root

| File                               | Symbols                                                                |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `src/helpers/createUUID.ts`        | `createUUID`                                                           |
| `src/helpers/url.ts`               | `joinUrl`, `toAbsoluteUrl`, `ensureLeadingSlash`, `stripTrailingSlash` |
| `src/helpers/url.test.ts`          | URL helper tests                                                       |
| `src/helpers/format-date.ts`       | `formatDateRange`                                                      |
| `src/helpers/format-text.ts`       | `capitalizeFirstLetter`                                                |
| `src/helpers/fetchTimeout.ts`      | `fetchTimeout`                                                         |
| `src/helpers/sleepMs.ts`           | `sleepMs`                                                              |
| `src/helpers/flatten.ts`           | `flatten`, `flattenFlat`, `unflattenObject`                            |
| `src/helpers/debugBus.ts`          | Debug bus emitters                                                     |
| `src/helpers/wsMetrics.ts`         | In-process connection counters                                         |
| `src/helpers/markdownUtils.ts`     | Markdown helper                                                        |
| `src/helpers/camel-case.ts`        | Case conversion                                                        |
| `src/helpers/nullsToUndefined.ts`  | `NullsToUndefined`                                                     |
| `src/helpers/removeNulls.ts`       | Null removal                                                           |
| `src/helpers/isNullOrUndefined.ts` | Null check                                                             |
| `src/helpers/isMobile.ts`          | `isMobile` user-agent check, not the React hook                        |

The React viewport hook is `useIsMobile` in `@shared/runtime`.

## i18n

| Path                       | Use                             |
| -------------------------- | ------------------------------- |
| `src/i18n/index.ts`        | Helper entry                    |
| `src/i18n/locales/en.json` | English strings for this helper |
| `src/i18n/locales/th.json` | Thai strings for this helper    |

Portfolio language labels live in `packages/config/src/portfolio/languages.ts`.

## Logger environment names

Server: `APPLICATION_NAME`, `LOG_LEVEL`, `NODE_ENV`.

Browser: `NEXT_PUBLIC_ENABLE_LOGGING`, `NEXT_PUBLIC_LOG_LEVEL`, `NEXT_PUBLIC_LOG_STRING_OUTPUT`, `NEXT_PUBLIC_LOG_PREFIX`.

## Checks

```sh
pnpm --filter @shared/utils typecheck
pnpm exec vitest run --project unit packages/utils
pnpm check:exports
```
