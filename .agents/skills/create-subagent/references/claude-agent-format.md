# Claude Code subagent format and permissions

## Native project location

Use `.claude/agents/<kebab-case-name>.md`. The filename is one subagent. It is distinct from linked `.claude/skills`, which points to `.agents/skills`. Do not introduce a second canonical skills folder.

## Example (read-only reviewer)

```md
---
name: access-reviewer
description: Review changed server-side MyDevStudio code for authorization regressions. Use when changes affect user identity, permissions or ownership.
tools: Read, Grep, Glob
model: inherit
---

# Access reviewer

Mission: Identify concrete authorization and tenant-isolation risks in the requested diff.

Read AGENTS.md, the relevant domain skill, and only the source necessary to evaluate this mission. Do not change files.

Return:
- Paths and lines inspected.
- Findings with severity, reproducible evidence and suggested tests.
- Checks run (or explicitly Not run) and unresolved questions.
- A concise handoff to the orchestrator.
```

## Permission guidance

| Agent kind                | Typical tools                         | Intended behavior                                     |
| ------------------------- | ------------------------------------- | ----------------------------------------------------- |
| Reviewer, docs researcher | `Read, Grep, Glob`                    | Inspect and report, no writes                         |
| Targeted implementer      | `Read, Grep, Glob, Edit, Write, Bash` | Make authorized scoped changes, run checks and report |

Avoid granting `Bash`, `Edit` or `Write` to inspection-only agents. Use `model: inherit` unless a verified cost/capability requirement justifies another supported model. Do not invent tool names, unsupported frontmatter or privileges.

The tool allowlist limits which agent tools are callable; it does not provide OS sandboxing or guarantee that an instruction alone can restrict reading files. Protect credentials and access through actual permission boundaries.

## Designing the mission

Give each agent:

1. **Purpose:** one measurable delegated outcome, not “work on anything”.
2. **Scope:** explicit folders, domain, feature or diff; state excluded areas.
3. **Prerequisites:** `AGENTS.md`, applicable `.agents/skills` and relevant catalog.
4. **Procedure:** focused inspection or test-driven implementation in existing package boundaries.
5. **Validation:** exact checks, expected behavior, and how to report unavailable tools.
6. **Handoff:** findings/changes, paths, test evidence, unverified claims and blockers.

For read-only agents, give evidence, not a command to change code. For implementation agents, do not authorize git merges, deployments or production changes via an instruction template. Only an explicit authorized user request permits those operations.

## Compatibility

The `.claude/agents` YAML frontmatter documented here is the chosen Claude Code target. Other runtimes may load skills but not these agent definitions. If generating for another runtime, inspect its actual config schema and provide a different template with distinct file location; do not silently copy this file and claim compatibility.
