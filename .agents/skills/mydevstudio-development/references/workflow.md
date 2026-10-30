# Development and verification workflow

1. Inspect git status and latest main; isolate work without discarding existing changes. Read AGENTS.md and relevant source files.
2. Use the package.json engines/packageManager versions. Run pnpm install --frozen-lockfile if dependencies are missing.
3. Implement the domain contract and validator alongside any saved field. Preserve absent-field behavior. Implement shared presentation separately from app data access.
4. Run pnpm check: TypeScript, Biome check, formatting and complexity. pnpm format writes formatting; pnpm lint:fix applies safe lint fixes. Do not disable rules or change thresholds to hide failures.
5. Run pnpm test for Vitest. Add behavior tests for meaningful changes, especially validation, ownership, serialization and defaults.
6. Run NODE_ENV=production pnpm --filter web build for the web app. pnpm build runs the full workspace build, as CI does.
7. Install browsers once with pnpm exec playwright install chromium (CI adds --with-deps). Run pnpm test:e2e after production output exists. The config starts fixture transport on 3101 and production apps on 3100/3102. Do not point tests at a real database. Desktop Chromium and Pixel 7 cover public pages, owner editing, sharing, PDFs, layouts and themes. Inspect screenshots for visual changes.
8. Review diff and sensitive content, then open a PR with behavior and actual verification. CI Verify runs install, check, unit tests, full build and browser tests. Production deployment runs only after Verify on main and uses the configured Vercel secrets. A local build does not prove deployment.

Use targeted reruns to diagnose failures. After changing application code, rebuild before testing production behavior. Do not fabricate missing generated files; regenerate build output. Do not expose environment variables in logs or PRs. See .env.example for public configuration names; values belong in deployment configuration or ignored local environment files.

## Command reference

| Command                                     | Purpose                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| pnpm dev                                    | Run workspace development tasks through Turbo                                                    |
| pnpm build                                  | Build every workspace package and app                                                            |
| pnpm start                                  | Start the built web app                                                                          |
| pnpm check                                  | Run all required static checks                                                                   |
| pnpm typecheck / pnpm check:types           | Root TypeScript check and package type checks                                                    |
| pnpm lint                                   | Biome lint rules                                                                                 |
| pnpm check:lint                             | Biome combined check                                                                             |
| pnpm lint:fix                               | Write safe lint fixes                                                                            |
| pnpm format                                 | Write formatting                                                                                 |
| pnpm check:format                           | Check formatting without changing files                                                          |
| pnpm assist / pnpm check:assist             | Import/assistance checks using the configured Biome mode                                         |
| pnpm check:complexity                       | Complexity checks, with warnings treated as failures                                             |
| pnpm test                                   | Run Vitest once                                                                                  |
| pnpm test:watch                             | Watch unit tests during development                                                              |
| pnpm test:coverage                          | Generate Vitest coverage                                                                         |
| pnpm test:e2e                               | Run Playwright desktop and mobile tests                                                          |
| pnpm test:e2e:ui                            | Open Playwright's interactive test UI                                                            |
| pnpm test:e2e:report                        | Open the generated browser report                                                                |
| pnpm create-package / pnpm create-component | Use existing Turbo/Plop scaffolds                                                                |
| pnpm cv:generate                            | Use the existing CV generator; inspect turbo/generators/config.ts for inputs and output behavior |
| pnpm clean                                  | Run package cleanup tasks; inspect scripts before removing generated output                      |

Use pnpm --filter web followed by a web package script to work on only the Next.js app. Inspect each package.json for build/typecheck/types:check, format/format:check and lint/lint:check aliases. Avoid running fix/clean commands when only verification was requested. Keep generated PDFs, reports and browser captures out of commits unless explicitly part of a deliverable.
