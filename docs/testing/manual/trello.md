# Trello boards — manual testing

**Scope/status:** Optional Studio integration for platform administrators.

**Prerequisites:** A preview of this change, a confirmed administrator account, a confirmed non-administrator account, and a disposable Trello account or workspace. Set server-side `TRELLO_API_KEY` and `TRELLO_API_TOKEN` with read and write access. Set `TRELLO_WORKSPACE_ID` if testing a specific destination.

Use the [shared setup and result rules](index.md#before-you-start). Replace the local hostname with the matching preview when testing a deployed build.

**Manual result:** Live Trello verification pending.

| Step | Clickable URL                                            | Route path          | Action                                                    | Expected result                                          | Actual result / evidence |
| ---- | -------------------------------------------------------- | ------------------- | --------------------------------------------------------- | -------------------------------------------------------- | ------------------------ |
| 1    | [Board directory](http://localhost:3001/admin/trello)    | `/admin/trello`     | Open **Trello boards** from the administrator menu.       | Open boards or an empty state appear.                    | Not run                  |
| 2    | [Create a board](http://localhost:3001/admin/trello/new) | `/admin/trello/new` | Enter a whitespace-only name and select **Create board**. | The name error appears and focus returns to the field.   | Not run                  |
| 3    | [Create a board](http://localhost:3001/admin/trello/new) | `/admin/trello/new` | Enter a name, choose **Empty board**, and submit.         | Confirmation and **Open in Trello** appear.              | Not run                  |
| 4    | [Board directory](http://localhost:3001/admin/trello)    | `/admin/trello`     | Select **Back to boards**, refresh, and open the board.   | The board persists and is private with no starter lists. | Not run                  |
| 5    | [Create a board](http://localhost:3001/admin/trello/new) | `/admin/trello/new` | Open while signed out or as a non-administrator.          | The form and connected account data are hidden.          | Not run                  |

## Related evidence and detail

- [Server action tests](../../../apps/my-dev-studio/app/admin/trello/new/actions.test.ts)
- [Form interaction tests](../../../packages/trello/src/components/pages/TrelloBoardCreateForm.test.tsx)
- [Trello configuration](../../features.md#trello-boards)
