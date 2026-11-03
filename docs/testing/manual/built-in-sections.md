# Built-in sections, item selection and order

**Scope/status:** Implemented.

**Prerequisites:** Use several fictional entries in every built-in collection.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                            | Route path           | Action                                                                               | Expected result                                                                                 | Actual result / evidence |
| ---- | -------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | Open Section display; change a built-in section's renderer and hide another section. | Only compatible renderers are selectable; the private preview reflects visibility.              | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | Select a subset of items, then select none and reset to defaults.                    | Subset, empty and default/all selections remain distinct; private projects never become public. | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | Reorder with pointer/touch, move buttons and keyboard; save and reload.              | Order persists and focus remains usable; no automatic publication occurs.                       | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/cv.pdf) | `/test-owner/cv.pdf` | After separate publication, compare the website and public CV settings.              | Website section order/selection does not silently redefine independent CV inclusion/layout.     | Not run                  |

## Related evidence and detail

- [e2e/portfolio/section-settings.spec.ts](../../../e2e/portfolio/section-settings.spec.ts)
- [e2e/portfolio/section-order.spec.ts](../../../e2e/portfolio/section-order.spec.ts)

Return to the [manual testing index](index.md).
