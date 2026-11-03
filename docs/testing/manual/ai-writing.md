# Focused writing alternatives — task 18

**Scope/status:** Optional configured integration.

**Prerequisites:** Use a fictional summary and an entitled test account or provider fixtures.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                                           | Expected result                                                                                               | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Choose writing under What do you want help with, then choose Writing tone and Writing length. Generate proposal. | Alternatives match the selected task and remain proposals.                                                    | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Review alternatives and select only summary before Apply selected changes to draft.                              | The chosen existing field changes; no automatic save or publication occurs.                                   | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Undo the result and retry without allowance/configuration using fixtures.                                        | Draft recovery is clear; unavailable generation does not invent a successful result or bypass quota controls. | Not run                  |

## Related evidence and detail

- [e2e/edit/assistant-tools.spec.ts](../../../e2e/edit/assistant-tools.spec.ts)

Return to the [manual testing index](index.md).
