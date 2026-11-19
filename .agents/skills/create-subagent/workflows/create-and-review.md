# Workflow: design, scaffold, and validate a subagent

## 1. Select the right abstraction

- Repeated guidance reused in the same context → create a **skill**.
- A bounded independent task that benefits from isolation, different tools, or parallel review → create a **subagent**.
- A one-time atomic operation → use the tool directly.

Prefer a read-only reviewer to a writer when assessing unfamiliar code. Do not add autonomous agent hierarchy for a simple task.

## 2. Define the delegation contract

Write down the mission, scope, allowed tools, input artifacts, dependencies, acceptance test, output fields and escalation conditions. Inspect `AGENTS.md` and the applicable area skill so the agent does not reproduce outdated app structure.

Use a small and explicit work item (for example, review one PR diff) instead of “improve the whole repository”.

## 3. Scaffold into the supported runtime

For Claude Code:

```sh
node .agents/skills/create-subagent/scripts/scaffold-agent.mjs <agent-name> \
  --description "Specific capability. Use when ..." \
  --mission "One measurable outcome." \
  --scope "packages/lib/src/services/jobs" \
  --mode review
```

Select `--mode implementation` only if modifying code and running tests is intentionally authorized. The script refuses to overwrite existing agents. Other runtime targets need their own verified format.

## 4. Refine the generated file

Read `.claude/agents/<agent-name>.md` and tailor it: files, threats/risks, checks, output expectations, exclusions and tool usage. For sensitive changes, request a separate read-only verification agent rather than self-approval.

Define a clear return format: Summary; Changed or inspected paths; Test evidence; Findings; Blockers; Next step. The orchestrator must read this report before updating task status in a plan.

## 5. Validate behavior

Run the subagent scaffold tests and inspect YAML fields manually. If Claude Code is available, delegate one synthetic or safe real-world review. Check whether the agent:

- Stays in the requested scope and honors repository conventions.
- Does not write files if read-only.
- Produces actionable findings with source paths and actual checks.
- Does not invent test results or claim a merge/deploy.

If runtime invocation is unavailable, say so and leave runtime validation open.

## 6. Handoff

Document the created agent path and supported runtime. If it implemented part of a plan, only mark the plan item complete using the create-plan evidence workflow after tests and acceptance criteria are verified.
