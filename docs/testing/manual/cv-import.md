# Consent and reviewed CV import

**Scope/status:** Optional configured integration.

**Prerequisites:** Use a disposable owner, fictional PDF/DOCX/text under 3 MB and the documented provider/Redis setup. Paid attempts may be consumed.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                        | Expected result                                                                                      | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Open Import CV and select a valid fictional file without consent.                             | Processing stays unavailable until the explicit provider consent is given.                           | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Process after consent; review/edit extracted fields and uncheck a replacement group.          | Provider results are inspectable and editable; unselected groups preserve existing content.          | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Cancel one review; process again and Apply reviewed details to draft.                         | Cancel changes nothing; apply changes only the draft and new projects remain private.                | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Try an unsupported/oversized file and a provider failure using fixtures; retry appropriately. | Readable errors, retained draft and no invented successful import; save/publication remain separate. | Not run                  |

## Related evidence and detail

- [e2e/edit/cv-import.spec.ts](../../../apps/my-dev-studio/e2e/edit/cv-import.spec.ts)
- [e2e/home/cv-import.spec.ts](../../../apps/my-dev-studio/e2e/home/cv-import.spec.ts)

Return to the [manual testing index](index.md).
