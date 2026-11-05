# Reviewed job-specific CV drafts — task 26

**Scope/status:** Local keyword matching and optional AI interview preparation. Generating interview prep uses one Pro Studio Assistant attempt.

**Prerequisites:** Create a private source CV with fictional experience/projects first. For interview prep, use a disposable Pro owner with a configured preview provider and available Studio Assistant allowance.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                                  | Route path         | Action                                                                                       | Expected result                                                                                                   | Actual result / evidence                                        |
| ---- | -------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit)         | `/test-owner/edit` | Within CV versions, paste a job description and select Review matching evidence.             | Transparent matches reference existing evidence; nothing is selected automatically.                               | Not run                                                         |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit)         | `/test-owner/edit` | Select a subset and choose Create reviewed job version.                                      | A separate version contains only selected existing evidence; no qualifications are invented.                      | Not run                                                         |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit)         | `/test-owner/edit` | Try an unrelated description or instructions to publish/access another account.              | No unsupported facts, publication or cross-account access occurs.                                                 | Not run                                                         |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit)         | `/test-owner/edit` | Save versions and compare the source version, website and public CV.                         | The source and public outputs remain unchanged; matching words are not presented as proof of suitability.         | Not run                                                         |
| 5    | [Owner editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | In CV versions, select up to ten matching evidence items and click **Draft interview prep**. | A private brief, gaps, and practice questions appear. Generating the brief does not save, publish or modify a CV. | Local route fixture. Hosted verification pending.               |
| 6    | [Owner editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Try interview prep with a test account whose allowance is exhausted.                         | The brief is unavailable and local CV matching still works.                                                       | Local allowance rejection fixture. Hosted verification pending. |

## Related evidence and detail

- [e2e/edit/cv-versions.spec.ts](../../../e2e/edit/cv-versions.spec.ts)
- [docs/testing/private-cv-versions.md](../../../docs/testing/private-cv-versions.md)

Return to the [manual testing index](index.md).
