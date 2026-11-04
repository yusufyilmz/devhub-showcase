# Homepage, composer and section browser

**Scope/status:** Implemented.

**Prerequisites:** Use the matching PR preview; sign out first.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                               | Route path          | Action                                                                                                                                                                                                 | Expected result                                                                                                                                                                                       | Actual result / evidence |
| ---- | ----------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/)                     | `/`                 | Reload the homepage and inspect the hero, examples, section library and images at desktop and phone widths.                                                                                            | Readable heading/description hierarchy, visible artwork and no horizontal overflow.                                                                                                                   | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/)                     | `/`                 | Enter a fictional request in the homepage composer and activate its send icon.                                                                                                                         | Opens the Studio chat flow; signed-out users follow the login flow rather than accessing private data.                                                                                                | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/#section-library)     | `/#section-library` | Inspect the initial section-library rows, then activate its reveal control.                                                                                                                            | The initial list stays collapsed until explicit activation; more items appear only when requested.                                                                                                    | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/)                     | `/`                 | Use the example/layout filters and previous/next controls.                                                                                                                                             | Filtering and navigation work without automatic carousel advancement.                                                                                                                                 | Not run                  |
| 5    | [Homepage preview](https://mydevstudio.vercel.app/#preview) | `/#preview`         | Inspect Portfolio/CV tabs and Preview your CV in light and dark mode. Change the global accent to emerald and try every preview accent. Hover/focus each control, then select CV and return with Home. | Both labels remain readable. Inactive tabs are neutral, selected tabs use the soft surface, and the filled preview button uses contrasting text. Clicking and keyboard navigation still switch views. | Not run                  |

## Related evidence and detail

- [e2e/home/home.spec.ts](../../../e2e/home/home.spec.ts)
- [e2e/examples/examples.spec.ts](../../../e2e/examples/examples.spec.ts)

Return to the [manual testing index](index.md).
