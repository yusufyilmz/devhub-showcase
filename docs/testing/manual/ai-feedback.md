# Portfolio feedback — task 20

**Scope/status:** Optional configured integration.

**Prerequisites:** Use sparse fictional content and an entitled test account or fixtures.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                 | Expected result                                                                                     | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Choose the feedback task and Generate proposal.                                        | A Portfolio feedback review explains relevant gaps or suggestions without inventing qualifications. | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Reject all proposed changes and follow an Edit summary or equivalent field action.     | Navigation reaches the intended field and leaves its content unchanged.                             | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Apply only a freshly reviewed valid change if desired; inspect save/publication state. | Review, apply, save and publish remain distinct actions.                                            | Not run                  |

## Related evidence and detail

- [e2e/edit/assistant-tools.spec.ts](../../../apps/my-dev-studio/e2e/edit/assistant-tools.spec.ts)

Return to the [manual testing index](index.md).
