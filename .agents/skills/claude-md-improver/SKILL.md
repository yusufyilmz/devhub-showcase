---
name: claude-md-improver
description: Audit, score, and improve AGENTS.md, CLAUDE.md, and scoped agent instruction files in a repository. Use when asked to check, install, maintain, simplify, or fix repository agent instructions or project memory. Do not trigger for ordinary feature implementation.
---

# Agent instruction improver

Adapted for DevHub Showcase from Anthropic's [claude-md-improver](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/claude-md-management/skills/claude-md-improver/SKILL.md) (Apache-2.0, see [LICENSE](LICENSE)). Follow the original discovery → assessment → report → targeted edits → verification workflow. DevHub Showcase's canonical shared instructions are [AGENTS.md](../../../AGENTS.md); `CLAUDE.md` imports them using `@AGENTS.md`.

## When to use

- **Trigger:** A user requests an audit, score, improvement, or upkeep of AGENTS.md, CLAUDE.md, or repository-level agent memory.
- **Do not trigger:** Normal feature coding, test fixes, PR reviews, or package changes unless the task specifically includes agent instructions.
- Use [mydevstudio-development](../mydevstudio-development/SKILL.md), [using-superpowers](../using-superpowers/SKILL.md), and [verification-before-completion](../verification-before-completion/SKILL.md) as appropriate.

## 1. Discover the instruction hierarchy

From the repository root, search tracked and local files for `AGENTS.md`, `CLAUDE.md`, `.claude.md`, and `.claude.local.md`. Inspect root and nested instructions, and whether `CLAUDE.md` delegates to `@AGENTS.md`. Never copy local untracked or private overrides into commits. Check `.agents/skills` and related references for information that should be linked rather than duplicated.

A repository copy may have only `AGENTS.md`; do not invent additional instruction files unless the user requests compatibility. Check which agent discovers each file and how `.claude/skills` is linked before promising global installation.

## 2. Assess against the actual codebase

Read the target instruction file completely, then verify claims against `package.json`, `.nvmrc`, directory structure, import/export maps, CI workflows, migration policies, tests, and referenced docs. Use [quality-criteria](references/quality-criteria.md) to score six dimensions totaling 100 points:

| Criterion                        | Max |
| -------------------------------- | --: |
| Commands and workflows           |  20 |
| Architecture clarity             |  20 |
| Non-obvious patterns and gotchas |  15 |
| Conciseness                      |  15 |
| Currency                         |  15 |
| Actionability                    |  15 |

Grades: A = 90–100; B = 70–89; C = 50–69; D = 30–49; F = 0–29. Scores are **human rubric assessments**, never automated test results.

## 3. Report before editing

Show the file inventory, total and per-dimension score, specific verified weaknesses, and a short set of proposed changes **before writing**. Include an example diff or exact sections that will change, explaining why the change helps future sessions. If the user has explicitly requested the improvements (including "install and apply"), that is approval to proceed; otherwise ask before changing the repo.

## 4. Make targeted improvements

- Prefer short, executable instructions, verified repo paths, correct tooling versions, and the unusual architecture, security, and migration gotchas that matter to this project.
- Keep mandatory authorization, data privacy, consent, and release safeguards in root `AGENTS.md`; move exhaustive CLI lists and review procedures to skill references with **relative links**.
- Keep generated Next.js/Turborepo agent blocks byte-for-byte intact; do not remove them to save space.
- Preserve the original meaning of profile ownership, publication, revision conflicts, provider, and privacy boundaries. Do not mistake fixture-backed checks for production provider verification.
- Never modify secrets, untracked local overrides, or unrelated code.
- Prefer [templates](references/templates.md) only when this repo is genuinely missing a necessary section; do not paste a generic template wholesale.
- Keep the change focused and show a before/after diff.

## 5. Verify and report

Check all local links and referenced scripts against repo sources. Run `pnpm check:skills`, `pnpm check:docs`, and relevant instruction/lookup checks when runnable; report missing execution honestly. List exact files updated, what changed, rubric before/after as assessments, and a link to the PR or diff if one was requested. Do not claim that a score validates code or production behavior.

## Maintenance tip

Prefer a few lines in the root plus an on-demand skill reference over an exhaustive inline table. Keep personal instructions local and ignored; keep project instructions version-controlled.
