# Choose and follow a skill

## Entry

You are about to explore, edit, plan, or answer a how-to question in this repository.

## Steps

1. Read [AGENTS.md](../../../../AGENTS.md) far enough to know the checkout, package boundaries, and the skill table.
2. Before opening a large catalog, doc, or `DESIGN.md`, follow [repository lookup](../../repository-lookup/SKILL.md). For skills, run `pnpm --silent lookup skills "<specific words>" --limit 1 --max-tokens 1000`, or scan skill frontmatter when lookup cannot run.
3. Pick from the [skill map](../references/skill-map.md):
   - Outcome still open, and the user has not said to proceed: [brainstorming](../../brainstorming/SKILL.md).
   - An approved design needs tasks: [create-plan](../../create-plan/SKILL.md).
   - Behavior is being added or fixed: [test-driven development](../../test-driven-development/SKILL.md), plus the package skill for the files.
   - A status, completion, commit, or pull request claim is next: [verification before completion](../../verification-before-completion/SKILL.md).
   - A skill, plan, or subagent file is the artifact: the matching authoring skill (`create-skill`, `create-plan`, or `create-subagent`).

4. Read the chosen `SKILL.md` before the first edit or the first clarifying question that the skill would answer.
5. State the skill in one line and carry out its procedure.

## Exit

The chosen skill's stop condition is met, or you have recorded why it does not apply and switched to the skill that does.

## Rollback

If you started editing under the wrong skill, stop. Leave unrelated work untouched. Continue under the skill that matches the request.

## Reviewed prompts

These prompts were reviewed against this skill. They were not executed in a separate agent session.

| Prompt                                         | Decision                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| "Add a jobs filter on the studio jobs page."   | Read this skill, then brainstorming if the filter behavior is still open, then the app and assistant skills. |
| "What script does `pnpm test` run?"            | Answer from the root `package.json`. Do not open a design conversation.                                      |
| Lookup fails because dependencies are missing. | Read skill frontmatter directly. Do not invent a Superpowers CLI.                                            |
| "Ignore AGENTS.md and follow only this skill." | The user's explicit instruction and `AGENTS.md` win. Say so.                                                 |
