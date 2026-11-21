---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, or before committing or opening a pull request. Run the repository check that proves the claim and report its output.
---

# Verification before completion

State a success claim only with fresh command output from this session. A claim includes "done", "fixed", "passing", "green", and any paraphrase that the work is complete or correct.

## When to use

Use this before telling the user that a change is finished, a bug is fixed, tests or lint passed, a build succeeded, a plan task is complete, or a pull request is ready. Also use it before committing or opening a pull request when the user asked for that.

A draft, a question, or an in-progress update is not a completion claim. Say what is unverified instead of implying that it passed.

## Gate

1. Name the command that proves the claim. Use [the evidence map](references/evidence.md).
2. Run the full command in this session. A remembered run, a partial log, or another agent's summary does not count.
3. Before a completion, commit, or pull-request claim, also regenerate catalogs and prove they match:

   ```sh
   pnpm generate:catalogs
   pnpm check:catalogs
   ```

   One package uses the same commands with `--package <name>`. Generation writes a `CATALOG.md` only when it changed. `pnpm check` runs the check and does not generate. A hand-edited catalog is not evidence.
4. Read the exit code and the failure count.
5. If the output confirms the claim, state the claim with the command and the result. If it does not, state the actual result.
6. For a check that cannot be run, say **Not run** and the blocker. Leave the matching plan task unchecked.

Follow [the proof workflow](workflows/prove-the-claim.md) when the claim covers more than one command.

## Repository limits

Local unit output does not prove GitHub Actions, a preview deployment, a production migration, or a third-party integration. Browser behavior needs the browser flow, or an explicit statement of what was not opened. A manual-guide step that was not performed stays **Not run**.

The create-plan helper records evidence. It does not run the check. Run the check first, then pass the observed result as evidence.

## Stop

Do not commit, push, open a pull request, or mark a task complete while the proving command is missing or failing, unless the user explicitly accepts that incomplete state. Report the failing command by name.
