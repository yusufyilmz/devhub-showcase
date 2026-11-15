# AI change review, apply and undo — task 17

**Scope/status:** Optional configured integration.

**Prerequisites:** Use an assigned Pro test account with remaining allowance; use fixtures to avoid live provider costs.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                                            | Expected result                                                                               | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Open AI assistant and generate a bounded fictional edit.                                                          | A before/after proposal appears; no draft/server/public mutation occurs just from generation. | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Accept/reject individual fields, reject all once, then accept a fresh subset and Apply selected changes to draft. | Only explicitly accepted validated fields are applied; rejected fields remain unchanged.      | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Use Undo AI changes; then try an invalid or stale proposal through the fixture case.                              | Undo restores the prior draft; stale/malformed changes are refused safely.                    | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Apply a fresh proposal and Save changes; inspect the public URL before publication.                               | Saving remains private; only a separate reviewed publication changes public content.          | Not run                  |

## Related evidence and detail

- [e2e/edit/ai-editor.spec.ts](../../../apps/my-dev-studio/e2e/edit/ai-editor.spec.ts)
- [docs/testing/manual-editor-checks.md](../../../docs/testing/manual-editor-checks.md)

Return to the [manual testing index](index.md).
