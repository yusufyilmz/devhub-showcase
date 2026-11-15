# Optional Google profile import

**Scope/status:** Optional configured integration.

**Prerequisites:** Use a disposable confirmed account and configured Google People/OAuth test consent.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                 | Expected result                                                                                             | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Open Import Google and choose profile categories.                      | Category consent is separate from sign-in; birthdate is off by default and mail/contacts are not requested. | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Grant selected test permissions and review the returned values.        | Only requested available categories appear; absent fields are not fabricated.                               | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Cancel, then retry and apply selected reviewed fields to the draft.    | Cancel leaves data unchanged; apply does not save/publish or change the login account.                      | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Deny consent or remove a returned category using the fixture scenario. | Failure is readable and the original draft remains intact.                                                  | Not run                  |

## Related evidence and detail

- [e2e/edit/google-import.spec.ts](../../../apps/my-dev-studio/e2e/edit/google-import.spec.ts)

Return to the [manual testing index](index.md).
