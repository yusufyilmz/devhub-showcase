<!-- Generated from catalog.template.md, package.json and declared public exports. Run pnpm generate:catalogs. -->

# @shared/cli catalog

Workspace package `@shared/cli`.

## Generated package reference

| Import                   | Source / condition       | Declared symbols                                                                                                                                                                                                                                                                  |
| ------------------------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@shared/cli/generators` | `./generators/config.ts` | `default`                                                                                                                                                                                                                                                                         |
| `@shared/cli/lookup`     | `./lookup/index.ts`      | `countLookupTokens`, `findSymbol`, `getArtifactSection`, `makeLookupCommands`, `searchCapabilities`, `searchCatalog`, `searchDesign`, `searchDocs`, `searchSkills`, `type CatalogAudience`, `type LookupOptions`, `type LookupOutput`, `type LookupRecord`, `type LookupResponse` |
| `@shared/cli/storybook`  | `./storybook/index.ts`   | `makeRewriteTitlesCommand`                                                                                                                                                                                                                                                        |
| `@shared/cli/tsdown`     | `./tsdown/library.ts`    | `defineLibraryConfig`                                                                                                                                                                                                                                                             |

Symbol names are read statically from TypeScript declarations without executing their implementation modules. Wildcard package paths, external star re-exports and non-code assets are not expanded into symbol claims. Verify source contracts before importing.

| Script             | Command                                       |
| ------------------ | --------------------------------------------- |
| `test`             | `vitest`                                      |
| `test:lookup`      | `vitest run --config lookup/vitest.config.ts` |
| `test:watch`       | `vitest --watch`                              |
| `typecheck`        | `tsc --noEmit`                                |
| `typecheck:lookup` | `tsc --project lookup/tsconfig.json --noEmit` |

| Dependency                  | Declared version | Kind            |
| --------------------------- | ---------------- | --------------- |
| `@babel/parser`             | `catalog:`       | devDependencies |
| `@biomejs/biome`            | `catalog:`       | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@turbo/gen`                | `catalog:`       | devDependencies |
| `commander`                 | `catalog:`       | devDependencies |
| `js-tiktoken`               | `catalog:`       | devDependencies |
| `remark-gfm`                | `catalog:`       | devDependencies |
| `remark-parse`              | `catalog:`       | devDependencies |
| `tsdown`                    | `catalog:`       | devDependencies |
| `typescript`                | `catalog:`       | devDependencies |
| `unified`                   | `catalog:`       | devDependencies |
| `vitest`                    | `catalog:`       | devDependencies |
| `yaml`                      | `catalog:`       | devDependencies |
