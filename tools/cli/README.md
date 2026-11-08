# Shared CLI tooling

Private workspace package `@shared/cli`, alongside `@shared/typescript-config`.

- `ci/`: tested app selection, stale-release detection and workflow cost policy. See [deployment setup](../../docs/deployments.md).
- `scripts/`: repository maintenance and local environment setup. Run root package commands so scripts that use the current directory operate at the repository root.
- `generators/`: Turbo generator definitions and templates. Root generator commands pass this configuration explicitly.
- `tsdown/`: shared library build defaults exported as `@shared/cli/tsdown`.

Run `pnpm dev:setup` or `pnpm dev:setup --supabase` from the repository root. The setup script preserves existing app environment files. See [local development checks](../../docs/testing/manual/local-development.md).

## tsdown

Library packages run [`tsdown`](https://tsdown.dev) via `pnpm build`, using `defineLibraryConfig()` from `library.ts`.

- Output: `dist/` (ESM). Turbo caches `dist/**` for package builds.
- Workspace `package.json` exports still target `src/` for development; switch exports to `dist` when you publish a package.
- Type declarations: use `pnpm typecheck` (`tsc --noEmit`); dts emit is off by default to avoid Storybook / Next-only edge cases in declaration generation.

## Token-bounded repository lookup

Use Node 24.15+ (below 25) and the repository's pnpm version. Run from the repository root:

```sh
pnpm --silent lookup catalog "button" --package @shared/ui --limit 2
pnpm --silent lookup symbol Button --package @shared/ui
pnpm --silent lookup skills "workspace" --limit 2
pnpm --silent lookup docs "revision conflicts" --limit 2
pnpm --silent lookup design "spacing" --limit 1 --max-tokens 1000
pnpm --silent lookup section '<id from results or locator>' --max-tokens 4000
pnpm --filter @shared/cli test:lookup
```

`lookup:catalog`, `lookup:symbol`, and the other `lookup:<command>` spellings are aliases. The package also exports helpers from `@shared/cli/lookup`. For direct execution from any folder, run `node /absolute/path/to/tools/cli/lookup/cli.ts <command> <query> --root /absolute/project/root`.

- `catalog`: package `CATALOG.md` files and optional `.ai/catalogs` bundles. Returns complete paragraphs, lists, code blocks, or table rows with their column headers.
- `skills`: Markdown files in `.agents/skills`, `.ai/skills`, `.claude/skills`, and `.cursor/skills`, including references.
- `docs`: Markdown/MDX sections beneath `docs/`, with parent prerequisites.
- `design`: sections in `DESIGN.md` (or `.ai/DESIGN.md` for bundled projects), with their introduction, parent prerequisites and named global constraints.
- `symbol`: exact, case-sensitive declared public export names from `.ai/manifest.json`, or native workspace package export targets and relative source barrels. Native parsing never executes project modules. Unexpanded wildcard package paths and external star re-exports are counted as unresolved; this is discovery evidence, not a substitute for type checking.
- `capability`: verified compact capability rows for `.ai` bundles; native repositories use catalog excerpts. Catalog prose does not establish a working public import: check `symbol` and the package export map.
- `section`: retrieves a complete current record using its opaque ID. Edits invalidate IDs for the affected source; cursors also bind to the complete scanned snapshot and filters.

Text searches use case-insensitive lexical AND matching; every word must appear in the record's searchable title, description, content or source path. Try fewer keywords if nothing matches. Exact symbol misses return suggestions separately from verified matches. The default root is the nearest ancestor with `pnpm-workspace.yaml` or `.ai`; `--root` selects a project explicitly.

JSON is the default; `--format text` retains machine-readable metadata before excerpts. Use `pnpm --silent` when capturing output to avoid pnpm's command banner. Diagnostics go to stderr. Both formats count the final stdout, including metadata and its newline, with `js-tiktoken` 1.0.21 / `cl100k_base`. This is an encoding-specific estimate, not billed conversation tokens. Default budgets are 1500 for symbols/capabilities and 2500 for other commands; `--max-tokens` overrides them.

Metadata and retained prerequisites can make a short-file lookup larger than reading that file directly. Savings come from selecting relevant context from large files or reference collections.

Results are never cut in the middle. Follow `hasMore` with `--cursor '<cursor>'` using the same query, root and filters; `--limit` and the budget may change. If a whole record cannot fit, exit 4 returns a locator for `section` with a larger budget. If even the error envelope cannot fit, stdout is empty and stderr explains why. A bounded response can still be incomplete; read mandatory project/skill instructions and inspect source contracts before implementation.

Exit codes: 0 match (including multiple symbol owners), 1 command syntax error, 2 invalid argument/artifact/cursor, 3 no match, 4 insufficient budget. Lookup does not write indexes, install artifacts, invoke models or use the network. Files escaping the selected project through symlinks are rejected.

See [repository lookup verification](../../docs/testing/manual/repository-lookup.md).

## Generate catalogs for every workspace package

```sh
pnpm generate:catalogs
pnpm check:catalogs
pnpm generate:catalogs --package @shared/assistant
pnpm check:catalogs --package @shared/assistant
```

The generator discovers packages from `pnpm-workspace.yaml`, including apps and tools. Each package gets a `CATALOG.md` and a `catalog.template.md`. On the first run, an existing authored catalog is preserved as the template; a new package gets a minimal template from its manifest. Later runs keep guidance in that template and generate the reference from current package exports, declared TypeScript symbols, scripts and dependencies. Reading symbols never executes package code.

Edit `catalog.template.md` for hand-written explanations. Supported placeholders are `<!-- catalog:package -->`, `<!-- catalog:exports -->`, `<!-- catalog:scripts -->` and `<!-- catalog:dependencies -->`. If a template has no catalog placeholders, the default generated reference is appended. UI templates also support their existing `<!-- registry:... -->` markers with the same registry/config consistency checks. Never edit generated `CATALOG.md` directly.

`--check` is read-only: it fails when a catalog or source template is missing/outdated, without creating files. Normal generation writes only changed files. Every package is validated before writing, and symlinked outputs/templates are rejected. If a generated catalog has lost its source template, restore the template instead of treating generated tables as authored guidance.

`--package <name>` selects an exact workspace package; `--root <path>` selects a different workspace. Exit codes are 0 for success, 1 for stale catalogs in check mode and 2 for invalid arguments/configuration. `generate:ui-catalog` and `check:ui-catalog` remain aliases selecting `@shared/ui`. The root `pnpm check` now checks all catalogs.

Lookup catalog searches include generated catalogs under apps, packages and tools. See [catalog generation verification](../../docs/testing/manual/catalog-generation.md).
