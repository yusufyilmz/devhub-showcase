<!-- Generated from tools/cli/catalog/templates/package.md.hbs, package.json and declared public exports. Run pnpm generate:catalogs. -->

# @shared/env catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "env" --package @shared/env --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/env`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

## Generated package reference

| Import        | Source / condition | Declared symbols      |
| ------------- | ------------------ | --------------------- |
| `@shared/env` | `./src/index.ts`   | `createAppEnv`, `env` |

Symbol names are read statically from TypeScript declarations without executing their implementation modules. Wildcard package paths, external star re-exports and non-code assets are not expanded into symbol claims. Verify source contracts before importing.

| Script      | Command        |
| ----------- | -------------- |
| `typecheck` | `tsc --noEmit` |

| Dependency                  | Declared version | Kind            |
| --------------------------- | ---------------- | --------------- |
| `@t3-oss/env-nextjs`        | `catalog:`       | dependencies    |
| `zod`                       | `catalog:`       | dependencies    |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@types/node`               | `catalog:`       | devDependencies |
| `typescript`                | `catalog:`       | devDependencies |
