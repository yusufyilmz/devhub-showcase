# Prove the claim

## Entry

A message is about to say that work succeeded, or a commit or pull request is about to be created.

## Steps

1. List each claim separately. "Tests pass" and "the studio build passes" are different claims.
2. For each claim, run the command in [the evidence map](../references/evidence.md). Read the full result that fits in the session, including the exit code. For a completion, commit, or pull-request claim, run `pnpm generate:catalogs` and then `pnpm check:catalogs` as well.
3. Compare the output to the claim. A lint pass does not prove a typecheck. A typecheck does not prove a test. One green file does not prove `pnpm test`.
4. For a bug fix, the command that demonstrated the bug now passes. A regression test that was never seen failing is not yet evidence that it catches the bug. Pair this with [test-driven development](../../test-driven-development/SKILL.md).
5. For a delegated edit, read the diff and rerun the proving command. The delegate's summary is not the evidence.
6. Write the reply. Put the command and the observed result next to the claim. Name any check left **Not run**.

## Exit

Every success sentence in the reply has a command and result from this session, or it is explicitly marked not run.

## Rollback

If a late command fails, remove the success wording and report the failure. Do not switch to a weaker command and keep the original claim.

## Reviewed prompts

These prompts were reviewed against this skill. They were not executed in a separate agent session.

| Prompt                                                         | Decision                                                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| "Is the username check done?"                                  | Run the colocated test and report its output before answering yes.                                           |
| "Draft a commit message for the open diff."                    | Draft the message. Do not claim the suite passed unless the user also asked to commit and the suite was run. |
| The test runner cannot start because dependencies are missing. | Say **Not run** and the missing dependency. Do not call the change passing.                                  |
| "Mark the plan task complete; the last agent said it passed."  | Read the diff, rerun the named check, then record evidence.                                                  |
