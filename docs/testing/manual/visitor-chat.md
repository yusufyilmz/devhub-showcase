# Visitor chat isolation, streaming and source links — task 21

**Scope/status:** Optional configured integration.

**Prerequisites:** Use a published, opted-in, Pro-assigned test portfolio with allowance; also keep a private project/draft.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                     | Route path    | Action                                                                                                      | Expected result                                                                                                  | Actual result / evidence |
| ---- | ------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner) | `/test-owner` | Open the portfolio assistant signed out and ask about a published project.                                  | An answer uses permitted published content; source links fit the widget and resolve to relevant public sections. | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner) | `/test-owner` | Ask for a private project, another account's draft or unpublished edits.                                    | Private data is not supplied; no unrelated portfolio is used as fallback.                                        | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner) | `/test-owner` | Use another portfolio/session and then republish a changed revision.                                        | Conversation state stays scoped to the portfolio and revision.                                                   | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner) | `/test-owner` | Disable visitor chat or withdraw publication from the owner editor/billing screen and retry an old session. | Access is rechecked; new provider work is denied rather than relying on stale client permission.                 | Not run                  |

## Related evidence and detail

- [e2e/portfolio/chat.spec.ts](../../../e2e/portfolio/chat.spec.ts)
- [apps/my-dev-studio/app/api/chat/stream/route.test.ts](../../../apps/my-dev-studio/app/api/chat/stream/route.test.ts)

Return to the [manual testing index](index.md).
