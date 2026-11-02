# Development and verification workflow

1. Inspect git status and the current branch. Keep unrelated changes. Read `AGENTS.md` and the source you will edit.
2. Use the Node and pnpm versions in the root `package.json`. Run `pnpm install --frozen-lockfile` when dependencies are missing.
3. Change a persisted field in the type, validator, save and import boundary, and renderer together. Preserve documents that omit the field. Keep shared presentation in `packages/ui` and data access in `apps/my-dev-studio/features`.
4. Run `pnpm check`. That covers TypeScript, Biome, formatting, complexity, docs, skills, and package exports. `pnpm format` writes formatting. `pnpm lint:fix` applies safe lint fixes. Do not disable rules or raise thresholds to hide failures.
5. Run `pnpm test` for Vitest. Add tests for validation, ownership, serialization, and defaults when the change affects them.
6. Build the app with `pnpm --filter my-dev-studio build`. `pnpm build` builds the whole workspace, which is what CI does.
7. Install Chromium once with `pnpm exec playwright install chromium`. CI adds `--with-deps`. Run `pnpm test:e2e` after a production build exists. The Playwright config uses fixture transport on port 3101 and app servers on 3100 and 3102. Do not point tests at a real database. If `playwright.config.ts` still runs `pnpm --filter web`, change that filter to `my-dev-studio`. Do not recreate an `apps/web` package.
8. Review the diff for scope and secrets, then open a PR that states the behavior and the checks that actually ran. CI Verify installs, then runs `pnpm check`, `pnpm test`, the Storybook build, and `pnpm build`. Browser tests run in a separate non-blocking workflow only on pushes to the production branch, `main`; deployment depends on Verify, not browser tests. A local build does not prove a Vercel deployment.

Use a narrower command to diagnose one failure. Rebuild before retesting production behavior. Do not invent generated files. Do not print environment values in logs or PRs. Names of public configuration live in `.env.example`. Values stay in deployment configuration or an ignored local env file.

## Command reference

| Command                                         | Purpose                                                 |
| ----------------------------------------------- | ------------------------------------------------------- |
| `pnpm --filter my-dev-studio dev`               | Next.js dev server                                      |
| `pnpm --filter storybook-app storybook`         | Storybook                                               |
| `pnpm --filter storybook-app storybook:clean`   | Delete the Storybook optimizer cache                    |
| `pnpm --filter storybook-app storybook:kill`    | Stop Storybook on port 6006                             |
| `pnpm dev`                                      | Workspace development tasks through Turbo               |
| `pnpm build`                                    | Build every workspace package and app                   |
| `pnpm --filter my-dev-studio start`             | Start the built Next.js app                             |
| `pnpm check`                                    | All required static checks                              |
| `pnpm check:exports`                            | Confirm package.json export targets exist               |
| `pnpm typecheck` / `pnpm check:types`           | Root TypeScript check and package type checks           |
| `pnpm --filter my-dev-studio typecheck`         | App TypeScript check only                               |
| `pnpm lint`                                     | Biome lint                                              |
| `pnpm check:lint`                               | Biome combined check                                    |
| `pnpm lint:fix`                                 | Write safe lint fixes                                   |
| `pnpm format`                                   | Write formatting                                        |
| `pnpm check:format`                             | Check formatting without writing                        |
| `pnpm assist` / `pnpm check:assist`             | Biome import assistance                                 |
| `pnpm check:complexity`                         | Complexity checks; warnings fail                        |
| `pnpm exec vitest run --project unit`           | Unit Vitest project                                     |
| `pnpm exec vitest run --project unit <file>`    | One test file                                           |
| `pnpm test`                                     | Unit Vitest project once                                |
| `pnpm test:watch`                               | Vitest watch                                            |
| `pnpm test:coverage`                            | Vitest coverage                                         |
| `pnpm test:e2e`                                 | Playwright                                              |
| `pnpm test:e2e:ui`                              | Playwright UI                                           |
| `pnpm test:e2e:report`                          | Playwright report                                       |
| `pnpm create-package` / `pnpm create-component` | Existing Turbo generators                               |
| `pnpm cv:generate`                              | CV generator; read `turbo/generators` before using it   |
| `pnpm clean`                                    | Package cleanup; read the script before deleting output |

The root `pnpm start` script still filters `web`. Use `pnpm --filter my-dev-studio start` until that script is updated. Inspect each package.json for its own `build`, `typecheck`, and lint scripts. Do not run fix or clean commands when the task is verification only. Do not commit generated PDFs, reports, or browser captures unless they are the deliverable.
