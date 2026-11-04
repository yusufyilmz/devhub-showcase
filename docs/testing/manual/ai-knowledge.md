# Saved private and published public AI knowledge

**Scope/status:** Implemented; inspection makes no model call.

**Prerequisites:** Use different private draft and published titles plus a private project.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                                  | Route path                 | Action                                                                             | Expected result                                                                                                                | Actual result / evidence |
| ---- | -------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit)         | `/test-owner/edit`         | Open AI profile and inspect public knowledge.                                      | It uses the last published permitted snapshot, not later private saved edits.                                                  | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit)         | `/test-owner/edit`         | Select Show private owner knowledge.                                               | The authorized inspector shows the saved private document; it is not exposed to visitors.                                      | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/api/profile?knowledge=1) | `/api/profile?knowledge=1` | Open this endpoint signed in, then signed out and from another disposable account. | Only the session workspace is returned; signed-out reads fail and a forged profileId cannot select another account.            | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit)         | `/test-owner/edit`         | Save a new private title and reload the AI inspector before publishing.            | Private knowledge advances; public knowledge remains at its published revision or remains unavailable for a private portfolio. | Not run                  |

## Related evidence and detail

- [e2e/edit/ai-foundation.spec.ts](../../../e2e/edit/ai-foundation.spec.ts)
- [apps/my-dev-studio/app/api/profile/route.test.ts](../../../apps/my-dev-studio/app/api/profile/route.test.ts)

Return to the [manual testing index](index.md).
