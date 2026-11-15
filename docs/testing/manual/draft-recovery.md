# Browser recovery, failed save and conflicts — task 08

**Scope/status:** Implemented for the main editor.

**Prerequisites:** Use two tabs in one disposable account. Recovery is local to this browser/session.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                                                | Expected result                                                                       | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Edit without saving; wait for Recovery saved in this tab, reload and inspect Review recovered work.                   | The latest local draft is offered for review; no server save or publication occurred. | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Choose Restore recovered draft, then simulate a failed save using the fixture test. Retry after clearing the failure. | Draft content survives the failure and can be saved explicitly.                       | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Save a newer revision in the second tab, then try saving the first tab's stale draft.                                 | A conflict is shown instead of overwriting the newer save.                            | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Compare/reconcile recovered work with the newer saved revision before retrying.                                       | The UI does not silently replace newer work; public content remains unchanged.        | Not run                  |

## Related evidence and detail

- [e2e/edit/editor-workflow.spec.ts](../../../apps/my-dev-studio/e2e/edit/editor-workflow.spec.ts)
- [docs/testing/manual-editor-checks.md](../../../docs/testing/manual-editor-checks.md)

Return to the [manual testing index](index.md).
