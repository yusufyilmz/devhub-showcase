---
name: create-plan
description: Create and maintain actionable, repository-grounded implementation plans under .agents/plans. Use when planning a feature, breaking a specification into testable tasks, executing an existing plan, or marking verified implementation tasks complete.
---

# Create and execute a repository plan

Produce a plan that an engineer or delegated agent can execute without inventing repository structure. This skill contains its own workflow; installing external planning frameworks is not required.

## Use this skill

- A feature or refactor needs an implementation plan.
- An existing plan must be split into verifiable work.
- Implementation progress must update the plan checklist rather than merely claim completion in chat.
- The request asks for a Superpowers-style plan adapted to MyDevStudio.

## Canonical locations

- **This skill:** `.agents/skills/create-plan/SKILL.md`
- **Generated plans:** `.agents/plans/YYYY-MM-DD-short-slug.md`
- **Supporting resources:** [plan template](references/plan-template.md) and [planning and execution workflow](workflows/plan-and-execute.md)
- **Completion helper:** `node .agents/skills/create-plan/scripts/mark-task.mjs`

Do not create plans under `docs/superpowers/` or store plans inside the skill folder. Do not use an upstream framework's runtime commands: follow this skill and the repo's own checks.

## Non-negotiable procedure

1. Read `AGENTS.md`, the exact relevant source files, applicable package skills, and any prior plan. Verify the checkout and working tree before editing. Preserve unrelated changes.
2. Establish observable goal, constraints, non-goals, risks, owner/data boundaries and acceptance criteria. Resolve unknowns by inspection; clearly flag what cannot be verified.
3. Choose file paths from the **current** repository tree, not an assumed Next.js layout. Follow `docs/conventions.md` and `docs/architecture.md`; find reusable UI in `packages/ui/CATALOG.md`.
4. Write small ordered tasks with specific paths, a red/green/refactor sequence where code is involved, commands to run, and a checkable outcome. Include tests for errors, permissions, browser behaviors and migrations as relevant.
5. **End the plan with one `## Execution checklist` section.** Give each entry a stable unique identifier such as `P1.1`; use `- [ ] **P1.1** Description`. Include validation, docs, review and rollout as separate checklist items. The script relies on these identifiers.
6. During implementation, complete a task only after its acceptance criteria and required verification are satisfied. Record an actual command/result, file, test, or reviewed artifact as evidence. Mark it using the helper, then commit the plan update alongside or immediately after implementation.
7. When resuming a legacy plan with unnumbered checkboxes, assign stable IDs to the existing tasks without resetting their status before using the completion helper.
8. Keep unfinished, blocked, and unrun checks unchecked. Never equate a commit, drafted test, CI start, or code existence with a passing test or a deployed feature.

## Completion command

```sh
node .agents/skills/create-plan/scripts/mark-task.mjs \
  .agents/plans/2026-11-19-example.md \
  --id P1.1 \
  --evidence "pnpm exec vitest run --project unit <test-file> passed; commit <sha>"
```

The helper updates exactly one matching unchecked task and records the supplied evidence in the plan. It does **not** run or verify checks: the executing agent must do that first. If the helper is unavailable, update the same checklist and evidence section manually without manufacturing results.

Read [the detailed workflow](workflows/plan-and-execute.md) before writing or resuming a plan.
