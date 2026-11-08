<!-- Generated from catalog.template.md, package.json and declared public exports. Run pnpm generate:catalogs. -->

# @shared/test catalog

Workspace package `@shared/test`.

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
