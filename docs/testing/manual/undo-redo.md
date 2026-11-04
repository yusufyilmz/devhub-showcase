# Draft undo/redo and reorder focus — task 09

**Scope/status:** Implemented.

**Prerequisites:** Use populated fictional collections; try keyboard and touch.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                          | Expected result                                                                                          | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Edit a field and reorder an experience or section; use Undo draft change and Redo draft change. | Draft values/order move backward and forward without server writes.                                      | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Use a move button, then immediately use the next keyboard action.                               | Delayed focus restoration does not steal focus from the chosen action.                                   | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Save or discard and inspect history controls.                                                   | The intended saved state is retained; session-history behavior is clear and does not change publication. | Not run                  |

## Related evidence and detail

- [e2e/edit/editor-guidance.spec.ts](../../../e2e/edit/editor-guidance.spec.ts)
- [e2e/edit/responsive-preview.spec.ts](../../../e2e/edit/responsive-preview.spec.ts)

Return to the [manual testing index](index.md).
