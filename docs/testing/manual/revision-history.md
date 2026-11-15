# Private saved revision history — task 10

**Scope/status:** Implemented; history migration required.

**Prerequisites:** Use an owner/manager with several saved fictional revisions, plus another account.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                                                                          | Route path                                       | Action                                                                                                                | Expected result                                                                                                          | Actual result / evidence                                                                               |
| ---- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit)                                                 | `/test-owner/edit`                               | Open Revision history, choose a listed revision and Inspect revision.                                                 | Timestamp and before/after data are reviewable; inspection does not mutate the draft.                                    | Not run                                                                                                |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit)                                                 | `/test-owner/edit`                               | Change the draft or saved revision after inspection, then try restoring the earlier review.                           | Stale restoration is blocked until inspection is repeated.                                                               | Not run                                                                                                |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit)                                                 | `/test-owner/edit`                               | Inspect again and Restore reviewed revision to draft.                                                                 | Earlier work enters the local draft only; there is no save or publication request.                                       | Not run                                                                                                |
| 4    | [Open](https://mydevstudio.vercel.app/api/profile-history?revision=1)                                  | `/api/profile-history?revision=1`                | Try signed-out/other-account reads and missing, expired or incompatible entries in a disposable migrated environment. | Workspace scoping is enforced; unusable revisions fail safely. At most 20 entries are readable within the 90-day window. | Not run                                                                                                |
| 5    | [Open the Revision history story](http://localhost:6006/?path=/story/studio-revision-history--default) | `/?path=/story/studio-revision-history--default` | Compare Saved revision history with its description at desktop and phone widths, then toggle light and dark mode.     | The title is larger and bolder than the body text and inherits the active theme colors.                                  | Local Chromium: 32px desktop and 24px mobile heading, 16px body. White palette verified in both modes. |

## Related evidence and detail

- [e2e/edit/revision-history.spec.ts](../../../apps/my-dev-studio/e2e/edit/revision-history.spec.ts)
- [docs/testing/publication-foundation.md](../../../docs/testing/publication-foundation.md)

Return to the [manual testing index](index.md).
