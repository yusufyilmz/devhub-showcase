# Guided onboarding — task 05

**Scope/status:** Implemented.

**Prerequisites:** Use a fresh disposable account with no completed setup.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                                                                        | Expected result                                                                                                                       | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Sign in as a new owner. Try Layout, Start, Details, and Review before clicking Next. Then click Next, click Next, and choose Use this layout. | The setup opens as a dialog. Later steps stay disabled until Next finishes the current one. Use this layout opens the details dialog. | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Enter a title/summary, choose a PDF layout, go back to layout selection and return.                                                           | Entered content and the independent PDF choice survive navigation.                                                                    | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Select Review draft and finish setup; then Save changes and reload.                                                                           | Finishing setup does not save by itself; explicit saving persists the private draft.                                                  | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner)      | `/test-owner`      | Visit from a signed-out browser before any Confirm publication action.                                                                        | The new portfolio remains private.                                                                                                    | Not run                  |

## Related evidence and detail

- [e2e/edit/editor-workflow.spec.ts](../../../apps/my-dev-studio/e2e/edit/editor-workflow.spec.ts)
- [docs/testing/manual-editor-checks.md](../../../docs/testing/manual-editor-checks.md)

Return to the [manual testing index](index.md).
