# Studio editor header, sections and footer

**Scope/status:** Implemented for the studio editor. The grouped site footer is
shared with the MyDevStudio homepage.

**Prerequisites:** Use a disposable confirmed owner with a saved profile, or run
the local Playwright fixtures. Use the [shared setup and result rules](index.md#before-you-start).
Replace `test-owner` with the disposable account's username.

| Step | Clickable URL                                                         | Route path         | Action                                                                                                             | Expected result                                                                                                                                                               | Actual result / evidence                                                                                                   |
| ---- | --------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1    | [Edit your portfolio](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Load the editor at desktop and phone widths. Use the skip link and inspect the Workspace, Examples and Help links. | The studio header identifies the workspace. The editor title, save action and revision status fit at both widths.                                                             | Local Chromium verified layout at 1440px and 390px. Hosted review pending.                                                 |
| 2    | [Import Google](https://mydevstudio.vercel.app/test-owner/edit)       | `/test-owner/edit` | Select Import Google. Read the privacy information, change categories and check the consent label.                 | The heading, explanation, checkbox choices and permission controls are distinct. Reading profile data requires explicit consent.                                              | Desktop and mobile fixtures verified consent and applying details to an unsaved draft. Hosted review pending.              |
| 3    | [Studio footer](https://mydevstudio.vercel.app/test-owner/edit)       | `/test-owner/edit` | Scroll below Preview your draft and the draft action row. Follow Portfolio examples in the footer.                 | Draft actions appear before the site footer. The grouped Studio, Explore and Resources links reflow on mobile. Portfolio examples opens the homepage at the examples section. | Local Chromium verified link groups, the lower copyright line and the examples link at both widths. Hosted review pending. |
| 4    | [Homepage footer](https://mydevstudio.vercel.app/)                    | `/`                | Open the footer while signed out. Follow Sign in and use the browser Back button.                                  | The grouped footer shows the signed-out action. Sign in opens the login page.                                                                                                 | Local homepage checks verified that Sign in opens the login page. Hosted review pending.                                   |

## Related verification

- [Google import and consent fixture](../../../e2e/edit/google-import.spec.ts)
- [Editor save and recovery fixture](../../../e2e/edit/editor-workflow.spec.ts)
- [Homepage browser checks](../../../e2e/home/home.spec.ts)
- [Google import manual guide](google-import.md)

Return to the [manual testing index](index.md).
