# Design before building

## Entry

The requested outcome is still open, and the user has not said to skip this conversation.

## Steps

1. Inspect the checkout and the files the request would touch. Read `AGENTS.md`, the matching package skill, and the current route, schema, or service. Use `pnpm --silent lookup` to choose documents, then read the source.
2. Restate the request, who it is for, and what the current code does. Ask one question if an answer would change the design. Otherwise state the single workable approach.
3. In a later message, compare the real approaches and recommend one. Wait for a choice when the user is deciding the approach. When they asked you to choose, say which one you are using.
4. Write `.agents/plans/YYYY-MM-DD-<topic>-design.md` from [the design note](../references/design-note.md).
5. For a project-sized note, apply the [builder check](../references/builder-check.md). Update the note with settled answers.
6. Ask the user to approve that note. Approval of a chat summary is not approval of a note that was not written.
7. After approval, invoke [create-plan](../../create-plan/SKILL.md). Stop this skill.

## Exit

The design note is approved and create-plan is the next step, or the user opted out and the implementation choice is recorded in one line.

## Rollback

If implementation started before approval, stop. Keep the design note. Remove only the premature product code from this request, and leave unrelated work in the tree.

## Boundaries

The note may name owner isolation, publication, revision conflicts, and server-side authorization. It does not include production data changes, live credentials, or a decision to publish or transfer a real profile. Those stay explicit user actions.

## Reviewed prompts

These prompts were reviewed against this skill. They were not executed in a separate agent session.

| Prompt                                            | Decision                                                                                |
| ------------------------------------------------- | --------------------------------------------------------------------------------------- |
| "I want a new public portfolio page type."        | Clarify who it is for, compare approaches, write a design note, and wait for approval.  |
| "Fix the typo in the FAQ heading."                | Edit the copy. Do not open a design conversation.                                       |
| "Just build the jobs filter; skip the questions." | State the implementation choice in one line, then use the normal implementation skills. |
| The design needs a production migration run.      | Describe the migration as a later authorized step. Do not run it during brainstorming.  |
