# Workflow: create or refine a skill

## 1. Define the contract

Capture the requested outcome, expected user phrasing, input/output shape, failure cases, safety boundaries and what this skill will **not** do. Confirm that this is reusable work rather than a one-off task.

Locate existing relevant skills by searching `.agents/skills` or running:

```sh
pnpm --silent lookup skills "specific topic" --limit 2
```

Read matching `SKILL.md` plus only the applicable references. Prefer updating one existing skill if its scope already covers the request; avoid duplicate triggers.

## 2. Establish behavior examples

Write 2–4 test prompts:

- A clear positive request that should use the new skill.
- A neighboring but unrelated request that should not.
- A conflict/error request (existing folder, unavailable tool, unsaved modifications).
- When relevant, a security-sensitive example.

For each, record the expected decision, artifact path and safe failure. If the runtime supports skill invocation testing, execute these prompts; otherwise mark them **reviewed only**.

## 3. Scaffold

From the verified checkout:

```sh
pnpm cli:skills scaffold short-skill-name --description "Specific capability. Use when ..."
```

Keep the generated structure and fill the content. Delete empty redundant files rather than leaving scaffold placeholders in checked-in skills.

## 4. Write and package

Write `SKILL.md` first. Include exact actionable sequence, repo-specific commands, validation, and links to detailed references and workflows. Put huge examples outside the entry file. Add deterministic scripts only after deciding what repeated operation they replace.

Read an example from another repo skill before selecting conventions. Keep relative Markdown links correct from each file's directory.

## 5. Test and refine

Run:

```sh
pnpm cli:skills validate
pnpm check:docs
pnpm cli:skills symlink --dry-run
```

Run relevant script tests if scripts exist. Review generated skill behavior against all prompts. Does the agent choose the right scope, obey security boundaries, avoid extra work, and produce a verifiable result? Rewrite the trigger or instructions if not.

## 6. Handoff

Provide a concise file inventory, example invocation, checks actually run, and any runtime limitation. Preserve unrelated files and obtain approval for PR merge or deployment when needed.
