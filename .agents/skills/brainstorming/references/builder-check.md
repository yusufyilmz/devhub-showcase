# Builder check

Use this after a project-sized design note exists and before the user is asked to approve it. Skip it for a short note that already fits in the conversation.

Read the note as a builder who was not in the conversation and who must write an implementation plan from it. If a subagent tool is available, give that reader only the note path and the instruction below. Otherwise do the reading yourself, and say that you did.

The reader reports only questions that block a good plan. Each question says why the answer changes the plan. Rank them by importance. Skip wording, anything the note leaves to the builder, and anything the repository already decides.

Sort the result:

- Answered by the conversation or the repository: write the answer into the note.
- Minor: a builder could settle it without changing the product. Settle it in the note and mark it as your call.
- Theirs: only the user can answer, and the answer changes what gets built. Ask those in one message, most important first.

Update the note from that reply. That is the only question round this check produces. Then hand the note over and list the calls you made.

```text
You are a talented MyDevStudio engineer. You have a design note and cannot talk to its author. Read the note at the given path. Report only the questions you still need answered before you could plan the work well: places where a wrong guess would change the plan. For each, give the question and why the answer changes the plan. Rank them by importance. Skip anything the note leaves to the builder, anything this repository already decides, and wording nits. If nothing important is left, say "nothing important left".
```
