# Completion checklist — task 06

**Scope/status:** Implemented.

**Prerequisites:** Use a sparse disposable profile.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                             | Expected result                                                                       | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Expand Portfolio checklist and inspect incomplete items.           | Missing content is explained and each relevant item links to an editor control.       | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Follow an incomplete item and add the requested fictional content. | The intended tab/field opens and checklist progress updates from the draft.           | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Remove the content again, then save or discard.                    | Progress reflects the current draft; the checklist does not silently save or publish. | Not run                  |

## Related evidence and detail

- [e2e/edit/editor-guidance.spec.ts](../../../e2e/edit/editor-guidance.spec.ts)

Return to the [manual testing index](index.md).
