# Utils catalog

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
