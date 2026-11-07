# Curated profession presets — task 12

**Scope/status:** Implemented.

**Prerequisites:** Use an owner with fictional content, hidden/private items and a custom section.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                                  | Expected result                                                                                         | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Open Layout and apply a different curated profession preset.                                            | Portfolio layout, section presentations and order change in the draft.                                  | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Inspect existing text, private projects, hidden sections, custom sections, theme and PDF settings.      | Authored facts and independent settings are retained; the preset does not copy fictional example facts. | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Open Preview your draft, then save, reload and review publication separately.                           | Composition matches the preset; saving persists it without automatically replacing the public version.  | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner)      | `/test-owner`      | After explicitly publishing on the disposable account, compare galleries, carousels, timelines or tabs. | The selected composition works publicly with the same permitted content.                                | Not run                  |

## Related evidence and detail

- [e2e/edit/portfolio-types.spec.ts](../../../apps/my-dev-studio/e2e/edit/portfolio-types.spec.ts)
- [docs/testing/portfolio-presentation.md](../../../docs/testing/portfolio-presentation.md)

Return to the [manual testing index](index.md).
