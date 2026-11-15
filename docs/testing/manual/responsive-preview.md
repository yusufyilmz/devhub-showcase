# Private responsive preview — task 11

**Scope/status:** Implemented.

**Prerequisites:** Use a profile with public/private projects, hidden sections and long text.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                  | Expected result                                                                                              | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Expand Preview your draft and choose Mobile, Tablet and Desktop.        | The preview uses the requested 375/768/1280px canvas; wide canvases scroll inside the editor.                | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Change a title, layout, order and website field choices without saving. | The real renderers show the current permitted draft content; hidden sections/private projects stay excluded. | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Try external links, downloads and forms inside the preview.             | External actions are disabled; previewing does not save, publish or expose a draft URL.                      | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Close and reopen the preview; check it from another account's session.  | The current draft returns locally; unauthorized users cannot access the owner editor/preview.                | Not run                  |

## Related evidence and detail

- [e2e/edit/responsive-preview.spec.ts](../../../apps/my-dev-studio/e2e/edit/responsive-preview.spec.ts)

Return to the [manual testing index](index.md).
