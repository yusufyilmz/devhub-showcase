# AI guide to repository lookup

Use lookup to select relevant context from catalogs, skills, documentation and design references before reading large files. It runs locally, does not call a model or use the network, and does not write indexes or change source files.

## Quick start

Use Node 24.15+ (below 25), pnpm 11 and installed workspace dependencies. Run from the repository root:

```sh
pnpm --silent lookup catalog "button" --package @shared/ui --limit 2
pnpm --silent lookup symbol Button --package @shared/ui
pnpm --silent lookup catalog "companion" --package @shared/assistant --limit 2
pnpm --silent lookup skills "workspace" --limit 2
pnpm --silent lookup docs "revision conflicts" --limit 2
pnpm --silent lookup design "spacing" --limit 1 --max-tokens 1000
```

- `catalog` finds compact excerpts in package `CATALOG.md` files; table rows retain their column headers.
- `symbol` finds exact, case-sensitive declared export names and their public package paths. Multiple owners remain visible; do not choose one implicitly.
- `skills` searches skill instructions and references in the supported skill directories, including `.agents/skills`.
- `docs` searches Markdown/MDX under `docs/`.
- `design` searches `DESIGN.md`, retaining parent prerequisites and named global constraints.
- `section` retrieves a complete current record using an ID returned in a result or locator.
- `capability` searches compact capability rows in a bundle, or catalog excerpts in a native workspace.

## Keep context small and complete

1. Start with a few specific keywords and `--limit 1` or `--limit 2`. Text searches are case-insensitive lexical AND matches; every word must match. Use fewer words if there is no result.
2. Use `--package @shared/ui` or another exact owner when searching catalogs or symbols. Choose `--max-tokens` for the final stdout budget. Counts use `cl100k_base`; they estimate this encoding, not billed conversation tokens.
3. Inspect `status`, `hasMore` and `results`. A first page is not exhaustive. Continue the same query and filters with `--cursor '<cursor>'`; the limit and budget may change.
4. Retrieve an ID with `pnpm --silent lookup section '<id>' --max-tokens 4000`. If a complete record exceeds the budget, use its `locator.id` and increase the budget. Never treat a budget error as evidence that a rule or export is absent.
5. Read mandatory project/skill instructions and the relevant source contracts before changing code. Catalog excerpts are discovery context; declared exports still need contract verification. Repeat the original query when source edits invalidate an ID or cursor.

JSON is the default. `--format text` prints metadata followed by excerpts. `pnpm --silent` keeps pnpm's banner out of captured stdout; diagnostics go to stderr. Default budgets are 1500 tokens for symbols/capabilities and 2500 for other commands. Metadata and preserved prerequisites can outweigh savings for a short file.

Exit codes: 0 match (including multiple symbol owners), 1 command syntax error, 2 invalid argument/artifact/cursor, 3 no match, 4 insufficient budget. An extremely small budget can produce empty stdout with an explanation on stderr.

## Repository sources and optional bundles

This repository uses `packages/*/CATALOG.md`, `.agents/skills`, `docs/`, root `DESIGN.md`, and package export maps. This README does not install or require a generated `.ai` bundle. When provided, `.ai/manifest.json` supplies bundled symbols and `.ai/DESIGN.md` supplies bundled design sections. Native workspace files remain available when those bundle artifacts are absent. Use `--root /absolute/project/root` to select another project explicitly.

Read [AGENTS.md](../AGENTS.md) for repository instructions, [full CLI usage](../tools/cli/README.md#token-bounded-repository-lookup) for all options, and [lookup verification](../docs/testing/manual/repository-lookup.md) for checks.

## Keep catalogs current

Run `pnpm generate:catalogs` for every workspace package, or add `--package @shared/assistant` for one package. Edit a package's `catalog.template.md` for guidance; export/script/dependency tables are generated from current metadata and source declarations. `pnpm check:catalogs` validates all outputs without writing. App-specific bindings are colocated with pages/routes; the old home/reviews/portfolio/platform/chat feature folders are removed.
