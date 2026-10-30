# Engineering conventions

Use [AGENTS.md](../AGENTS.md) for agent workflow, [architecture](architecture.md) for package boundaries and [testing](testing.md) for verification.

## Tooling and dependencies

- Follow the Node engine and exact pnpm version in root `package.json`.
- Install with `pnpm install --frozen-lockfile`; keep one pnpm lockfile.
- Reference external dependencies with `catalog:` and pin versions in `pnpm-workspace.yaml`.
- Reference internal packages with `workspace:*` and maintain explicit export maps.
- Change the catalog, affected manifests and generated lockfile together.
- Use Biome for formatting, lint and import assistance. Do not add competing formatter/linter configuration or weaken complexity limits.
- Never hand-edit generated Next.js files or commit build output, reports, credentials or private exports.

## TypeScript and modules

Use the existing strict TypeScript configuration. Prefer explicit domain types and validated boundaries over assertions and `any`. Accept untrusted external data as unknown and validate it before use. Keep functions focused and reuse domain helpers instead of duplicating validation across routes.

Follow adjacent file naming and module structure. Export through package entry points; avoid reaching into another package's private implementation. Preserve useful server/browser boundaries and avoid circular dependencies.

## React and presentation

Keep server-side data access in app adapters and repositories. Add client boundaries only for browser interaction, hooks and state. Portable components must not depend on private data access, route-specific assumptions or authentication providers.

Reuse existing primitives, theme tokens, localization resources and section renderer/editor contracts. Preserve existing defaults and reduced-motion behavior. Use semantic controls, accessible names and visible focus. Handle loading, empty, error and mobile states deliberately.

Keep portfolio language/theme settings independent from PDF settings where the product provides separate choices.

## Domain changes and persistence

A new saved property needs its type, validator, import/save handling, default and renderer updated together. Preserve older documents when a field is absent. Validate URLs and other externally supplied values before rendering or using them.

Choose records from authenticated authority on the server. Never trust payload owner IDs, usernames or editable identity metadata to grant access. Keep publication explicit. Respect revision conflicts instead of silently overwriting newer work.

Database migrations are reviewed changes, not build side effects. Do not reintroduce Prisma or a second persistence path. Consult [SECURITY.md](../SECURITY.md) before changing ownership, publication, policies or transfer behavior.

## Errors and observability

Return actionable but non-sensitive failures. Expected validation errors, authorization denials and stale-revision conflicts are different from unexpected service failures. Handle errors at the boundary that can add useful context; avoid recording the same exception repeatedly.

Use existing Pino entry points for server logging and the field conventions in [observability](observability.md). Do not log request bodies, tokens, CV content or raw provider errors. A monitoring outage must not break a user operation.

## Tests, commits and documentation

Test behavior, especially denied access and legacy defaults. Keep test accounts and fixtures synthetic. Run the checks appropriate to the change and disclose anything blocked.

Prefer small commits with descriptive titles such as `docs: explain profile publication boundaries`. PRs explain the problem, resulting behavior, compatibility, verification and remaining setup. Update documentation with the behavior it describes and link to authoritative configuration rather than duplicating version lists that drift.
