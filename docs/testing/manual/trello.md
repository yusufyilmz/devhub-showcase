# Trello boards — manual testing

**Scope/status:** Optional Studio integration for platform administrators.

**Prerequisites:** A preview of this change, a confirmed administrator account, a confirmed non-administrator account, and a disposable Trello account or workspace. Set server-side `TRELLO_API_KEY` and `TRELLO_API_TOKEN` with read and write access. Set `TRELLO_WORKSPACE_ID` if testing a specific destination.

Use the [shared setup and result rules](index.md#before-you-start). Replace the local hostname with the matching preview when testing a deployed build.

**Manual result:** Live Trello verification pending.

| Step | Clickable URL                                             | Route path           | Action                                                    | Expected result                                          | Actual result / evidence |
| ---- | --------------------------------------------------------- | -------------------- | --------------------------------------------------------- | -------------------------------------------------------- | ------------------------ |
| 1    | [Board directory](http://localhost:3001/studio/trello)    | `/studio/trello`     | Open **Trello boards** from the administrator menu.       | Open boards or an empty state appear.                    | Not run                  |
| 2    | [Create a board](http://localhost:3001/studio/trello/new) | `/studio/trello/new` | Enter a whitespace-only name and select **Create board**. | The name error appears and focus returns to the field.   | Not run                  |
| 3    | [Create a board](http://localhost:3001/studio/trello/new) | `/studio/trello/new` | Enter a name, choose **Empty board**, and submit.         | Confirmation and **Open in Trello** appear.              | Not run                  |
| 4    | [Board directory](http://localhost:3001/studio/trello)    | `/studio/trello`     | Select **Back to boards**, refresh, and open the board.   | The board persists and is private with no starter lists. | Not run                  |
| 5    | [Create a board](http://localhost:3001/studio/trello/new) | `/studio/trello/new` | Open while signed out or as a non-administrator.          | The form and connected account data are hidden.          | Not run                  |

## Working on a board in Studio

Use a disposable board for these checks. Card and board deletion are permanent. Start in the [board directory](http://localhost:3001/studio/trello) and select **Open board**. The workspace opens at `/studio/trello/boards/<boardId>`.

- Choose **Edit board**, update its name and description, then reload and verify both values.
- Add two lists. Add a card to the first list, open it by its name, and update its description.
- Drag the card onto the second list and reload. Add another card and drag it onto the first card to reorder them. Use **Move to list** inside the card to move it with the keyboard.
- Open the card, post a comment, and reopen to verify that the comment persists.
- Try **Delete card** and dismiss the confirmation. Verify the card remains, then confirm deletion. Repeat with **Delete board** and verify the directory no longer shows that board.

## Related evidence and detail

- [Server action tests](../../../apps/my-dev-studio/app/studio/trello/new/actions.test.ts)
- [Form interaction tests](../../../packages/trello/src/components/pages/TrelloBoardCreateForm.test.tsx)
- [Trello configuration](../../features.md#trello-boards)

- At [Trello boards](http://localhost:3001/studio/trello) (`/studio/trello`), inspect the compact board tiles, then choose **Open board**. Expect a distinct visibility badge and a horizontally scrollable board with list counts and compact cards. Verify light and dark themes. Manual verification pending.
