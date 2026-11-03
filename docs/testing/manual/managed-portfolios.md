# Managed temporary portfolios and transfer

**Scope/status:** Implemented; administrator setup required.

**Prerequisites:** Use an authorized test manager, a different manager, a confirmed recipient and fictional import JSON.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                                      | Route path                     | Action                                                                                                                   | Expected result                                                                                        | Actual result / evidence |
| ---- | ------------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/admin/portfolios)            | `/admin/portfolios`            | Create a private portfolio from fictional validated JSON.                                                                | It starts private, belongs to the current manager and has a usable private download.                   | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/admin/portfolios/PROFILE_ID) | `/admin/portfolios/PROFILE_ID` | Edit/save, review publication and confirm it; then withdraw.                                                             | Saving, publication and withdrawal are separate; signed-out public access follows the published state. | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/admin/portfolios/PROFILE_ID) | `/admin/portfolios/PROFILE_ID` | Try transfer to an unverified/missing recipient, an edited existing recipient, and then an eligible confirmed recipient. | Invalid transfers fail without replacing content; an eligible transfer respects revision checks.       | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/admin/portfolios/PROFILE_ID) | `/admin/portfolios/PROFILE_ID` | After transfer, retry as the former manager; also try the other manager.                                                 | Former/other manager access to editing, private PDF, history and publication is denied.                | Not run                  |

## Related evidence and detail

- [e2e/admin/portfolios/managed-portfolios.spec.ts](../../../e2e/admin/portfolios/managed-portfolios.spec.ts)

Return to the [manual testing index](index.md).
