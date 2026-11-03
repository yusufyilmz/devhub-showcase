# Feature name — manual testing

**Scope/status:** Implemented / optional configured integration / partial checkpoint.

**Prerequisites:** Matching preview/commit, disposable account roles, fictional fixtures, migration and service configuration. Specify any operation that consumes a test allowance.

Use [shared setup and result rules](index.md#before-you-start). Replace the hostname/account placeholders. Tabs use their parent page route.

**Manual result:** Not run. Record preview URL, commit/PR, tester/date, role and safe evidence when executing.

| Step | Clickable URL                                                  | Route path         | Action                                                                      | Expected result                             | Actual result / evidence |
| ---- | -------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------- | ------------------------------------------- | ------------------------ |
| 1    | [Open feature](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Replace with the exact control and primary action.                          | State the observable result.                | Not run                  |
| 2    | [Open feature](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Reload or revisit the feature.                                              | State what persists and what stays private. | Not run                  |
| 3    | [Open feature](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Exercise a safe failure/retry/conflict or unauthorized role where relevant. | State the safe result and recovery action.  | Not run                  |

## Related evidence and detail

Link the relevant source, automated suite and setup document using actual repository paths. Describe any remaining integration or deployment verification. Add this guide to the [manual testing index](index.md) and link it from the PR.
