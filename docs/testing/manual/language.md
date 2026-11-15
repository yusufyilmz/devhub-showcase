# Independent website and CV languages

**Scope/status:** Implemented; authored text is not automatically translated.

**Prerequisites:** Use fictional authored prose and two different language selections.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                                       | Expected result                                                                      | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Set Portfolio language and a different CV language in Language settings.                                     | Each choice is held independently in the draft.                                      | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Preview, save and reload; download the private saved CV.                                                     | Website labels and PDF labels use their own choices; authored facts stay as entered. | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner)      | `/test-owner`      | After separate publication, inspect website HTML language, dates and the public PDF Content-Language header. | The published outputs match their independent language settings.                     | Not run                  |

## Related evidence and detail

- [e2e/portfolio/languages.spec.ts](../../../apps/my-dev-studio/e2e/portfolio/languages.spec.ts)
- [e2e/edit/portfolio-types.spec.ts](../../../apps/my-dev-studio/e2e/edit/portfolio-types.spec.ts)

Return to the [manual testing index](index.md).
