# Evidence for common claims

Commands below match the root `package.json` at the time this skill was written. If a script name and the file disagree, the `package.json` script is the command to run.

| Claim                              | Proving command                                                                                            | Insufficient substitute                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Unit tests pass                    | `pnpm test`                                                                                                | An earlier run, or one file when the change can affect others |
| One test file passes               | `pnpm exec vitest run --project unit <file>`                                                               | The file existing                                             |
| Fitness tests pass                 | `pnpm test:fitness`                                                                                        | The studio unit project                                       |
| Studio browser flow passes         | `pnpm test:e2e:studio`                                                                                     | A unit test or a screenshot of a static render                |
| Fitness browser flow passes        | `pnpm test:e2e:fitness`                                                                                    | A studio browser run                                          |
| Lint, docs, skills, and types pass | `pnpm check`                                                                                               | `pnpm check:lint` alone                                       |
| One owned check passes             | `pnpm cli:check <name>`                                                                                    | A guess that the sibling checks pass                          |
| Skill files are valid              | `pnpm cli:skills validate` and, for the full skill gate, `pnpm check:skills`                               | Frontmatter that looks complete                               |
| Catalogs are current               | `pnpm generate:catalogs`, then `pnpm check:catalogs`                                                       | `pnpm check` alone, or a hand-edited `CATALOG.md`             |
| Markdown docs pass                 | `pnpm check:docs`                                                                                          | A visual skim                                                 |
| Studio production build passes     | `pnpm build:studio`                                                                                        | A passing typecheck                                           |
| Fitness production build passes    | `pnpm build:fitness`                                                                                       | A studio build                                                |
| A bug is fixed                     | The original failing command, now passing                                                                  | A code edit without rerunning that command                    |
| A plan task is complete            | The task's command output, then `node .agents/skills/create-plan/scripts/mark-task.mjs` with that evidence | Checking the box because the code exists                      |
| UI behavior works                  | The changed flow exercised in the browser, including the shared pages and edge states                      | One screenshot                                                |
| Deployed or migrated in production | The deployed check the user asked for                                                                      | A local fixture or a green unit run                           |

Before a pull request, `AGENTS.md` asks for `pnpm check` and `pnpm test`. Run `pnpm generate:catalogs` before `pnpm check`, because the check compares catalogs and does not write them. An app UI or route change that can affect the production build also needs `pnpm build:studio` or `pnpm build:fitness` for the app that changed. Report the commands that actually ran.

A user-facing change still updates `docs/testing/manual/` in the same work. Unexecuted guide steps stay **Not run**.
