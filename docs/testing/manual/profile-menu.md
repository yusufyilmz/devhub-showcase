# Profile menu manual testing

**Scope/status:** Signed-in account navigation in the MyDevStudio header.

**Prerequisites:** Use a local or preview deployment, a confirmed owner account, and a separate portfolio administrator account. Configure the LinkedIn email relay only if testing that menu link.

| Step | Clickable URL                                        | Route path    | Action                                                                                               | Expected result                                                                                        | Actual result / evidence |
| ---- | ---------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------ |
| 1    | [Home](http://localhost:3100/)                       | `/`           | Open as a guest, then sign in and return to Home.                                                    | **Profile menu** appears beside **Appearance controls** after sign-in.                                 | Not run                  |
| 2    | [Home](http://localhost:3100/)                       | `/`           | Open **Profile menu** with Enter and choose **Job settings**. Reopen it and choose **Applications**. | Each destination opens the matching Job Hunter tab.                                                    | Not run                  |
| 3    | [Job Hunter](http://localhost:3100/admin/jobs)       | `/admin/jobs` | Open the menu as an owner, then repeat as a portfolio administrator.                                 | Both accounts see profile, jobs, and billing links. The administrator also sees **Manage portfolios**. | Not run                  |
| 4    | [Studio assistant](http://localhost:3100/admin/chat) | `/admin/chat` | Open **Profile menu**, choose **Sign out**, and confirm.                                             | The session ends and the login page opens.                                                             | Not run                  |

[Browser test coverage](../../../apps/my-dev-studio/e2e/admin/jobs/job-hunter.spec.ts)

## Editor layout checks

| Step | Clickable URL                                                          | Route path                      | Action                                                                                                                                                      | Expected result                                                                                           | Actual result / evidence                     |
| ---- | ---------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 5    | [Portfolio editor](http://localhost:3100/desktop-workspace-owner/edit) | `/desktop-workspace-owner/edit` | In dark mode, open Experience, Projects, Education, Skills, Languages, Sections, Section display, Templates, PDF and CV versions. Repeat at a narrow width. | Rows and panels have readable padding and stay inside the workspace. PDF select values are fully visible. | Passed in desktop and mobile Chrome fixtures |
| 6    | [Portfolio editor](http://localhost:3100/desktop-workspace-owner/edit) | `/desktop-workspace-owner/edit` | Choose **Desktop · 1280px** in the draft preview, then narrow the browser.                                                                                  | The preview fits the workspace and still renders at the chosen layout width.                              | Passed in desktop and mobile Chrome fixtures |
