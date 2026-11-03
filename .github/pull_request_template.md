# Pull request

## Problem and result

<!-- Explain the concrete problem and what users can do after this change. -->

## Linked tasks

<!-- Link each task. Describe its outcome separately when the PR handles multiple tasks. -->

- Task:
- Outcome:

## How to test each change

<!-- Repeat this section for each task or independently testable change. -->
<!-- Required: update docs/testing/manual/index.md and the dedicated feature guide using docs/testing/manual/template.md. Keep incomplete features and unexecuted steps explicit. -->
<!-- Every step must include a clickable full URL and its route path. Replace PREVIEW-HOST with the actual deployment hostname; do not invent routes for tabs. -->
<!-- Give exact routes, visible control names, fixture/account requirements and expected results. -->
<!-- Replace the example rows. Do not mark an instruction as tested until you run it. -->

**Task / change:**
**Manual guide and index entry:** <!-- Link docs/testing/manual/<feature>.md and its index row; required for each feature. -->
**Environment / preview URL:**
**Clickable entry URL:**
**Route path (for example `/test-owner/edit`):**
**Account, fixture and configuration needed:**

| Step | Clickable URL                                       | Route path         | Action                                                      | Expected result                             | Actual result / evidence |
| ---- | --------------------------------------------------- | ------------------ | ----------------------------------------------------------- | ------------------------------------------- | ------------------------ |
| 1    | [Open screen](https://PREVIEW-HOST/test-owner/edit) | `/test-owner/edit` | Open the affected route with the stated account or fixture. | Describe the initial state.                 | Not run                  |
| 2    | [Open screen](https://PREVIEW-HOST/test-owner/edit) | `/test-owner/edit` | Perform the primary action using the visible control name.  | Describe the resulting UI and saved data.   | Not run                  |
| 3    | [Open screen](https://PREVIEW-HOST/test-owner/edit) | `/test-owner/edit` | Reload, go back, or retry a failure as relevant.            | Describe preservation or recovery behavior. | Not run                  |
| 4    | [Open screen](https://PREVIEW-HOST/test-owner/edit) | `/test-owner/edit` | Verify access and public/private behavior when relevant.    | Describe what an owner and visitor can see. | Not run                  |

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
