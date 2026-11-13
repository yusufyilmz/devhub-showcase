# Portfolio editor workspace — manual testing

**Scope/status:** Local implementation keeps the “Edit your portfolio” studio heading.
The default view is the private preview. Edit and section navigation open the selected form inline.
Phone screens default to the Mobile preview and other screens to Desktop. Production
deployment is not verified.

**Prerequisites:** Run the local fixture server and application using the Playwright
configuration. Use the disposable desktop/mobile preview-owner and workspace-owner accounts; never use a
production account for failure or conflict checks. Desktop width: 1440px; mobile: 390px;
tablet: 1024px. See [shared setup and result rules](index.md#before-you-start).

**Inline editor verification:** `pnpm check`, 695 unit tests, the MyDevStudio
production build, and six desktop and mobile Chromium tests passed. Browser checks
used local fixtures and covered compact sidebar navigation, mobile section selection,
draft retention, save retry, and guided setup recovery. The manual walkthrough is pending.

**Previous lightbox integration verification — 7 November 2026:** Production build, `pnpm check`
and all 632 unit tests passed, plus 28 focused component tests. The broad editor and
managed-portfolio browser run passed 36 cases and skipped the existing duplicate mobile
review test. Six stale-selector/storage-key failures passed after test updates; the mobile
Google onboarding click still times out because layout content intercepts it. Device defaults, focus, draft retention,
private saves, failure/retry, layouts and managed editing are covered with local fixtures.
No deployment or live provider verification is claimed.

| Step | Clickable URL                                                      | Route path                    | Action                                                                                 | Expected result                                                                                                                                        | Actual result / evidence |
| ---- | ------------------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| 1    | [Desktop editor](http://localhost:3100/desktop-preview-owner/edit) | `/desktop-preview-owner/edit` | At 1440px, click Collapse sidebar, select Publishing, and click Expand sidebar.        | The sidebar fills the left column beside the heading. Compact buttons use icons with tooltips. Publishing opens in the main workspace.                 | Not run                  |
| 2    | [Desktop editor](http://localhost:3100/desktop-preview-owner/edit) | `/desktop-preview-owner/edit` | Change Professional title; select Experience, expand an entry, then return to Profile. | Draft values remain; only the selected collection entry is expanded. No save or publish occurs from navigation.                                        | Not run                  |
| 3    | [Mobile editor](http://localhost:3100/mobile-preview-owner/edit)   | `/mobile-preview-owner/edit`  | At 390px select an Editor section; use Back to preview, then Edit.                     | The picker includes grouped sections. The form and save actions fit the page. Back to preview displays the unsaved draft.                              | Not run                  |
| 4    | [Desktop editor](http://localhost:3100/desktop-preview-owner/edit) | `/desktop-preview-owner/edit` | Select CV in the preview; change website/CV field visibility independently.            | CV content uses CV-specific visibility; private projects and birthdate are excluded. Saved PDF download is clearly distinguished from unsaved content. | Not run                  |
| 5    | [Desktop editor](http://localhost:3100/desktop-preview-owner/edit) | `/desktop-preview-owner/edit` | Choose Review & publish with an unsaved draft.                                         | Publishing opens; Review publication stays disabled until Save changes succeeds. Saving alone does not publish.                                        | Not run                  |
| 6    | [Desktop editor](http://localhost:3100/desktop-preview-owner/edit) | `/desktop-preview-owner/edit` | Simulate one failed PUT; Save changes, retry, then reload.                             | Failure retains edited fields. Retry persists the draft; reload shows the saved value.                                                                 | Not run                  |
| 7    | [Desktop editor](http://localhost:3100/desktop-preview-owner/edit) | `/desktop-preview-owner/edit` | Open Draft tools; test checklist, undo/redo; reload unsaved work.                      | Controls remain available; actionable recovery notice appears above the workspace; stale revisions still block saving.                                 | Not run                  |
| 8    | [Public portfolio](http://localhost:3100/desktop-preview-owner)    | `/desktop-preview-owner`      | Visit while signed out, then open the owner editor using another disposable account.   | Private public page stays unavailable; unauthorized owner edits stay blocked.                                                                          | Not run                  |

## Previous device preview and lightbox checks

| Step | Clickable URL                                                      | Route path                    | Action                                                                                     | Expected result                                                                                                                                       | Actual result / evidence                               |
| ---- | ------------------------------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 9    | [Desktop editor](http://localhost:3100/desktop-preview-owner/edit) | `/desktop-preview-owner/edit` | Open on desktop without touching the size controls.                                        | Preview is visible; Desktop · 1280px is selected; edit fields are inside a closed lightbox.                                                           | Passed in local automated checks; screenshots reviewed |
| 10   | [Mobile editor](http://localhost:3100/mobile-preview-owner/edit)   | `/mobile-preview-owner/edit`  | Open on a phone without touching the size controls.                                        | Preview is visible and Mobile · 375px is selected.                                                                                                    | Passed in local automated checks; screenshots reviewed |
| 11   | [Desktop editor](http://localhost:3100/desktop-preview-owner/edit) | `/desktop-preview-owner/edit` | Click Edit, change Professional title, close with Escape, then reopen Edit.                | Lightbox traps keyboard focus; closing returns focus to Edit; preview updates; unsaved text survives closing and reopening.                           | Passed in local automated checks; screenshots reviewed |
| 12   | [Mobile editor](http://localhost:3100/mobile-preview-owner/edit)   | `/mobile-preview-owner/edit`  | Edit, use the section picker, then Save changes; simulate one failed request before retry. | Form remains scrollable; footer actions stay available. Save uses the existing form. A failure retains values and a successful retry saves privately. | Passed in local automated checks; screenshots reviewed |
| 13   | [Desktop editor](http://localhost:3100/desktop-preview-owner/edit) | `/desktop-preview-owner/edit` | Choose Tablet manually; open and close Edit or resize the browser.                         | The explicitly selected preview size is retained.                                                                                                     | Passed in local automated checks; screenshots reviewed |

## Related evidence and detail

- [Figma design](https://www.figma.com/design/kUZPyqUNjpMnUpwFATHp45?node-id=3-223).
- [Workspace and CV projection tests](../../../packages/assistant/src/components/portfolio/editor-workspace/editor-workspace.test.tsx).
- [Collection editor tests](../../../packages/assistant/src/components/editors/collection-editor/collection-editor.test.tsx).
- [Preview isolation tests](../../../packages/assistant/src/components/portfolio/portfolio-preview/ResponsivePortfolioPreview.test.tsx).
- [Editor browser checks](../../../apps/my-dev-studio/e2e/edit/editor-workspace.spec.ts).
- [Existing recovery guide](draft-recovery.md) and [publication guide](publication.md).

The CV panel previews content and visibility. PDF layout and pagination continue to use the
existing saved-CV download. No publication, ownership or database rules change in this feature.
