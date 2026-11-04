# Separate draft save, review, publish and withdraw — task 07

**Scope/status:** Implemented; publication snapshot migration required.

**Prerequisites:** Use a disposable migrated owner/manager and a signed-out browser.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                                                           | Expected result                                                                           | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Change name/content and Save changes. Compare the signed-out page and public CV.                                                 | Only the private saved draft advances; the previously published snapshots stay unchanged. | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Select Review publication and inspect both before/after snapshots; Confirm publication.                                          | The reviewed saved revision publishes atomically; dirty drafts cannot be published.       | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/api/publication) | `/api/publication` | In a disposable environment, submit a stale revision or forged profile/document through browser developer tools; try signed out. | Conflict/validation/authorization failure; no public snapshot is changed.                 | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Select Withdraw public website and CV, then revisit both public URLs signed out.                                                 | Both public outputs become unavailable; private saved work/downloads remain available.    | Not run                  |

## Related evidence and detail

- [e2e/edit/publication.spec.ts](../../../e2e/edit/publication.spec.ts)
- [docs/testing/publication-foundation.md](../../../docs/testing/publication-foundation.md)

Return to the [manual testing index](index.md).
