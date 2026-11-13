# Repository lookup — manual testing

**Scope/status:** Implemented local read-only CLI for catalogs, declared symbols, skills, docs, design sections and ID retrieval. No application routes or deployed behavior change.

**Prerequisites:** Node 24.15+ below 25, pnpm 11, installed workspace dependencies, fictional fixture repositories for unsafe-path tests. No accounts, model API keys, database or running web server are needed. Use the primary checkout; preserve unrelated edits.

**Manual result:** Not run. Automated fixture and local command evidence is recorded below separately. URLs provide repository context; these commands have no HTTP route.

| Step | Clickable URL                                               | Route path                                                                | Action                                                                                                                                                     | Expected result                                                                                                               | Actual result / evidence      |
| ---- | ----------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 1    | [Repository](https://github.com/yusufyilmz/devhub-showcase) | `/yusufyilmz/devhub-showcase` (repository context; CLI has no HTTP route) | Run `pnpm --silent lookup catalog "button" --package @shared/ui --limit 1`, then `lookup symbol Button --package @shared/ui`.                              | JSON contains source paths and package ownership. Catalog rows retain headers. Declared symbol matches stay distinct.         | Not run manually.             |
| 2    | [Repository](https://github.com/yusufyilmz/devhub-showcase) | `/yusufyilmz/devhub-showcase`                                             | Run `pnpm --silent lookup skills "workspace" --limit 1`, `lookup docs "architecture" --limit 1`, and `lookup design "spacing" --limit 1`.                  | Relevant instructions or sections are returned, retaining parent prerequisites.                                               | Not run manually.             |
| 3    | [Repository](https://github.com/yusufyilmz/devhub-showcase) | `/yusufyilmz/devhub-showcase`                                             | Repeat a query; use its cursor with the same filters, retrieve an ID with `lookup section '<id>'`, then alter a disposable fixture document and retry.     | Stable repeat output; no duplicate pages; stale cursor/affected ID is rejected. Lookup creates no files or index.             | Not run manually.             |
| 4    | [Repository](https://github.com/yusufyilmz/devhub-showcase) | `/yusufyilmz/devhub-showcase`                                             | Run `lookup design spacing --max-tokens 1`, retry with `--max-tokens 1000`, then run `lookup docs zzzmissingzzz` and `lookup docs architecture --limit 0`. | Tiny budget exits 4 with empty stdout; retry fits its final stdout budget. Missing query exits 3; invalid limit exits 2.      | Not run manually.             |
| 5    | [Repository](https://github.com/yusufyilmz/devhub-showcase) | `/yusufyilmz/devhub-showcase`                                             | Run `pnpm --filter @shared/cli test:lookup`.                                                                                                               | Synthetic native and bundled artifacts, CLI aliases, nested cwd, token counts, source immutability and escaped symlinks pass. | See automated evidence below. |

## Automated evidence

The colocated [engine tests](../../../tools/cli/lookup/engine.test.ts) and [repository/CLI tests](../../../tools/cli/lookup/repository.test.ts) cover native and bundled artifact lookup. Run `pnpm --filter @shared/cli test:lookup` independently of the app's Vitest setup. The command does not require a web server or provider access. Deployment, login roles, public/private application records and database persistence are outside this local tooling scope.

See [usage and limitations](../../../tools/cli/README.md#token-bounded-repository-lookup) and the [manual testing index](index.md).

Local automated validation on 2026-11-07 in the primary checkout, using Node 24.15.0 and pnpm 11.25.0:

- `pnpm --filter @shared/cli test:lookup`: 21 tests passed.
- `pnpm --filter @shared/cli typecheck:lookup`: passed.
- Biome checks for lookup sources and their configuration, documentation formatting, and package export checks: passed.
- Real queries for symbols, catalogs, skills, docs and design: returned results with independently verified final stdout token counts. One UI catalog match used 240 tokens versus 7983 for the complete source catalog; the spacing design match used 586 versus 6505. These were first pages with more matches available, not complete-file replacements or billed-token measurements.
- Full `pnpm check` remains blocked by existing repository lint/format findings. Full `pnpm test` cannot load the root Vitest config because it references removed `packages/lib/package.json`. The broader CLI package typecheck reports the existing null-profile error at `tools/cli/generators/config.ts:22`; the isolated lookup typecheck passes. No application build or deployed checks were needed for this CLI-only change.

The AI lookup guide is linked from root `AGENTS.md`, `DESIGN.md`, all current package catalogs and [.agents/README.md](../../../.agents/README.md). The UI catalog guidance is maintained in `packages/ui/catalog.template.md` and regenerated. A regression fixture verifies that a README-only `.ai` directory preserves native symbol, catalog and design lookups. Recheck the generated catalog with `pnpm check:ui-catalog` and run `pnpm --filter @shared/cli test:lookup` after changing guide placement or bundle selection.
