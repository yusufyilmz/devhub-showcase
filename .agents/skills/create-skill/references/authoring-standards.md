# Standards for repository skills

## Trigger metadata

`SKILL.md` begins at byte one with YAML frontmatter. Required fields:

```yaml
---
name: example-skill
description: Create example outputs for a specific recurring repo task. Use when asked to perform this task, improve that output, or verify its workflow.
---
```

The folder name and `name` should match, using lowercase kebab-case. Write the description in terms of **user intent and activation conditions**, not the skill's internal contents. Avoid generic triggers like “use for everything”.

## Design and progressive disclosure

- `SKILL.md` contains the minimal complete contract: goal, prerequisites, steps, acceptance and stop conditions.
- `references/` holds detailed schemas, examples, repo maps and known constraints, linked from the entry skill. Do not load every reference for every use.
- `workflows/` holds reusable procedures with concrete entry/exit criteria and rollback rules. It is fine to keep a simple skill in one file.
- `scripts/` is for deterministic operations that would otherwise be reimplemented, especially validation/scaffolding. Prefer the existing `pnpm cli:skills` commands to writing a duplicate tool.
- `assets/` contains templates and fixtures only when they materially improve output. Never commit secrets, private customer content or compiled binaries.
- Keep instructions concise and actionable. The repository validator warns above 800 lines or 65,536 bytes and checks placeholders and local Markdown links.

## Repository-specific correctness

- Follow `AGENTS.md` and `docs/conventions.md` before prescribing code paths.
- Use `apps/my-dev-studio/app` for routes, `apps/my-dev-studio/views` for app-only screens, and `apps/my-dev-studio/services/<domain>` for app bindings.
- Use `packages/ui` for portable primitives, `packages/assistant` for assistant and studio compositions, and `packages/lib` for portable domain services.
- Do not hand-edit generated package catalogs or invent deep package exports.
- Keep auth, tenant identity and secrets server-side. No production changes, automatic merging or external tool actions without the user's authorization.
- For changing app behavior, include colocated tests and a manual guide with an entry in `docs/testing/manual/index.md`.
- Reuse existing repo validation, not a duplicate global toolchain.

## Quality evaluation

Test each skill with at least three hypothetical requests:

| Case | What to inspect | Passing result |
| --- | --- | --- |
| Positive | Explicit task matching the description | Skill activates, reads the required repo files and produces the expected artifact |
| Negative | Similar words, different intent | Skill does not hijack unrelated work |
| Edge | Existing file, conflict, missing tool or incomplete evidence | Skill preserves data, reports uncertainty and follows safe fallback |

If an actual agent runtime is available, compare baseline (without instruction) and skill-assisted behavior. If not, review the prompts manually and label that evaluation as not executed.

Evaluate the generated artifact itself, not just whether it follows a template: is the trigger useful, are paths real, are commands current, can another agent follow it, and are stop conditions explicit?

## Attribution and portability

Write original, repo-specific instructions. Use ideas from general planning and authoring methodologies without blindly copying third-party prose or code. Check upstream permissions before incorporating external material. Do not require upstream repositories, packages, network access or undocumented agents at runtime.

The skill validator checks frontmatter, local links, size and placeholders. It does **not** prove activation, compatibility with every agent runtime, or functional correctness. Validate those separately when possible.
