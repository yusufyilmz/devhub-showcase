# Independent website/CV fields — task 28

**Scope/status:** Implemented; publication migration required for public payload checks.

**Prerequisites:** Use distinct fictional email/phone values and a private project; review repeated contact text separately.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                            | Route path           | Action                                                                                                      | Expected result                                                                                                     | Actual result / evidence |
| ---- | -------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | In Field visibility, exclude website email while leaving CV email enabled; exclude CV phone.                | Choices stay independent and the older PDF contact toggles agree with CV settings.                                  | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | Inspect the private website preview, save, and compare public output before publication.                    | Preview uses website exclusions; private saving does not change the existing public snapshot.                       | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner)        | `/test-owner`        | After explicit publication, inspect rendered content, metadata and page data using browser developer tools. | Excluded structured website fields and private/hidden records are absent, not merely visually hidden.               | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/cv.pdf) | `/test-owner/cv.pdf` | Download the published CV, then change one private CV version's contact choices.                            | The public CV uses its own published field settings; editing one private version does not change it or the website. | Not run                  |

## Related evidence and detail

- [e2e/edit/revision-history.spec.ts](../../../e2e/edit/revision-history.spec.ts)
- [e2e/edit/publication.spec.ts](../../../e2e/edit/publication.spec.ts)

Return to the [manual testing index](index.md).
