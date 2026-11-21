---
name: repository-lookup
description: Use before opening large catalogs, docs, skills, or design notes, or when asked to lower token use. Search with pnpm lookup under a small limit and budget, then read only the source path that result names.
---

# Keep repository context small

Find a catalog row, skill, doc section, or design rule with one bounded lookup. Open the source path that result names. Leave the rest of the file unread.

`pnpm lookup` and `pnpm cli:lookup` run `tools/cli/lookup/cli.ts`. The command is local and read-only. It does not call a model, use the network, or write an index. Token counts use `cl100k_base` and estimate that encoding. They are not the host's billed conversation tokens.

## When to use

Use this before reading a package `CATALOG.md`, a long skill reference, a doc under `docs/`, or root `DESIGN.md` in search of one fact. Also use it when the user asks to spend fewer tokens on repository context.

Skip it when the user already named the file to read or edit. Read that file. Skip it when lookup cannot start because dependencies are missing: say so, then open the one file the task names. A short file you were going to read anyway can cost more through lookup than through a direct read. Metadata and retained prerequisites are part of the stdout budget.

## Steps

1. Run one command from the repository root. Start with `--limit 1` and `--max-tokens 1000`. Add `--package` when the owner is known. Use `pnpm --silent` so the pnpm banner stays out of stdout.

   ```sh
   pnpm --silent lookup catalog "button" --package @shared/ui --limit 1 --max-tokens 1000
   ```

2. Use two or three specific words. Text search is a case-insensitive AND: every word must appear. Symbol names are exact and case-sensitive. Pick the command from [the command table](references/commands.md) only when the example above is the wrong kind of search.
3. Read `status`, `hasMore`, `results[].artifact`, and `results[].id`. Use `results[].content` for the excerpt. Ignore `accounting` after noting `tokens`.
4. Open the source path in `artifact` when the next step is an edit or a contract check. Do not open the rest of the catalog, doc, or design file.
5. Stop when the excerpt answers the question. Follow [the paging workflow](workflows/search-and-stop.md) only when the first page does not.

## After discovery

A catalog excerpt does not prove an import. Confirm a public name with `pnpm --silent lookup symbol ExactName --package @shared/ui --limit 1 --max-tokens 1000`, then read the export and the source it points at. Before changing code, read the matching package skill named in `AGENTS.md` and the source you will edit.

Do not hand-edit a generated `CATALOG.md`. Regenerate with `pnpm generate:catalogs` only when the task is to refresh catalogs.

## Stop

Stop after one answered query, or after one refined query when the first exit code is 3. Do not run a second kind of lookup for the same fact. Do not put secrets, CV text, prompts, or tokens in the query.
