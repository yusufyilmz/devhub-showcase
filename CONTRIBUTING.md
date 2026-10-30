# Contributing to MyDevStudio

Start with [README.md](README.md), [architecture](docs/architecture.md) and [conventions](docs/conventions.md). Report suspected vulnerabilities privately using [SECURITY.md](SECURITY.md).

## Set up a workspace

1. Fork the repository if you do not have write access, then clone your fork.
2. Use the Node engine and exact pnpm package-manager version in [package.json](package.json).
3. Run `pnpm install --frozen-lockfile`.
4. Run `pnpm dev`. The bundled public content does not require credentials.
5. Copy `.env.example` to `apps/web/.env.local` only when working on optional integrations. Use a development environment and synthetic records.

Create a focused branch from current `main`, such as `docs/testing-guide` or `fix/profile-validation`. Inspect existing local changes before editing; do not reset another contributor's work.

## Implement a change

Trace the feature from its route through validation, service and repository. Put shared UI and domain behavior in their existing packages. Read the relevant [.agents skills](AGENTS.md) for ownership, sections and compatibility rules.

For persisted fields, update types, validation, defaults, import/save boundaries and rendering together. Existing documents must continue to work when the new field is absent. Test anonymous, owner and unauthorized-user behavior when changing access.

External dependencies use `catalog:` with versions in `pnpm-workspace.yaml`; internal packages use `workspace:*`. Dependency changes must include the regenerated `pnpm-lock.yaml`. Do not add another package manager or reintroduce Prisma.

Schema changes need a reviewed migration and evidence from an isolated database. Building the app is not authorization to alter production records, grant roles, publish a profile or transfer ownership.

## Verify before opening a PR

```sh
pnpm check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

See [testing](docs/testing.md) for focused runs, CI parity and limitations. Documentation-only edits need checked links, commands and source claims; still report whether the standard checks ran. Do not mark skipped checks as passing.

Review keyboard access, focus, mobile overflow, loading/empty/error states and reduced motion for UI changes. Rebuild production output before rerunning browser tests after an application change.

## Pull requests

Use a title that describes the result, such as `fix: preserve private CV access after username changes`. Keep unrelated refactors separate.

Explain:

- The problem and resulting behavior.
- Relevant compatibility, privacy or migration effects.
- Tests actually run, failures and blocked verification.
- Screenshots for visible changes, using synthetic content.
- Any manual setup required after merge.

Do not include environment values, credentials, real CV uploads, private profiles or raw production logs. Preserve license notices when adapting third-party code. Let `Verify` finish before merging; a PR does not itself deploy production.

## Review and maintenance

Address review feedback with focused changes. Avoid weakening types, lint rules, complexity limits or assertions to make CI pass. When behavior or commands change, update the relevant guide in the same PR. Record known limitations explicitly rather than implying an integration is active merely because setup instructions exist.
