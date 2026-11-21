---
name: using-superpowers
description: Use when starting MyDevStudio repository work or choosing a skill under .agents/skills. Read the matching repository skill before exploring, editing, or asking a question the skill already answers.
---

# Use repository skills first

Find and follow the skill in `.agents/skills` that matches the work. This repository copy replaces the upstream Superpowers session skill. It does not install that project, call a `superpowers:` tool, or require network access.

## When to read this

Read it at the start of repository work: a change, a bug, a review, a plan, or a question about how to proceed. Then read every other skill whose description matches before exploring, editing, or asking something that skill already settles.

Skip it for a greeting or for a narrow question whose answer is already in a file the user named. A dispatched subagent follows the named task and the skills that task lists.

## Precedence

1. The user's explicit instruction in this conversation, then [AGENTS.md](../../../AGENTS.md).
2. The process skill that matches the work. See [skill map](references/skill-map.md).
3. The package or domain skill for the files being touched.
4. Ordinary repository habits.

A skill does not override a direct user instruction. A small task still uses the skill that applies to it.

## Steps

1. Confirm the checkout when a shell is available: `pwd`, `git rev-parse --show-toplevel`, and `git status --short`. Preserve unrelated changes. Follow the checkout rule in `AGENTS.md`.
2. Search skills before opening large docs:

   ```sh
   pnpm --silent lookup skills "<specific words>" --limit 2
   ```

   If lookup is unavailable, read the `name` and `description` frontmatter of `.agents/skills/*/SKILL.md`.
3. Read each matching `SKILL.md`. Open its `workflows/` and `references/` only when that step applies.
4. Say which skill you are following, in one line, then follow it.
5. When several skills match, use the order in the skill map. Process skills set the approach. Package skills carry out the edit.

## Stop

Stop a skill when the user tells you to, when its own stop condition is met, or when inspection shows it does not apply. Name the skill that applies instead and continue.

## Verify

The skill you followed names the check. Before claiming the work is finished, follow [verification before completion](../verification-before-completion/SKILL.md).

Follow [the selection workflow](workflows/follow-skills.md) when more than one skill could apply.
