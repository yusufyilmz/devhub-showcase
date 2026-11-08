<!-- Generated from catalog.template.md, package.json and declared public exports. Run pnpm generate:catalogs. -->

# Trello catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "board" --package @shared/trello --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/trello`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.ai/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

Trello board UI and client services for `@shared/trello`. The package root exports services, hooks, stores, constants, and types. Board screens live under `src/components` and are not all re-exported from the root.

| Area         | Path                         | Use                                      |
| ------------ | ---------------------------- | ---------------------------------------- |
| Package root | `src/index.ts`               | Services, hooks, store, constants, types |
| Board        | `src/components/board`       | `TrelloBoard`, background, and sidebar   |
| Cards        | `src/components/cards`       | `TrelloCard`, list, and detail modal     |
| Integration  | `src/components/integration` | Card and article comments                |
| Layout       | `src/components/layout`      | `TrelloErrorBoundary`                    |
| Pages        | `src/components/pages`       | `TrelloBoardPage`                        |
| Local UI     | `src/components/ui`          | Board-local layout pieces                |

| Symbol                                     | Use                        |
| ------------------------------------------ | -------------------------- |
| `TrelloClient`, `TrelloService`            | Trello API access          |
| `TrelloBoardService`, `TrelloCardService`  | Board and card operations  |
| `TrelloListService`, `TrelloMemberService` | List and member operations |
| `useTrelloBoards`, `useTrelloBoardView`    | Board data hooks           |
| `useTrelloStore`                           | Board client state         |

## Generated package reference

| Import           | Source / condition | Declared symbols |
| ---------------- | ------------------ | ---------------- |
| `@shared/trello` | `src/index.ts`     | —                |

Symbol names are read statically from TypeScript declarations without executing their implementation modules. Wildcard package paths, external star re-exports and non-code assets are not expanded into symbol claims. Verify source contracts before importing.

| Script         | Command                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| `build`        | `tsdown`                                                                  |
| `clean`        | `node -e "require('node:fs').rmSync('dist',{recursive:true,force:true})"` |
| `format`       | `biome format --write .`                                                  |
| `format:check` | `biome format .`                                                          |
| `lint`         | `biome lint .`                                                            |
| `lint:check`   | `biome lint .`                                                            |
| `lint:fix`     | `biome lint --write .`                                                    |
| `typecheck`    | `tsc --noEmit`                                                            |
| `types:check`  | `pnpm typecheck`                                                          |

| Dependency                  | Declared version | Kind            |
| --------------------------- | ---------------- | --------------- |
| `@shared/config`            | `workspace:*`    | dependencies    |
| `@shared/runtime`           | `workspace:*`    | dependencies    |
| `@shared/ui`                | `workspace:*`    | dependencies    |
| `@shared/utils`             | `workspace:*`    | dependencies    |
| `cn`                        | `catalog:`       | dependencies    |
| `react`                     | `catalog:`       | dependencies    |
| `uuid`                      | `catalog:`       | dependencies    |
| `zustand`                   | `catalog:`       | dependencies    |
| `@shared/cli`               | `workspace:*`    | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@tailwindcss/postcss`      | `catalog:`       | devDependencies |
| `@types/node`               | `catalog:`       | devDependencies |
| `@types/react`              | `catalog:`       | devDependencies |
| `@types/react-dom`          | `catalog:`       | devDependencies |
| `beautify-console-log`      | `catalog:`       | devDependencies |
| `postcss`                   | `catalog:`       | devDependencies |
| `tailwindcss`               | `catalog:`       | devDependencies |
| `typescript`                | `catalog:`       | devDependencies |
