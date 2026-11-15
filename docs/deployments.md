# App deployments and free GitHub Actions

## When to read

Read this before changing what ships to production, editing the deploy workflow, or checking why a push built one app and skipped the other. It covers the Verify gate, Studio and Fitness selection, Vercel projects, and the free GitHub Actions limits.

The public `yusufyilmz/devhub-showcase` repository owns production deployment for
both apps. Main pushes must pass **Verify** before a selected app deploys. Pull
requests verify code without receiving production deployment credentials.

## What deploys

| Changed path                                                           | Studio | Fitness OS |
| ---------------------------------------------------------------------- | ------ | ---------- |
| `apps/my-dev-studio/**`                                                | Deploy | Skip       |
| `apps/my-fitness-app/**`                                               | Skip   | Deploy     |
| `packages/**`                                                          | Deploy | Deploy     |
| `tools/**`, shared workspace/build configuration, CI workflows/actions | Deploy | Deploy     |
| Documentation only, unrelated Storybook app content                    | Skip   | Skip       |

The actual Fitness folder is `apps/my-fitness-app`, not `my-fintess-app`.
Root package/lock/workspace files, Turbo, TypeScript, Biome and shared environment
or Node configuration can affect both apps and therefore deploy both.

`tools/cli/ci/changes.ts` compares the complete push range, includes old paths for
moves/deletions and uses the merge base for PR comparisons. Missing initial or
force-push history conservatively selects both apps. The run summary records its
selection. Manual runs on main offer all/studio/fitness; manual runs from another
branch never deploy production.

The shared deployment workflow uses a concurrency group per app and checks for
newer relevant main changes before deployment. An older run skips if that app has
been superseded; a change only to the other app does not discard its release.
Every main push retains its selection instead of being cancelled by an unrelated
push. Per-app queued runs can be replaced by a newer queued run of the same app,
whose source includes those changes.

Both apps disable Vercel-native **main** Git deployments in their `vercel.json` so
production cannot bypass Verify. Studio's existing native PR previews remain
available. The ignored-build command compares against Vercel's previous deployed
SHA and skips an unaffected app; a missing comparison builds conservatively.
Fitness remains a CLI-managed Vercel project rather than creating another project
or a second automatic deployment path.

## Existing deployment targets and configuration

