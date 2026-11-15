# App deployment routing and free Actions — manual testing

**Scope/status:** Implemented workflow routing and free-only guards. Configuration
inspection is separate from actual post-merge deployment. A green local suite does
not prove that GitHub's stored token can deploy Fitness or that billing is zero.

**Prerequisites:** Matching PR/commit, public monorepo, existing Vercel projects and
[deployment setup](../../deployments.md). Use reviewed main-branch changes for
production acceptance; do not modify real fitness records to test routing.

| Step | Clickable URL                                                                                             | Route path                                                 | Action                                                                                                                      | Expected result                                                                                  | Actual result / evidence                                                                         |
| ---- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 1    | [CI workflow](https://github.com/yusufyilmz/devhub-showcase/actions/workflows/ci.yml)                     | `/yusufyilmz/devhub-showcase/actions/workflows/ci.yml`     | Open a PR changing only `apps/my-dev-studio/`. Inspect Select affected apps and Verify.                                     | Studio true, Fitness false; PR cannot deploy production.                                         | Local real-Git and policy tests passed; new hosted workflow not yet run.                         |
| 2    | [CI workflow](https://github.com/yusufyilmz/devhub-showcase/actions/workflows/ci.yml)                     | `/yusufyilmz/devhub-showcase/actions/workflows/ci.yml`     | Repeat with only `apps/my-fitness-app/`, then a shared package. Include a multi-commit push.                                | Fitness-only selects Fitness; packages select both; whole push range is checked.                 | Local real-Git tests passed. Hosted main deployments not run.                                    |
| 3    | [CI workflow](https://github.com/yusufyilmz/devhub-showcase/actions/workflows/ci.yml)                     | `/yusufyilmz/devhub-showcase/actions/workflows/ci.yml`     | Use a documentation-only PR.                                                                                                | Verify still runs, both production deployments skip.                                             | Local path policy tests passed; hosted check pending.                                            |
| 4    | [CI workflow](https://github.com/yusufyilmz/devhub-showcase/actions/workflows/ci.yml)                     | `/yusufyilmz/devhub-showcase/actions/workflows/ci.yml`     | Merge an approved app-only change after Verify passes.                                                                      | Only the matching app deploys. Package/workflow changes deploy both.                             | Not run; requires the workflow PR to merge.                                                      |
| 5    | [Studio](https://mydevstudio.vercel.app/)                                                                 | `/`                                                        | After its selected deployment, open the homepage, examples and login.                                                       | Existing Studio remains available; no unrelated Fitness deployment.                              | Existing deployment identified; post-change production smoke test not run.                       |
| 6    | [Fitness OS](https://yusuf-fitness-os.vercel.app/)                                                        | `/`                                                        | After the first monorepo Fitness deployment, open Today and More. Sign in only with the configured owner if testing a save. | Same production URL and saved workspace; app runs from the monorepo root setting.                | Existing target and required variable names verified; new production release not run.            |
| 7    | [Fitness build settings](https://vercel.com/yusufyilmzs-projects/yusuf-fitness-os/settings)               | `/yusufyilmzs-projects/yusuf-fitness-os/settings`          | Inspect Root Directory, Node, install/build commands and outside-root access.                                               | `apps/my-fitness-app`, Node 24, app-specific monorepo build/install, shared source allowed.      | Applied and read back: app root, Node 24, app-specific commands and shared source access.        |
| 8    | [GitHub variables](https://github.com/yusufyilmz/devhub-showcase/settings/variables/actions)              | `/yusufyilmz/devhub-showcase/settings/variables/actions`   | Inspect VERCEL_FITNESS_PROJECT_ID. Do not reveal tokens.                                                                    | Matches the existing `yusuf-fitness-os` project, using existing monorepo deployment credentials. | Variable set and read back; matches the verified existing project.                               |
| 9    | [Standalone Fitness workflow](https://github.com/yusufyilmz/yusuf-fitness-os/actions/workflows/ci-cd.yml) | `/yusufyilmz/yusuf-fitness-os/actions/workflows/ci-cd.yml` | Inspect its enabled/disabled status after cutover preparation.                                                              | Disabled; private repo no longer consumes Actions time or overwrites the monorepo release.       | GitHub API confirms disabled_manually; no code/history deleted.                                  |
| 10   | [Actions settings](https://github.com/yusufyilmz/devhub-showcase/settings/actions)                        | `/yusufyilmz/devhub-showcase/settings/actions`             | Confirm public visibility, standard runners and a cache maximum of 10 GB. Inspect browser workflow output.                  | Only free standard runner jobs; no new artifact uploads or larger-runner configuration.          | Cache ceiling read and set to 10 GB; workflow policy tests passed.                               |
| 11   | [Billing budgets](https://github.com/settings/billing/budgets)                                            | `/settings/billing/budgets`                                | Set an Actions budget of $0 with Stop usage enabled and confirm its scope.                                                  | Billable overage is stopped according to GitHub's supported budget controls.                     | Not run: personal billing UI requires account-owner confirmation; no API access to this setting. |
| 12   | [Workflow dispatch](https://github.com/yusufyilmz/devhub-showcase/actions/workflows/ci.yml)               | `/yusufyilmz/devhub-showcase/actions/workflows/ci.yml`     | On main, select Fitness in Run workflow after cutover. Try a non-main branch separately.                                    | Main verifies then deploys only Fitness; non-main never gets production deployment steps.        | Manual-target selection and workflow gates tested locally; no production dispatch run.           |
| 13   | [Concurrent runs](https://github.com/yusufyilmz/devhub-showcase/actions)                                  | `/yusufyilmz/devhub-showcase/actions`                      | Inspect real runs when approved changes arrive close together.                                                              | Old same-app releases skip; an unrelated app change does not discard a pending app release.      | Local real-Git stale-release tests passed; concurrent live deployment not run.                   |

## Verification recorded on 2026-11-05

- `pnpm check`: passed.
- `pnpm test`: 535 workspace tests and 45 Fitness tests passed (580 total).
- Actionlint 1.7.12: all three workflows passed schema/expression checks.
- Studio and Fitness production builds: passed locally.
- Existing Fitness production deployment remains READY at its existing domain;
  project configuration changes did not create a new release.
- The account-wide $0 billing budget and the first post-merge deployment are
  still unverified; the table above does not mark them complete.

## Repeatable local checks

`pnpm exec vitest run --project unit tools/cli/ci/changes.test.ts` exercises actual
Git histories, moved files, shared paths, missing history, PR comparisons and
stale-release rules. Actionlint validates GitHub syntax. Neither invokes Vercel,
uses deployment tokens, changes billing, nor writes production data.

The first merged workflow edit selects both apps by design. Follow the rollback
instructions in [deployment setup](../../deployments.md) before re-enabling the
standalone repository; never leave two production publishers active.
