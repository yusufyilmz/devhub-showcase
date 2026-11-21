# Lookup commands

Run these from the repository root with Node 24.15+ below 25 and pnpm 11. `pnpm lookup` and `pnpm cli:lookup` are the same script. Flags shown here are the ones that keep stdout small.

| Need                               | Command                                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| A control, section, or catalog row | `pnpm --silent lookup catalog "<two words>" --package @shared/ui --limit 1 --max-tokens 1000` |
| A declared export                  | `pnpm --silent lookup symbol ExactName --package @shared/ui --limit 1 --max-tokens 1000`      |
| A skill                            | `pnpm --silent lookup skills "<two words>" --limit 1 --max-tokens 1000`                       |
| A doc under `docs/`                | `pnpm --silent lookup docs "<two words>" --limit 1 --max-tokens 1000`                         |
| A rule in `DESIGN.md`              | `pnpm --silent lookup design "<word>" --limit 1 --max-tokens 1000`                            |
| The rest of a record               | `pnpm --silent lookup section '<id>' --max-tokens 4000`                                       |

Replace `@shared/ui` with the package that owns the question. Catalog and symbol searches without `--package` scan more files and return more text. Default budgets are 2500 tokens for catalog, skills, docs, design, and section, and 1500 for symbol and capability. Pass `--max-tokens 1000` on the first query anyway.

Use `capability` only for a compact capability row. In this repository it searches catalog excerpts. It does not prove a public import. There is no separate `.ai` catalog source here. `.ai/manifest.json` applies to bundled projects, not to day-to-day MyDevStudio discovery.

JSON is the default. Do not add `--format text` for a smaller result. Both formats count the final stdout, and text repeats the metadata before the excerpt.

Useful fields: `status`, `hasMore`, `cursor`, `results[].artifact`, `results[].id`, `results[].content`, `results[].package`, `results[].subpath`, `locator.id`, `suggestions`. `accounting.tokens` is the estimate for that stdout. `accounting.estimate` says it is not a billed-token count.

| Exit | Meaning                                                 |
| ---- | ------------------------------------------------------- |
| 0    | At least one match. Several symbol owners still exit 0. |
| 1    | The command or option is invalid.                       |
| 2    | The argument, artifact, or cursor is invalid.           |
| 3    | No match.                                               |
| 4    | The budget cannot hold the next complete record.        |

The full option list is [token-bounded repository lookup](../../../../tools/cli/README.md#token-bounded-repository-lookup). Open that section only when a flag above is not enough. Do not open the rest of the CLI readme for a normal search.
