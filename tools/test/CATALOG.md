<!-- Generated from tools/cli/catalog/templates/package.md.hbs, package.json and declared public exports. Run pnpm generate:catalogs. -->

# @shared/test catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "test" --package @shared/test --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/test`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

## Generated package reference

| Import                    | Source / condition               | Declared symbols           |
| ------------------------- | -------------------------------- | -------------------------- |
| `@shared/test/fixtures/*` | `./fixtures/*`                   | —                          |
| `@shared/test/mocks/*`    | `./mocks/*.ts`                   | —                          |
| `@shared/test/playwright` | `./support/playwright-config.ts` | `generatePlaywrightConfig` |
| `@shared/test/setup`      | `./support/vitest-setup.ts`      | —                          |

Symbol names are read statically from TypeScript declarations without executing their implementation modules. Wildcard package paths, external star re-exports and non-code assets are not expanded into symbol claims. Verify source contracts before importing.

No package scripts are declared.

| Dependency                  | Declared version | Kind            |
| --------------------------- | ---------------- | --------------- |
| `@shared/config`            | `workspace:*`    | dependencies    |
| `@shared/ui`                | `workspace:*`    | dependencies    |
| `@playwright/test`          | `catalog:`       | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@types/react`              | `catalog:`       | devDependencies |
| `typescript`                | `catalog:`       | devDependencies |
| `vitest`                    | `catalog:`       | devDependencies |
