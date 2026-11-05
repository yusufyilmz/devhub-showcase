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
