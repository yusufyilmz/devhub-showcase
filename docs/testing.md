# Testing and verification

Run commands from the repository root using the Node/pnpm versions in [package.json](../package.json). The source of truth is the scripts, [Vitest configuration](../vitest.config.mts), [Playwright configuration](../playwright.config.ts) and [CI workflow](../.github/workflows/ci.yml).

## Standard checks

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

CI installs Chromium with `--with-deps` on Linux. For an app-only production build, use `NODE_ENV=production pnpm --filter web build`; CI uses the full workspace build.

| Check                | What it establishes                                                               |
| -------------------- | --------------------------------------------------------------------------------- |
| `pnpm check`         | Biome checks, complexity limits and root/workspace types                          |
| `pnpm test`          | Vitest tests under `tests/**/*.test.{ts,tsx}`                                     |
| `pnpm test:coverage` | V8 coverage for configured portfolio services, date utilities and chat formatting |
| `pnpm build`         | Workspace type/build tasks and production Next.js compilation                     |
| `pnpm test:e2e`      | Desktop Chromium and Pixel 7 emulation against production output                  |

Coverage is a selected source subset, not a whole-repository percentage. A green suite does not certify live Google OAuth, real provider requests, production database policies or real iPhone/Safari behavior.

## Choose meaningful tests

| Change                       | Useful verification                                                               |
| ---------------------------- | --------------------------------------------------------------------------------- |
| Profile types and validation | Valid/invalid input, legacy missing fields, save/import round trips               |
| Ownership and publication    | Anonymous, owner, other user and administrator; private reads and denied writes   |
| Managed transfer             | Revision conflicts, existing recipient content, access after transfer             |
| Sections and editor          | Render defaults, serialized settings, keyboard interaction and reload persistence |
| PDF generation               | Correct profile, visibility, language/settings, generated content                 |
| AI integrations              | Missing configuration, limits, provider failures, no sensitive output             |
| Documentation                | Relative links, executable commands, current source claims and setup status       |

Use existing fixtures and test helpers. Add regression coverage for behavior changes, not tests that merely repeat implementation details. Never weaken checks or assertions to hide a failure.

## Focused runs

```sh
pnpm exec vitest run tests/user-profile.test.ts
pnpm exec vitest run tests/managed-rls.test.ts
pnpm exec playwright test e2e/home.spec.ts --project=desktop-chromium
pnpm test:watch
pnpm test:e2e:ui
```

Rebuild before testing changed application code with Playwright. Targeted tests help diagnosis; run the appropriate broader checks before claiming the change is verified.

## Browser environment

The Playwright configuration owns three servers and does not reuse existing ones:

| Port | Service                                              |
| ---- | ---------------------------------------------------- |
| 3100 | Production app with synthetic Supabase configuration |
| 3101 | Local fixture transport with in-memory test data     |
| 3102 | Production app without database configuration        |

Keep these ports free. Tests must not point at production accounts or databases. Fixture sessions exercise application behavior but do not validate real provider authentication. Migration/RLS tests provide separate policy coverage; live-environment verification remains a distinct step.

Check mobile overflow, focus order, labels, empty/error states and reduced motion when reviewing UI changes.

## Browser coverage and fixture contract

Each test has a fresh browser context. The local transport returns checked-in public content and synthetic accounts through the application's normal repository paths. Unknown usernames return no row; public fixture records reject writes, and isolated synthetic accounts edit only their own in-memory starter records. Synthetic sessions are accepted by the fixture only.

Coverage includes homepage navigation and metadata, keyboard preview tabs, themes, layout/language combinations, CV downloads, owner editing and save/reload behavior, private and unknown profiles, managed publication/transfer, custom sections/media/templates, SEO and sitemap exclusions. CV extraction scenarios use a fictional intercepted provider response, not paid requests.

Use localhost consistently as configured because origin checks depend on the application origin. Do not redirect fixture traffic to a real database. Mobile Chromium emulation is not a real iPhone test.

## Diagnose failures

1. Reproduce with the same runtime and frozen dependencies.
2. Identify whether the failure is static checking, test behavior, build output or a server startup problem.
3. Run the affected test in isolation. For browser failures, inspect `test-results/` and `pnpm test:e2e:report`.
4. Rebuild stale production output and confirm the required ports are available.
5. Fix the cause and rerun affected checks. Keep unrelated failures visible in the PR.

Traces and screenshots can contain page content; use synthetic data and do not commit generated reports. CI uploads the browser report and traces for seven days, including failed runs when the job is not cancelled.

## Report results precisely

Distinguish local checks, GitHub `Verify`, deployed smoke checks and external-service validation. State commands run, outcomes and blockers. A documentation-only change may be reviewed structurally without executing the app, but say so explicitly. Production deployment runs only in the separate main-branch job after verification.
