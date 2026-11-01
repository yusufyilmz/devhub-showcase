---
name: developing-utils-package
description: Change logging and generic helpers in @shared/utils. Use when
  editing the server logger, browser logger, CLI logger, URL or date helpers,
  i18n helpers, UUID helpers, or another generic utility in packages/utils.
---

# Developing the utils package

`packages/utils` is `@shared/utils`. It owns logging and generic helpers. Domain validation, usernames, and profile schemas stay in `@shared/lib`. Profile copy and languages for the portfolio document stay in `@shared/config`.

Read [the file map](references/map.md) and [packages/utils/CATALOG.md](../../../packages/utils/CATALOG.md). `docs/observability.md` still mentions `packages/log` and `packages/lib/src/log`. Those paths are stale. The loggers in this package are the ones to extend.

## Logging

| Export                        | File                   | Where it runs                                       |
| ----------------------------- | ---------------------- | --------------------------------------------------- |
| `@shared/utils/logger`        | `src/logger/index.ts`  | Server. Pino, with `pino-pretty` outside production |
| `@shared/utils/client-logger` | `src/logger/client.ts` | Browser                                             |
| `@shared/utils/cli-logger`    | `src/logger/cli.ts`    | CLI scripts                                         |

The server logger sets `application` from `APPLICATION_NAME`, `env` from `NODE_ENV`, and honors `LOG_LEVEL`. Development uses level `debug` and a pretty transport. Do not print environment values.

Do not log CV content, prompts, tokens, raw request bodies, raw provider errors, or Redis credentials. A monitoring failure must not break the user operation. Prefer a stable event name and a few safe fields. Read [SECURITY.md](../../../SECURITY.md) before adding a field.

The browser logger is large and can emit component context. Do not pass profile documents or props that contain them. `createComponentLogger` is for component names and safe diagnostics. Public flags such as `NEXT_PUBLIC_ENABLE_LOGGING` and `NEXT_PUBLIC_LOG_LEVEL` only affect the browser logger. Do not move secrets behind `NEXT_PUBLIC_`.

Use the logger the caller already uses. Do not add a second logging library.

## Generic helpers

The package root exports URL, date, id, flatten, and debug helpers from `src/helpers`. Notable symbols include `createUUID`, `joinUrl`, `toAbsoluteUrl`, `formatDateRange`, `capitalizeFirstLetter`, `fetchTimeout`, `sleepMs`, `flatten`, and `unflattenObject`.

Before adding a helper, search `@shared/lib/utils` and this package. Date formatting for a portfolio period belongs in `@shared/config` `formatPortfolioPeriod`. Username checks belong in `@shared/lib/profiles`. A new helper here must be generic enough for more than one feature.

`src/helpers/url.test.ts` is the colocated test pattern. Cover joining, trailing slashes, and absolute URLs when you change `src/helpers/url.ts`.

`src/i18n` holds shared i18n helpers and `locales/en.json` plus `locales/th.json`. Portfolio and CV labels that follow the profile language are `@shared/config` `getPortfolioCopy`, not these JSON files. Add a locale file only when the i18n helper already loads that shape, and keep the keys aligned across locales.

`src/helpers/markdownUtils.ts` renders markdown. Treat the input as data. Do not pass unsanitized profile HTML into a raw HTML sink if the helper returns markup. Read the helper before wiring it to visitor-visible content.

## Dependencies and exports

Exports are `.`, `./logger`, `./client-logger`, `./cli-logger`, and `./i18n`, each with `import` and `require` conditions pointing at the TypeScript source. Add a new public file by extending that map and `CATALOG.md`, then run `pnpm check:exports`.

`pino`, `pino-pretty`, `flat`, and `short-uuid` use the catalog. `beautify-console-log` and the `remark` packages are pinned directly today. New external dependencies use `catalog:` in `pnpm-workspace.yaml`, the manifest, and the lockfile together.

This package must not import `apps/my-dev-studio` or `@shared/lib` domain services. `@shared/config` already depends on `@shared/utils`. Importing config from utils creates a cycle.

## Verification

```sh
pnpm --filter @shared/utils typecheck
pnpm exec vitest run --project unit packages/utils/src/helpers/url.test.ts
```

Run the broader unit file when you change a helper that other packages call. Do not log a real `.env` value while checking the logger.

## Related skills

- [Developing the lib package](../developing-lib-package/SKILL.md)
- [Developing the runtime package](../developing-runtime-package/SKILL.md)
- [Developing the config package](../developing-config-package/SKILL.md)
