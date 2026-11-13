# Shared CLI tooling

Private workspace package `@shared/cli`, alongside `@shared/typescript-config`.

- `ci/`: tested app selection, stale-release detection and workflow cost policy. See [deployment setup](../../docs/deployments.md).
- `scripts/`: repository maintenance and local environment setup. Run root package commands so scripts that use the current directory operate at the repository root.
- `generators/`: Turbo generator definitions and templates. Root generator commands pass this configuration explicitly.
- `tsdown/`: shared library build defaults exported as `@shared/cli/tsdown`.
- `storybook/`: rewrites CSF `meta.title` values from story file paths. Run `pnpm cli:storybook`.
- `links/`: checks Markdown links. Run `pnpm check:links`.

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

- `catalog`: package `CATALOG.md` files under `apps`, `packages`, and `tools`. Returns complete paragraphs, lists, code blocks, or table rows with their column headers.
- `skills`: Markdown files in `.agents/skills`, `.claude/skills`, and `.cursor/skills`, including references.
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

## Storybook titles

Use Node 24.15+ (below 25). From the repository root:

```sh
pnpm cli:storybook rewrite-titles --dry-run
pnpm cli:storybook rewrite-titles
pnpm cli:storybook rewrite-titles --cwd /absolute/project/root --verbose
```

`--dry-run` prints changes and does not write files. `--cwd` selects the project; the default is the current directory. The command walks up to the Storybook app and, when this monorepo is found, rewrites stories under `packages/` and `apps/`.

Titles come from the path. `packages/<pkg>/src/.../<file>` and `apps/<app>/src/.../<file>` become `<Package>/<folders>/<Leaf>`. `src`, `components`, `stories`, and `__stories__` are left out. A leaf that repeats its folder is left out, so `button/Button.stories.tsx` is `UI/Buttons/Button` and `chat-bubble/ChatBubble.stories.tsx` is `Assistant/Chat/Chat Bubble`. `index` and `examples` are left out too, so `icon-button/Examples.stories.tsx` is `UI/Buttons/Icon Button`.

Package roots are `UI`, `Assistant`, `Trello`, `Storybook`, `Studio`, and `Fitness`. Other package directories are humanized from their folder name.

The rewrite changes the top-level `title` on `const meta` (including `const meta: Meta<...> = {`) and `export default { ... }`. A co-located `const STORY_TITLE = "..."` stays in sync when `meta.title` uses it. Nested `title` props, including `args.title` and JSX `title="..."`, stay as they are. MDX `<Meta title>` uses the same path title when an MDX file is present.

## Markdown links

`check:links` validates links in Markdown and MDX. Local files, images, reference definitions, and heading anchors are checked in-process. External `http(s)` URLs are requested unless `--no-external` is set.

`--fix` rewrites a missing local document link when exactly one document in the repository matches its path suffix. Replacements are root-relative, such as `/docs/guide.md`. Ambiguous matches, missing anchors, external URLs, and links whose target already exists are left unchanged. Changed files are copied to `.link-fix-backups/` before they are written. `--dry-run` previews those repairs and requires `--fix`.

Use Node 24.15+ (below 25). From the repository root:

```sh
pnpm check:links --no-external
pnpm check:links --paths docs README.md
pnpm check:links --fix --dry-run --no-external
pnpm check:links --fix --no-external
```

With no `--paths`, it checks `docs` directories plus `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md`, and `CLAUDE.md`, skipping dependency and build directories. Exit code 1 means a broken link was found.

## Generate catalogs for every workspace package

```sh
pnpm generate:catalogs
pnpm check:catalogs
pnpm generate:catalogs --package @shared/assistant
pnpm check:catalogs --package @shared/assistant
```

The generator discovers packages from `pnpm-workspace.yaml`, including apps and tools. Each package gets a generated `CATALOG.md`. Packages without their own `catalog.template.md` use [tools/cli/catalog/default-template.md](catalog/default-template.md), which fills the package name and the exports, scripts, and dependencies tables. On the first run, an existing authored catalog is preserved as that package's template. Later runs keep guidance in a local template and generate the reference from current package exports, declared TypeScript symbols, scripts and dependencies. Reading symbols never executes package code.

Add `catalog.template.md` only when a package needs hand-written explanations. Supported placeholders are `<!-- catalog:package -->`, `<!-- catalog:exports -->`, `<!-- catalog:scripts -->` and `<!-- catalog:dependencies -->`. If a template has no catalog placeholders, the default generated reference is appended. UI templates also support their existing `<!-- registry:... -->` markers with the same registry/config consistency checks. Never edit generated `CATALOG.md` directly.

`--check` is read-only: it fails when a catalog or a local source template is missing or outdated, without creating files. Normal generation writes only changed files. Every package is validated before writing, and symlinked outputs and templates are rejected.

`--package <name>` selects an exact workspace package; `--root <path>` selects a different workspace. Exit codes are 0 for success, 1 for stale catalogs in check mode and 2 for invalid arguments/configuration. `generate:ui-catalog` and `check:ui-catalog` remain aliases selecting `@shared/ui`. The root `pnpm check` now checks all catalogs.

Lookup catalog searches include generated catalogs under apps, packages and tools. See [catalog generation verification](../../docs/testing/manual/catalog-generation.md).
