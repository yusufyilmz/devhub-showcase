---
name: create-skill
description: Design, create, refine and evaluate reusable repository-specific agent skills in .agents/skills. Use when a user asks to create a skill, adapt a workflow into a SKILL.md, improve skill triggering, or bundle references, workflows and optional scripts for MyDevStudio.
---

# Create a MyDevStudio skill

Author a small, self-contained skill that works with this repository's skill discovery and validation. Use test-driven behavior design, concise trigger metadata, and progressive disclosure; the procedure here does not require external skills or installation.

## Where the result belongs

```text
.agents/skills/<skill-name>/
  SKILL.md                 # mandatory: frontmatter + executable instructions
  references/              # optional: contracts, maps, examples read on demand
  workflows/               # optional: repeatable step-by-step procedures
  scripts/                 # optional: deterministic helpers with tests
  assets/                  # optional: non-code templates
```

Canonical source is `.agents/skills`. The repository links `.cursor/skills` and `.claude/skills` to it. Do not write separate copies into those linked locations.

## Creation procedure

1. Read `AGENTS.md`, `.agents/README.md`, and the closest existing skill. Review `tools/cli/skills/scaffold.ts` and `tools/cli/skills/validate.ts` when changing scaffolding or validation behavior.
2. Identify a **single reusable capability** and when it should be invoked. Write a positive trigger and a negative example; do not create a skill for a one-off action better served by an ordinary plan or comment.
3. Before drafting, define two or more sample requests: one that should activate the skill, one that should not, and one tricky case. Note what an unassisted agent would miss.
4. Scaffold through the existing CLI:

   ```sh
   pnpm cli:skills scaffold <skill-name> --description "Use when ...; ..."
   ```

   If a folder exists, inspect and update it without overwriting. Do not hand-roll a second scaffolder.
5. Write a precise `SKILL.md`: purpose, trigger, inputs, steps, output, constraints, how to verify. Put dense contracts in `references/` and lengthy procedures in `workflows/`. Add `scripts/` only when a repeatable mechanical operation benefits from deterministic code, tests, and no hidden network dependency.
6. Audit repo paths, ownership, CLI commands, security, licensing and compatibility. Never claim a command or tool exists merely because another framework offers it.
7. Run skill and Markdown validation, inspect results, revise confusing triggers, and report actual checks. No credentials or user private files in examples or fixtures.

Read [authoring standards](references/authoring-standards.md) and [the creation workflow](workflows/create-and-evaluate.md) before generating a new skill.

## Verification

```sh
pnpm cli:skills validate
pnpm check:skills
pnpm check:docs
pnpm cli:skills symlink --dry-run
```

If a script is included, run its targeted tests (for Node helpers use `node --test path/to/script.test.mjs`) and document permissions, inputs, failure modes and the supported Node runtime. Do not claim passing validation unless executed.

## Output and handoff

Report the created `SKILL.md`, bundled references/workflows/scripts, trigger tests, validation results and any unverified runtime integration. Keep changes focused; do not silently alter shared agent instructions or enable new tool permissions.
