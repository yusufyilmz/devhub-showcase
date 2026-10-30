# Working on MyDevStudio

MyDevStudio is a multiuser portfolio and CV platform in the `devhub-showcase` repository. These instructions apply throughout the repository; check for more specific instructions before editing.

## Start with evidence

Inspect the working tree and current branch. Preserve unrelated changes. Read the affected source, manifests and tests before choosing an implementation. Do not assume historical setup notes describe today's production state.

Read the relevant repository skill:

- [Development](.agents/skills/mydevstudio-development/SKILL.md): workspace boundaries, tooling, tests and CI.
- [Business rules](.agents/skills/mydevstudio-business/SKILL.md): ownership, publication, managed profiles, editing and CV behavior.
- [Sections](.agents/skills/mydevstudio-sections/SKILL.md): models, renderer/editor pairs, media and compatibility.

Use [architecture](docs/architecture.md), [conventions](docs/conventions.md), [testing](docs/testing.md) and [observability](docs/observability.md) as supporting guides. Run `node .agents/skills/mydevstudio-development/scripts/check-workspace.mjs` from the root to check basic workspace assumptions.

## Tooling

Use the Node engine and exact pnpm version in `package.json`. Install with `pnpm install --frozen-lockfile`. External dependencies use `catalog:`; internal dependencies use `workspace:*`. Update the workspace catalog, manifests and regenerated lockfile together. Do not add another lockfile, package manager, ORM selector or Prisma.

Use Biome and existing TypeScript settings. Do not relax rules, complexity limits or assertions to pass CI. Never hand-edit generated Next.js files.

## Package boundaries

Keep portable UI in `packages/components`, domain content in `packages/content`, validation/repositories in `packages/lib`, authentication in `packages/auth`, PDF rendering in `packages/cv`, section renderer/editor pairs in `packages/sections`, and routes/adapters in `apps/web`. `packages/ui` contains the existing portfolio UI.

Do not move auth, private data access or routes into portable components. Preserve explicit package exports and server/browser boundaries. Prefer existing abstractions over a second representation of the same profile data.

## Data and security invariants

Preserve legacy profile documents and renderer defaults. Update types, validators, save/import boundaries and rendering together for persisted fields. Test absent-field compatibility.

Keep authorization on the server and isolate each owner's records. Client-provided IDs, usernames and user-editable identity metadata are not authority. Respect revision conflicts. Named private or missing profiles must never fall back to another person's content.

Do not publish profiles, transfer ownership, assign roles, apply production migrations or mutate production records as a side effect of code work. Never commit credentials or private exports. Do not log CV content, prompts, tokens or raw request bodies. See [SECURITY.md](SECURITY.md); historical legacy RLS findings require revalidation, not assumptions.

Preserve third-party license notices when adapting code.

## Verification

Before a PR, run `pnpm check` and `pnpm test`. For application behavior, run `NODE_ENV=production pnpm --filter web build` and `pnpm test:e2e`; CI runs the full `pnpm build`. Install Chromium with `pnpm exec playwright install chromium` when needed.

Browser tests use local fixtures, not production accounts. Rebuild after code changes. Review accessibility, keyboard focus, mobile layout, loading/empty/error states and reduced motion for visible changes.

For docs, verify links and commands against current files. If a required check cannot run, state the exact blocker and leave its status unverified. Do not fabricate test output or generated files.

## Finish clearly

Keep changes focused and review the final diff for scope and sensitive data. Update documentation when commands, boundaries or behavior change. Explain the resulting behavior, compatibility, checks actually run and remaining setup in the PR.

Distinguish local checks from GitHub CI and production deployment. Distinguish a proposed monitoring framework from an installed SDK or an operational service. Do not claim completion of an external integration until its actual flow has been verified.
