# Working on MyDevStudio

MyDevStudio is a multiuser portfolio and CV platform. Read the relevant repository skill before changing behavior:

- [.agents/skills/mydevstudio-development/SKILL.md](.agents/skills/mydevstudio-development/SKILL.md): workspace setup, package boundaries, build, lint, tests and CI.
- [.agents/skills/mydevstudio-business/SKILL.md](.agents/skills/mydevstudio-business/SKILL.md): ownership, publication, managed profiles, editing and CV rules.
- [.agents/skills/mydevstudio-sections/SKILL.md](.agents/skills/mydevstudio-sections/SKILL.md): section models, renderers, hero/media behavior and compatibility.

## Repository rules

Use the Node engine and pnpm version declared in package.json. Install with pnpm install --frozen-lockfile. Use catalog: for external workspace dependencies and workspace:* for internal packages. Update pnpm-workspace.yaml and the lockfile together when changing dependencies. Prisma is disabled; do not reintroduce it.

Keep portable UI in packages/components, domain content in packages/content, validators and repositories in packages/lib, authentication in packages/auth, PDF rendering in packages/cv, high-level section renderer/editor pairs in packages/sections, and app routes/adapters in apps/web. packages/ui contains the existing portfolio UI. Do not move app routes, private data access or auth into portable components. Never hand edit generated Next.js files.

Preserve legacy profile documents and existing renderer defaults. Validate new saved fields at every save/import boundary. Keep authorization on the server and isolate each owner's records. Do not publish private profiles, transfer ownership, or mutate production data as a side effect of a code change. Never commit credentials or private database exports.

Before a PR, run pnpm check and pnpm test. For application behavior, build production with NODE_ENV=production pnpm --filter web build and run pnpm test:e2e. Browser tests use local fixtures, not production accounts. Review accessibility, mobile layout, empty states and reduced motion. Keep cognitive complexity within the configured limit; do not weaken checks to pass CI.

Use small, reviewable PRs. Explain the resulting behavior, compatibility, validation and limitations. Preserve third-party license notices when copying code. Distinguish local checks from GitHub CI or production deployment status.
