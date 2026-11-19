# Planning and implementation workflow

## A. Discover before planning

1. Check `pwd`, `git rev-parse --show-toplevel` and `git status --short` when shell access is available. If working through GitHub, state that local working-tree status is unavailable.
2. Read `AGENTS.md`, `docs/conventions.md`, `docs/architecture.md`, and relevant domain/package skills. Prefer `pnpm --silent lookup` for discovery only; read the actual source afterward.
3. Trace the current entry point through validation, service/repository, and UI. List exact paths. Check existing test and migration conventions.
4. Capture user requirements and operational constraints. If a behavior depends on an unavailable external capability, plan an honest fallback and a verification step; do not assert it exists.

## B. Write a plan

1. Use the [plan template](../references/plan-template.md). Name it `.agents/plans/YYYY-MM-DD-topic.md`.
2. Limit each implementation action to a small reviewable step. Include path, test, expected failure, implementation, retest and exit criterion.
3. Prefer existing packages and exports. For new UI/API features, include a manual test guide under `docs/testing/manual/` and its index entry.
4. Put exact commands in the plan; use the root `package.json` for current commands rather than hardcoding obsolete versions.
5. Order dependencies: contracts → failing tests → implementation → broader validation → rollout. Include owner isolation, secrets, app boundaries and compatibility when appropriate.
6. Put the sole machine-checkable checklist at **the end**. Assign non-repeating task IDs, e.g. P1.1, P1.2, P2.1. Avoid vague tasks like “finish everything”.

## C. Execute and keep the plan current

1. Select the first unblocked `- [ ]` entry. Confirm relevant repository state before implementation and avoid overwriting unrelated changes.
2. For behavior changes, write the failing test first and run it. Implement the smallest change; run the targeted test green. Continue with required checks from the plan.
3. Confirm the acceptance criterion with actual output. If a check cannot run, record “Not run” or “Blocked” with the reason and keep the task unchecked. A test file existing is not equivalent to a test passing.
4. Update the task directly after completing it:
   ```sh
   node .agents/skills/create-plan/scripts/mark-task.mjs \
     .agents/plans/YYYY-MM-DD-topic.md \
     --id P1.2 \
     --evidence "Targeted unit test passed locally at commit abc123"
   ```
5. Record the evidence in the plan. Keep the checklist committed with the code in the same PR. When task scope changes, edit the text without renumbering completed IDs.
6. After each task, report what is now done, what is blocked, and the next task. If another agent works on a task, require the same verified evidence before the orchestrator marks it complete.

## D. Review

Before calling a plan complete, check that all required tasks are `[x]`, evidence is meaningful, docs and test coverage match the delivered behavior, and CI/preview checks ran. “Merge”, “deploy” and “change production data” are separate authorization steps.

## Example completion states

- Code committed; CI queued: **not complete** for a “tests green” task.
- Unit test passes but browser flow not run: unit task may be complete; browser task stays open.
- A service exists with no owner-isolation test: implementation may be partially done; a task requiring isolation stays open.
- Existing feature already satisfies a step and is verified: mark done with current file/test evidence; do not reimplement it.
