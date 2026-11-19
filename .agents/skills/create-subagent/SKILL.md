---
name: create-subagent
description: Create focused task-specific repository subagents with safe permissions and explicit handoff contracts. Use when asked to create a code reviewer, test writer, researcher, implementer or other delegated agent for MyDevStudio, or to improve an existing subagent definition.
---

# Create a scoped MyDevStudio subagent

A subagent is a focused worker with a narrow mission, separate context, limited tools and a required evidence-based handoff. Use original repo-specific instructions; no external agent framework is installed by this skill.

## Runtime choice

**Default target: Claude Code project subagents** in `.claude/agents/<agent-name>.md`. This is the native Markdown frontmatter format for the repo's Claude runtime. A `create-subagent` **skill** lives in `.agents/skills`, but the agents it creates belong in `.claude/agents`—not in `.agents/plans` or `.agents/skills`.

This is intentionally **not** claimed to be a universal Codex or Cursor subagent format. If a different runtime is requested, inspect its installed documentation and target configuration before creating anything. Do not assume tool names or frontmatter are portable.

## Default behavior

- Create a **read-only** specialist by default (tools: `Read, Grep, Glob`). It can inspect source and deliver a review; it cannot change files or run shell commands.
- Use `--mode implementation` only for a specifically authorized code-writing agent; its tools are `Read, Grep, Glob, Edit, Write, Bash`. Tool lists are runtime capabilities, **not** filesystem isolation or user authorization.
- Give a narrow mission, bounded file scope, precise acceptance criteria, safety constraints and required output. An agent must not silently approve itself, merge, deploy, alter production data or modify unrelated files.
- When delegating tasks from a plan, require the worker to return observed test evidence; the orchestrator uses [create-plan](../create-plan/SKILL.md) to mark tasks complete **only after verification**.
- Do not create another agent when a skill or simple tool call would suffice.

## Create an agent

1. Read `AGENTS.md` and relevant repository skills. Inspect existing `.claude/agents` before choosing a name or specialization.
2. Define a single mission, source paths, allowed tools, expected output, and how failure/uncertainty is reported.
3. Use the safe scaffolder; it refuses path traversal and existing file replacement:

   ```sh
   node .agents/skills/create-subagent/scripts/scaffold-agent.mjs code-reviewer \
     --description "Review MyDevStudio code changes for regressions and access boundaries. Use when the user requests a focused code review." \
     --mission "Review the change for auth, data ownership, testing and architecture regressions." \
     --scope "apps/my-dev-studio" \
     --mode review
   ```
4. Refine `.claude/agents/code-reviewer.md` for the actual role. A generated agent is a starting point, not automatically a suitable expert.
5. Check YAML frontmatter, instructions, capabilities and scope. Test a small representative task if the target runtime is available. Never claim verification in an untested runtime.

Read [the native agent format](references/claude-agent-format.md) and [the authoring workflow](workflows/create-and-review.md) before generating.

## Verification

```sh
node --test .agents/skills/create-subagent/scripts/scaffold-agent.test.mjs
pnpm cli:skills validate
pnpm check:docs
```

The existing skill validator validates **skills**, not generated `.claude/agents` runtime behavior. Inspect generated agent frontmatter separately and delegate a real small task before relying on it.
