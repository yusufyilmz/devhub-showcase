# Fullscreen Studio chat and provider failure/streaming behavior

**Scope/status:** Implemented UI; provider access is optional.

**Prerequisites:** Use a disposable entitled account and configured provider or fixtures; never use real private client content.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                     | Route path    | Action                                                                                          | Expected result                                                                                                                                 | Actual result / evidence |
| ---- | ------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/admin/chat) | `/admin/chat` | Open the fullscreen chat, enter a fictional edit request and send.                              | The conversation/composer fit desktop and phone widths; configured generation shows progress and incremental output where streaming is enabled. | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/admin/chat) | `/admin/chat` | Inspect the proposal and use Accept all proposed changes, then Apply selected changes to draft. | Nothing saves from generation/review alone; applying changes the local draft only.                                                              | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/admin/chat) | `/admin/chat` | Choose Save draft and follow the editor link.                                                   | Only an explicit private save occurs; publication remains a separate editor action.                                                             | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/admin/chat) | `/admin/chat` | Use fixtures for missing provider configuration, stream failure and denied access; retry.       | Errors are readable, pending UI settles and no partial change is silently saved; keys/raw provider payloads stay out of the UI.                 | Not run                  |

## Related evidence and detail

- [e2e/edit/studio-chat.spec.ts](../../../e2e/edit/studio-chat.spec.ts)
- [apps/my-dev-studio/app/api/chat/stream/route.test.ts](../../../apps/my-dev-studio/app/api/chat/stream/route.test.ts)

Return to the [manual testing index](index.md).
