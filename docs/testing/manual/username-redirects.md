# Retained username redirects — task 14

**Scope/status:** Implemented checkpoint in draft PR #86.

**Prerequisites:** Apply the alias migration in a disposable environment; use two accounts. Historical names before the migration are not reconstructed.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                           | Route path          | Action                                                                                                    | Expected result                                                                                             | Actual result / evidence |
| ---- | ------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit)  | `/test-owner/edit`  | Save a changed username without publishing, then review and publish it.                                   | The old public URL stays live until publication; afterward it becomes a retained alias.                     | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/old-owner)        | `/old-owner`        | Rename/publish a second time; visit every previous published username.                                    | Each resolves directly to the current canonical username, without server-side alias chains.                 | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/old-owner/cv.pdf) | `/old-owner/cv.pdf` | Request old CV, icon.svg and share.png resource paths without following redirects.                        | Redirects preserve each suffix; the old CV redirects directly to the current CV with no-store.              | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/other-owner/edit) | `/other-owner/edit` | Try claiming an active/retained/reserved name from another account; then withdraw the original portfolio. | Claims fail; withdrawn aliases expose no destination while names stay reserved to their original portfolio. | Not run                  |

## Related evidence and detail

- [e2e/edit/publication.spec.ts](../../../e2e/edit/publication.spec.ts)
- [docs/testing/publishing-policies.md](../../../docs/testing/publishing-policies.md)

Return to the [manual testing index](index.md).
