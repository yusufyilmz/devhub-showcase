# Pull request

## Problem and result

<!-- Explain the concrete problem and what users can do after this change. -->

## Linked tasks

<!-- Link each task. Describe its outcome separately when the PR handles multiple tasks. -->

- Task:
- Outcome:

## How to test each change

<!-- Repeat this section for each task or independently testable change. -->
<!-- Give exact routes, visible control names, fixture/account requirements and expected results. -->
<!-- Replace the example rows. Do not mark an instruction as tested until you run it. -->

**Task / change:**
**Environment / preview URL:**
**Account, fixture and configuration needed:**

| Step | Action                                                      | Expected result                             | Actual result / evidence |
| ---- | ----------------------------------------------------------- | ------------------------------------------- | ------------------------ |
| 1    | Open the affected route with the stated account or fixture. | Describe the initial state.                 | Not run                  |
| 2    | Perform the primary action using the visible control name.  | Describe the resulting UI and saved data.   | Not run                  |
| 3    | Reload, go back, or retry a failure as relevant.            | Describe preservation or recovery behavior. | Not run                  |
| 4    | Verify access and public/private behavior when relevant.    | Describe what an owner and visitor can see. | Not run                  |

## Section and visual checks

<!-- Complete for section/UI changes, or explain why not applicable. -->
<!-- Detailed walkthrough: docs/testing/manual-editor-checks.md#portfolio-sections -->

- Sections and renderers exercised:
- Content tested: populated, empty, long text, media/error states:
- Visibility and selected-item checks:
- Reorder / keyboard / touch checks:
- Preview sizes and portfolio layouts:
- Light/dark theme, accent, contrast and focus checks:
- Saved portfolio and independent PDF checks:
- Screenshots or traces:

## Automated verification

<!-- Record exact commands and outcomes. Mark skipped checks with a reason. -->
<!-- For docs-only work, state which Markdown checks ran and which runtime checks were not rerun. -->

| Command / check                                                            | Result  | Evidence or reason not run |
| -------------------------------------------------------------------------- | ------- | -------------------------- |
| `pnpm check`                                                               | Not run |                            |
| `pnpm test` or relevant focused unit tests                                 | Not run |                            |
| `pnpm --filter my-dev-studio build` when app behavior changes              | Not run |                            |
| `pnpm exec playwright test <affected specs>` when browser behavior changes | Not run |                            |

Browser CI runs only on pushes to `main` and is non-blocking. Distinguish local test results, PR CI and deployed verification; do not claim one from another.

## Configuration and remaining work

- New environment variables, migrations or setup required:
- Known limitations and unverified external services:
- Remaining checks after merge/deployment:
