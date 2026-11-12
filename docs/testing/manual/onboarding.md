# Guided portfolio onboarding

## Scope and status

The five-stage setup runs in one modal. First-time owners and existing owners using
**Start from scratch** can use the same flow.

## Prerequisites

Use disposable owner accounts in the matching preview. Use local fixtures for CV
success, provider failures, and save retry. See the [shared setup and result rules](index.md#before-you-start).

| Step | Clickable URL                                                           | Route              | Action                                                                                                      | Expected result                                                                                                                                 | Manual result |
| ---- | ----------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1    | [New owner editor](https://mydevstudio.vercel.app/test-owner/edit)      | `/test-owner/edit` | Choose a work type and layout, then continue to CV import.                                                  | The wizard stays in one modal. CV import can be skipped. Google sign-in supplies the starter name when available.                               | Not run       |
| 2    | [New owner editor](https://mydevstudio.vercel.app/test-owner/edit)      | `/test-owner/edit` | Upload a disposable CV, review the extraction, and apply selected details. Repeat with a simulated failure. | Applied data appears in the relevant Details screens. A failed import leaves the draft intact and allows retry or skip.                         | Not run       |
| 3    | [New owner editor](https://mydevstudio.vercel.app/test-owner/edit)      | `/test-owner/edit` | Add a name and title. Continue to Work experience, skip to Projects, and go back.                           | Each section gets its own screen. Skipping preserves entries and the modal remains open on desktop and mobile.                                  | Not run       |
| 4    | [New owner editor](https://mydevstudio.vercel.app/test-owner/edit)      | `/test-owner/edit` | In Profile, choose **Help me write an introduction**.                                                       | The existing Studio AI form opens inside the modal with an editable prompt. Sending still requires the existing AI entitlement and user action. | Not run       |
| 5    | [New owner editor](https://mydevstudio.vercel.app/test-owner/edit)      | `/test-owner/edit` | Open **Review draft**, switch between Website and CV, edit a section, and click **Save private draft**.     | Review stays in the modal. A successful save opens the editor. The public site is unchanged until publication.                                  | Not run       |
| 6    | [Existing owner editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Make an unsaved edit, choose **Start from scratch**, and then **Cancel starting over**.                     | The previous draft returns without a save or publication request.                                                                               | Not run       |

- [Onboarding browser checks](../../../apps/my-dev-studio/e2e/edit/editor-workflow.spec.ts)
- [CV import browser checks](../../../apps/my-dev-studio/e2e/edit/cv-import.spec.ts)
