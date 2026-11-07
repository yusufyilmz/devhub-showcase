# Full-page visitor chat, access and published sources — task 21

**Scope/status:** Full-page public portfolio assistant. The legacy portfolio streams responses. The Pro visitor assistant requires an eligible, opted-in portfolio.

**Prerequisites:** Use a published, opted-in, Pro-assigned test portfolio with allowance and a configured AI provider. Keep one draft project and one private or password-protected test portfolio.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `other-owner` and `protected-owner` with disposable records. Use the matching deployment preview in place of `mydevstudio.vercel.app` before the feature ships.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                               | Route path              | Action                                                                                                                                              | Expected result                                                                                                            | Actual result / evidence |
| ---- | ----------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/yusufyilmz)           | `/yusufyilmz`           | Select **Portfolio assistant** near the bottom right. Repeat at desktop and phone widths.                                                           | The browser opens `/yusufyilmz/chat` with a centered welcome heading, composer and suggested questions.                    | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/yusufyilmz/chat)      | `/yusufyilmz/chat`      | Select **What projects are featured?**, then **Send message**. Follow a link under Published portfolio sources.                                     | The suggestion fills the composer, the answer streams, and the link returns to a published section of the same portfolio.  | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/yusufyilmz/chat)      | `/yusufyilmz/chat`      | Ask a question, reload the same tab, then choose **New chat**. On a phone, open **Workspace** first. Reload again and choose **Back to portfolio**. | The first reload restores the conversation. The second shows a fresh composer and the back link opens the portfolio.       | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner)           | `/test-owner`           | While signed out, select **Ask about** followed by the portfolio owner’s name.                                                                      | The Pro visitor assistant opens at `/test-owner/chat` with the same full-page layout.                                      | Not run                  |
| 5    | [Open](https://mydevstudio.vercel.app/test-owner/chat)      | `/test-owner/chat`      | Ask about a published project, then ask for a private project or another user’s unpublished edits.                                                  | The assistant answers from the current published portfolio. Private content and other accounts’ content stay inaccessible. | Not run                  |
| 6    | [Open](https://mydevstudio.vercel.app/other-owner/chat)     | `/other-owner/chat`     | Open a different eligible portfolio in the same tab. Then republish the first test portfolio and reopen its chat.                                   | The other portfolio and the new publication revision start with fresh conversations.                                       | Not run                  |
| 7    | [Open](https://mydevstudio.vercel.app/protected-owner/chat) | `/protected-owner/chat` | Open the chat URL directly while signed out. Repeat for an unpublished test portfolio.                                                              | The chat page returns a 404 in both cases.                                                                                 | Not run                  |
| 8    | [Open](https://mydevstudio.vercel.app/test-owner/chat)      | `/test-owner/chat`      | From a separate owner tab, disable visitor chat. Send a question from the previously opened visitor tab, then reload it.                            | The old tab shows a generic error and the reloaded route returns a 404.                                                    | Not run                  |
| 9    | [Open](https://mydevstudio.vercel.app/yusufyilmz)           | `/yusufyilmz`           | Select **Referral Chat**.                                                                                                                           | The referral dialog opens on the portfolio page.                                                                           | Not run                  |

## Related evidence and detail

- [e2e/portfolio/chat.spec.ts](../../../apps/my-dev-studio/e2e/portfolio/chat.spec.ts)
- [apps/my-dev-studio/app/api/chat/stream/route.test.ts](../../../apps/my-dev-studio/app/api/chat/stream/route.test.ts)

Return to the [manual testing index](index.md).
