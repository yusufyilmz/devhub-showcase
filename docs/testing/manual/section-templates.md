# Private section templates and reviewed JSON import/export

**Scope/status:** Implemented; template storage must be migrated.

**Prerequisites:** Use fictional content and keep a separate original export.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                                                          | Expected result                                                                                                   | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | In Templates, name a preset and select Save section template; reload the library.                                               | The account-private template is retained independently of portfolio saving.                                       | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Export sections JSON with authored content unchecked, then explicitly include authored content/media/bindings and export again. | The configuration-only export excludes authored data; the explicit export includes the chosen content.            | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Review a saved preset or import valid section/PageForge JSON; inspect the review before Apply to draft.                         | Only the reviewed section changes enter the draft; no identity, ownership, username or publication change occurs. | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Try malformed JSON and a replacement import, then cancel before applying.                                                       | Validation/cancellation preserves the existing draft; confirmed imports use fresh identities.                     | Not run                  |

## Related evidence and detail

- [e2e/edit/section-library.spec.ts](../../../e2e/edit/section-library.spec.ts)

Return to the [manual testing index](index.md).
