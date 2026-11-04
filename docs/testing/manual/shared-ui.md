# Shared controls, Card types and section primitives

**Scope/status:** Implemented; local Storybook required.

**Prerequisites:** Run pnpm --filter storybook-app storybook; use fictional Storybook content.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                                             | Route path                                     | Action                                                                                                     | Expected result                                                                                                                               | Actual result / evidence |
| ---- | ------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](http://localhost:6006/?path=/story/ui-components-card--default)    | `/?path=/story/ui-components-card--default`    | Inspect the default Card and its heading, description and action in light/dark modes.                      | Default behavior stays usable; typography, hover and focus contrast remain distinct.                                                          | Not run                  |
| 2    | [Open](http://localhost:6006/?path=/story/ui-components-card--card-types) | `/?path=/story/ui-components-card--card-types` | Exercise reveal, variants, appearance, content, hover, tilt and animated cards using pointer and keyboard. | The selected type renders its intended interaction; revealing a button does not hide its text on hover.                                       | Not run                  |
| 3    | [Open](http://localhost:6006/)                                            | `/`                                            | Use Storybook search to open section accordion, carousel, grid and tabs examples.                          | Shared Card/Section wrappers preserve details, list and tab semantics; carousel navigation and keyboard tabs work.                            | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit)                    | `/test-owner/edit`                             | Inspect buttons, inputs, selects, tabs and cards, including after a client navigation and reload.          | Styles load with the components; there are no missing-control styles, cycle errors, unreadable disabled states or unexplained nested padding. | Not run                  |

## Related evidence and detail

- [packages/ui/src/cards/Card.stories.tsx](../../../packages/ui/src/cards/Card.stories.tsx)
- [e2e/portfolio/section-library.spec.ts](../../../e2e/portfolio/section-library.spec.ts)

Return to the [manual testing index](index.md).
