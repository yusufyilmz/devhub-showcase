# Shared CLI and test packages

Scope: local workspace tooling relocation into `@shared/cli` and `@shared/test`. No deployed behavior changes are expected.

## Prerequisites

Use repository Node/pnpm versions and run `pnpm install --frozen-lockfile`. Run commands at the repository root. Feature-specific tests remain colocated; shared fixtures and mocks live in `tools/test`. No account or service credentials are needed for tooling checks.

## Steps

| Step | Clickable URL                              | Route path | Action                                                                                         | Expected result                                                                         | Actual result / evidence                     |
| ---- | ------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------- |
| 1    | [Local login](http://localhost:3001/login) | `/login`   | Run pnpm dev:setup twice, then start the app and open login.                                   | Environment setup still preserves an existing file after relocation.                    | Browser not run                              |
| 2    | [Storybook](http://localhost:6006)         | `/`        | Start Storybook and open a portfolio story that uses shared fixtures.                          | Shared frame, palette and fixture aliases resolve.                                      | Not run                                      |
| 3    | [Local login](http://localhost:3001/login) | `/login`   | Run pnpm test and pnpm check:exports; open login signed out.                                   | Tests resolve relocated setup/mocks; exports are valid; normal login remains available. | Browser not run; see PR for command evidence |
| 4    | [Local login](http://localhost:3001/login) | `/login`   | Run pnpm exec turbo run build --dry=json and rerun pnpm dev:setup with an existing local file. | Build graph resolves CLI dependency without cycles; local configuration persists.       | See PR for command evidence                  |

Generators use root commands with the explicit `tools/cli/generators/config.ts` configuration. Library configs import `@shared/cli/tsdown`. Existing `@fixtures/*` aliases point to `tools/test/fixtures`. These tooling changes do not change owner, other-user or signed-out access policy; login-specific checks remain in the [local development guide](local-development.md).

## Repository type and unit checks

Run `pnpm typecheck` to check the root test/tooling TypeScript project and then all workspace packages. Shared libraries use bundler module resolution to match their tsdown build and source exports. Root test aliases are derived from current package export maps, including wildcard entry points; they do not refer to removed services/cache packages.

Run `pnpm test` for the complete unit project. Tests use local fixtures and mocked services; this does not verify deployed integrations. The CV generator tests mock public profile reads and PDF output. They verify that default/named profile requests select the published CV surface, missing/private named CVs cannot fall back to another owner, the current template path is used, and existing output files are preserved.

The root workspace declares `@shared/lib` for the root-invoked generator. It is not a dependency of the shared CLI package, which would introduce a build graph cycle because lib itself consumes the shared CLI build configuration.

| Step | Clickable URL                                               | Route path                                                                | Action                                                                                                       | Expected result                                                                                                                                          | Actual result / evidence                    |
| ---- | ----------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 5    | [Repository](https://github.com/yusufyilmz/devhub-showcase) | `/yusufyilmz/devhub-showcase` (repository context; CLI has no HTTP route) | Run `pnpm typecheck` followed by `pnpm test` from the repository root with Node 24.15+ below 25 and pnpm 11. | Root and workspace type checks pass; the full unit suite runs without a removed-package startup error.                                                   | Not run manually; automated evidence below. |
| 6    | [Repository](https://github.com/yusufyilmz/devhub-showcase) | `/yusufyilmz/devhub-showcase`                                             | Run `pnpm exec vitest run --project unit tools/cli/generators/config.test.ts`.                               | Published CV selection, missing/private CV rejection and existing-output protection pass using mocked fixtures. No database or real PDF file is written. | Not run manually; automated evidence below. |

Browser, provider and deployed verification remain outside these local tooling checks. Do not run `pnpm cv:generate` against production records to reproduce the regression tests.

Local automated evidence on 2026-11-07 in the primary checkout: `pnpm typecheck` passed the root project and all 15 workspace typecheck tasks. `pnpm test` passed 658 tests across 187 files, including the three CV generator regression tests. Targeted lint, package export validation and documentation lint passed for these tooling changes. Browser/provider checks remain not run.
