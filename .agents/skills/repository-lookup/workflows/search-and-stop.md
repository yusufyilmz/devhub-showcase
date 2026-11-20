# Search, then stop

## Entry

The first lookup did not answer the question, or its exit code was not 0.

## Steps

1. Exit 3, no match: drop the least specific word and run the same command once. For `symbol`, read `suggestions` and retry one exact name. Do not switch to reading the whole catalog.
2. Exit 4, `budget_too_small`: when `locator.id` is present, run `pnpm --silent lookup section '<id>' --max-tokens 4000`. Otherwise repeat the same query with a higher `--max-tokens`. Empty stdout with an explanation on stderr is still a budget failure. It is not evidence that the topic is absent.
3. Exit 2: fix the flag or the cursor. A cursor must repeat the same query, root, and filters. If the source changed, start the query again without `--cursor`.
4. Exit 0 with `hasMore: true`: page only when the first result does not contain the fact. Repeat the same command with `--cursor '<cursor>'`. Do not raise `--limit` above 2.
5. Exit 0 with `status: "ambiguous"` or more than one symbol owner: keep every owner visible. Read the source for the owner you will edit. Do not pick an owner the result did not name.
6. Open the one source path the chosen result names. Read the function, export, or section required for the change.

## Exit

You can name the file that answers the question, or you have reported exit code 3 after one narrower retry.

## Rollback

If a lookup result is stale after an edit, discard the cursor and id. Run the original query again. Do not keep paging a snapshot that no longer matches the tree.

## What this does not replace

Implementation text inside a known source file is read from that file. A scoped search is for a string lookup does not index, and only inside the directory the result already named. Repo-wide search is not the first step for a catalog, skill, doc, or design question.

## Reviewed prompts

These prompts were reviewed against this skill. They were not executed in a separate agent session.

| Prompt                                                       | Decision                                                                                                                                |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| "Where is the shared Button, and which package exports it?"  | `lookup catalog "button" --package @shared/ui --limit 1`, then `lookup symbol Button` with the same package. Open the source path only. |
| "Change the label in this file" when the user gave the path. | Read that file. Do not look up the catalog.                                                                                             |
| The command exits 4.                                         | Retry with `section` and a larger `--max-tokens`, or raise the budget. Do not open `DESIGN.md` from the start.                          |
| The query would include a live token or CV text.             | Refuse that query. Search with a public symbol or feature name.                                                                         |
