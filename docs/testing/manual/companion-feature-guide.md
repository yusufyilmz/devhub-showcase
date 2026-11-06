# Companion feature guide and progress

**Scope and status.** MyDevStudio and My Fitness Studio show grouped product
guides beside their companions. Signed-in progress is stored separately for
each account. The companion offers a first tip after 18 seconds and waits at
least 75 seconds between tips. Tips pause in hidden tabs, in the guide, and
while a real notice takes priority. The same tip is shown at most once per
browser per day. Visitors can browse their portfolio guide without account
progress.

**Prerequisites.** Run the local apps with disposable accounts. Apply
`20261106093700_companion_features.sql` to the disposable database or use
Storybook’s simulated progress. The migration seeds 34 Studio and 24 Fitness
features.

| Step | Clickable URL                                                                                         | Route path                                                        | Action                                                                                                                    | Expected result                                                                                  | Actual result or evidence                                                                                                                                         |
| ---- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | [Studio guide](http://127.0.0.1:6006/?path=/story/ui-display-agent-companion--studio-feature-guide)   | `/?path=/story/ui-display-agent-companion--studio-feature-guide`  | Wait 18 seconds, then open Feature guide. Expand the browser width or scroll the guide.                                   | An introduction suggestion appears first. The guide lists all Studio features in groups.         | Passed in Chromium with the test clock and the full 34-feature guide.                                                                                             |
| 2    | [Fitness guide](http://127.0.0.1:6006/?path=/story/ui-display-agent-companion--fitness-feature-guide) | `/?path=/story/ui-display-agent-companion--fitness-feature-guide` | Mark a feature as used. Reopen the guide and turn off automatic tips.                                                     | Progress updates and the completion stays checked. Automatic tips stop while the setting is off. | Passed with 24 entries, a simulated completion, and an opt-out that survived reload.                                                                              |
| 3    | [Studio owner draft](http://localhost:3100/desktop-ai-owner/edit)                                     | `/desktop-ai-owner/edit`                                          | Clear Short introduction in the private fixture draft. Click Draft with Studio when the companion offers help.            | The AI assistant composer opens with an editable prompt. Only the user's Send action submits it. | Passed with a signed-in fixture and all 34 features marked used. Opening the prompt sent no model request.                                                        |
| 4    | [Studio progress endpoint](http://localhost:3100/api/companion-progress)                              | `/api/companion-progress`                                         | Mark a Studio feature as used with one account, then load the guide with another account. Retry marking the same feature. | Progress is scoped to the signed-in owner. Repeated completion is idempotent.                    | Passed in a disposable PostgreSQL database. A second account could neither see nor change the first account’s progress. Duplicate completion stayed a single row. |
| 5    | [Fitness workspace](http://localhost:3200/?view=day)                                                  | `/?view=day`                                                      | Open an editable fixture with a due activity while a tip would be eligible. Dismiss the real reminder.                    | The reminder takes priority, and a tip can only appear after the reminder clears.                | Passed in the Fitness Reminder story. The first tip appeared only after dismissing the reminder.                                                                  |

Return to the [manual testing index](index.md).