| Application | Existing Vercel project | Root directory        | Public URL                                         |
| ----------- | ----------------------- | --------------------- | -------------------------------------------------- |
| Studio      | `devhub-showcase`       | `apps/my-dev-studio`  | [MyDevStudio](https://mydevstudio.vercel.app/)     |
| Fitness OS  | `yusuf-fitness-os`      | `apps/my-fitness-app` | [Fitness OS](https://yusuf-fitness-os.vercel.app/) |

The Fitness target is the same existing project used by the old private
[yusuf-fitness-os repository](https://github.com/yusufyilmz/yusuf-fitness-os).
Its project ID is `prj_cp0GZ3vAFURSFrA9uAa2v8793rfk`; the team is
`team_CsUDyUnkEW9uWeCesk64Lq5D`. These identifiers are not credentials.

The monorepo uses its existing `VERCEL_TOKEN`, `VERCEL_ORG_ID` and Studio
`VERCEL_PROJECT_ID` secrets. A repository **variable**,
`VERCEL_FITNESS_PROJECT_ID`, points to that existing Fitness project. The reusable
workflow receives the selected ID as `DEPLOY_PROJECT_ID`, preventing an existing
production environment's Studio-named `VERCEL_PROJECT_ID` secret from overriding
the Fitness target. Tokens are scoped to production pull/build/deploy steps and
never printed or passed in command-line arguments.

Vercel's Fitness project must have root `apps/my-fitness-app`, Node 24 and source
files outside the root enabled. Its install/build commands match that app's
`vercel.json` and build only the selected app. Existing production variables,
domains and database are retained; their values are not copied into GitHub or
committed. Readiness inspection found the existing auth/owner/database variables.
Optional notification credentials/worker setup remain a separate feature.

After GitHub Verify succeeds, the Fitness OS job uploads the verified source to
Vercel for the production build. Vercel provides the production database URI to
that build. External builds receive a placeholder when pulling this Secret.
Studio continues to build in GitHub Actions and deploy its prebuilt output.

Configuration preparation on 2026-11-05 set and read back the monorepo Fitness
project variable and Vercel monorepo settings, and disabled the old workflow
(`disabled_manually`). No production deployment was triggered. Merge the workflow
PR to activate the replacement pipeline; post-merge acceptance remains pending.

## Cutover and rollback

1. Review and merge the monorepo workflow change after checks pass. The workflow
   file change selects both apps for this initial main release.
2. Confirm the monorepo variable points to the existing Fitness project, and its
   Vercel root/build/install settings use this monorepo. The current production
   site remains live while settings change; no deployment or database migration is
   performed just by changing those settings.
3. Disable the old private repository's `ci-cd.yml` workflow so it cannot publish
   its standalone checkout over the monorepo release. Its code, secrets and
   historical runs are retained. Only the monorepo owns deployment from now on.
4. Check the first Fitness run and public URL. Subsequent app-only changes should
   deploy only that app; package changes should deploy both.

Operator commands, containing no credential values:

```sh
gh variable set VERCEL_FITNESS_PROJECT_ID --repo yusufyilmz/devhub-showcase \
  --body prj_cp0GZ3vAFURSFrA9uAa2v8793rfk
gh workflow disable ci-cd.yml --repo yusufyilmz/yusuf-fitness-os
```

Rollback requires pausing the monorepo Fitness deploy path before enabling the
standalone Fitness workflow. Restore the Fitness project's original root (repository root),
`pnpm build` and `pnpm install --frozen-lockfile` before invoking the old standalone
pipeline. Do not enable both production writers together. Existing production
releases can be rolled back separately without changing the database.

## Free-only controls and their limits

- Every job requires a public repository and uses only standard `ubuntu-latest`.
  Jobs skip if the repository becomes private. Tests check this policy across all
  workflow files, including new jobs.
- No workflow uploads Actions artifacts. Browser diagnostics remain in logs, and
  local Playwright reports remain available when tests run locally. Existing
  historical artifacts are not deleted by this change.
- The repository cache ceiling is **10 GB**, GitHub's included per-repository
  allowance. Only verification/browser jobs cache dependencies; deployment jobs do
  not create more caches. Do not raise the ceiling for this zero-spend policy.
- Actions are pinned to full commit IDs, Vercel CLI to a reviewed exact version,
  jobs have timeouts and PR verification cancels obsolete PR runs.
- A repository workflow cannot promise future pricing or enforce account-wide
  billing. For a hard stop, open
  [GitHub Budgets and alerts](https://github.com/settings/billing/budgets), choose
  Actions, set the budget to **$0** and enable **Stop usage when budget limit is
  reached**, where available. Verify the scope covers this repository/account.
  This personal-account setting is not exposed by the connected APIs and must be
  confirmed in GitHub's UI. No paid plan has been enabled by this work.
- Vercel hosting is separate from GitHub Actions. The inspected team is on Hobby;
  this change reuses its projects and does not upgrade its plan.

Primary references: [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions),
[budget enforcement](https://docs.github.com/en/billing/how-tos/set-up-budgets),
[Vercel Git deployment controls](https://vercel.com/docs/project-configuration/git-configuration).

## Verification

Run `pnpm check` and `pnpm test`. The colocated
`tools/cli/ci/changes.test.ts` executes real temporary Git histories and validates
workflow cost/deployment rules and native-preview ignore commands. Run actionlint
against all three workflows for GitHub expression/schema checks.

Local selection previews do not deploy anything:

```sh
node tools/cli/ci/changes.ts --paths apps/my-dev-studio/app/page.tsx
node tools/cli/ci/changes.ts --paths apps/my-fitness-app/app/page.tsx
node tools/cli/ci/changes.ts --paths packages/ui/src/example.tsx
node tools/cli/ci/changes.ts --paths docs/example.md
```

See the [manual acceptance guide](testing/manual/deployments.md) for links,
expected results and the distinction between local tests, configuration changes
and a real post-merge production deployment.
