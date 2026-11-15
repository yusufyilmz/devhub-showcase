# Private CV versions — task 25

**Scope/status:** Implemented; private-CV-library migration required.

**Prerequisites:** Use fictional content and configured private library storage. This library has no browser recovery after leaving the screen.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                                                      | Expected result                                                                                           | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Open CV versions and Create fresh version from profile; edit its title, contact flags, layout, language and item selection. | Only that private version changes; its download stays unavailable until saved.                            | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Save CV versions, duplicate one and change the copy.                                                                        | The original version and canonical portfolio retain their independent data.                               | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Reload, select each saved version and Download saved version.                                                               | The selected saved content, contact choices, layout, language and order match the download.               | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/api/cv-variants) | `/api/cv-variants` | Try signed-out access and the second disposable account; exercise a stale library save in two tabs.                         | Other accounts cannot read the library; conflicts keep local edits on screen and do not publish anything. | Not run                  |

## Related evidence and detail

- [e2e/edit/cv-versions.spec.ts](../../../apps/my-dev-studio/e2e/edit/cv-versions.spec.ts)
- [docs/testing/private-cv-versions.md](../../../docs/testing/private-cv-versions.md)

Return to the [manual testing index](index.md).
