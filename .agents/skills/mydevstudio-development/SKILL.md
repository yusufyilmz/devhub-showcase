---

name: mydevstudio-development
description: Develop, test and review MyDevStudio changes. Use for workspace setup, package boundaries, dependencies, scripts, lint, type checks, production builds, Playwright and GitHub Actions failures.
---

Read [the workspace map](references/workspace.md) before choosing a package. Follow [the verification workflow](references/workflow.md) for implementation and PR validation. Run scripts/check-workspace.mjs from the repository root to confirm documented command and workspace assumptions without changing files.

Inspect current package.json files, pnpm-workspace.yaml and .github/workflows/ci.yml rather than relying on remembered versions. Use existing components and validated domain adapters. Keep changes focused and run checks appropriate to their behavior. Report failed or skipped verification accurately.
