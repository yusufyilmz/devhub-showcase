# Agent instruction templates

Adapted from Anthropic's [claude-md-improver templates](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/claude-md-management/skills/claude-md-improver/references/templates.md) (Apache-2.0). Use only the sections a repository actually needs. Do not replace DevHub Showcase's existing instruction hierarchy with these generic examples.

## Principles

- **Concise:** one actionable line per concept; move long lists into linked references.
- **Current:** validate scripts, package boundaries, environment variables and document links against the actual checkout.
- **Specific:** preserve non-obvious behaviors and important security, product and migration constraints.
- **Scoped:** use a root instruction file for cross-repository invariants and additional instructions only for specialized areas.

## Minimal root `AGENTS.md`

```markdown
# Project name

One sentence explaining the product, repository and runtime.

## Startup

Read the primary development skill, verify the checkout and preserve unrelated changes.

## Commands

Install: use the exact package-manager version declared in the repository.
Quality: run the actual checks listed in package.json.
Tests: distinguish isolated unit tests from database/browser suites.
Build: run the declared production command.

## Architecture

Name the entry points and which package owns UI, domain logic and persistence.

## Critical boundaries

Call out server-side authorization, secrets, migrations and other non-obvious risks.
```

## Monorepo root additions

Document only the package owners agents are likely to confuse, and link to the full engineering conventions for details.

```markdown
## Package ownership

UI: packages/ui
App services: apps/my-dev-studio/services
Shared domain services: packages/lib
Authentication: packages/auth

## Imports and exports

Use declared workspace export paths between packages.
Use relative imports inside the same package.
Regenerate catalogs when exports change.
```

## Package or feature-specific instructions

Put narrow rules into an additional `AGENTS.md` only when the agent genuinely needs them whenever it edits that area. Otherwise use a repository skill with a precise description and reference links.

```markdown
# Package name

## What this package owns

One or two sentences about ownership and public entry points.

## Non-obvious constraints

State only the package-specific rules that are easy to get wrong.

## Checks

List focused commands and their prerequisites.
```

## CLAUDE.md compatibility

If Claude Code needs to read the canonical root `AGENTS.md`, use a short root `CLAUDE.md` that contains only `@AGENTS.md`, rather than maintaining two drifting copies. Link repository skills through the existing editor skill-discovery workflow.

## Updating an existing file

Before adding anything, ask whether a line is already present in `AGENTS.md`, the root development skill, `docs/conventions.md`, or an on-demand reference. Favor a small diff and show why each change makes future sessions more reliable.
