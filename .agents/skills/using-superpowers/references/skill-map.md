# Repository skill map

Canonical skills live in `.agents/skills`. `.cursor/skills` and `.claude/skills` are links to that directory. Read the repository file. A global copy of an upstream skill does not replace it for MyDevStudio work.

There is no `superpowers:` tool namespace in this repository. When an instruction names `superpowers:<skill>`, open the repository file in the table.

| Request or upstream name                           | Repository skill                                         |
| -------------------------------------------------- | -------------------------------------------------------- |
| `using-superpowers`, choosing a skill              | `.agents/skills/using-superpowers/SKILL.md`              |
| `brainstorming`, outcome still open                | `.agents/skills/brainstorming/SKILL.md`                  |
| `writing-plans`, implementation plan               | `.agents/skills/create-plan/SKILL.md`                    |
| `test-driven-development`, behavior change         | `.agents/skills/test-driven-development/SKILL.md`        |
| `verification-before-completion`, completion claim | `.agents/skills/verification-before-completion/SKILL.md` |
| Creating a skill                                   | `.agents/skills/create-skill/SKILL.md`                   |
| Creating a subagent                                | `.agents/skills/create-subagent/SKILL.md`                |
| Workspace, package, or domain edit                 | The [domain skill map](#package-and-app-skills) below               |
| Finding a catalog, doc, skill, or design rule      | `.agents/skills/repository-lookup/SKILL.md`              |

Plan execution uses the create-plan workflow. Do not treat an unadapted copy of an upstream executing-plans document as the repository procedure.

## Package and app skills

Read the corresponding skill for each affected owner. Fitness OS uses [its app AGENTS.md](../../../../apps/my-fitness-app/AGENTS.md) and the common development skill; there is no separate Fitness SKILL.md.

| Area             | Skill                                                                       |
| ---------------- | --------------------------------------------------------------------------- |
| Workspace and CI | [mydevstudio-development](../../mydevstudio-development/SKILL.md)           |
| Product rules    | [mydevstudio-business](../../mydevstudio-business/SKILL.md)                 |
| Section UI       | [mydevstudio-sections](../../mydevstudio-sections/SKILL.md)                 |
| Shared UI        | [developing-ui-package](../../developing-ui-package/SKILL.md)               |
| Config           | [developing-config-package](../../developing-config-package/SKILL.md)       |
| Services and DB  | [developing-lib-package](../../developing-lib-package/SKILL.md)             |
| Auth             | [developing-auth-package](../../developing-auth-package/SKILL.md)           |
| Assistant and CV | [developing-assistant-package](../../developing-assistant-package/SKILL.md) |
| Runtime          | [developing-runtime-package](../../developing-runtime-package/SKILL.md)     |
| Utilities        | [developing-utils-package](../../developing-utils-package/SKILL.md)         |
| Trello           | [developing-trello-package](../../developing-trello-package/SKILL.md)       |
| Studio app       | [developing-my-dev-studio-app](../../developing-my-dev-studio-app/SKILL.md) |
| Storybook        | [developing-storybook-app](../../developing-storybook-app/SKILL.md)         |

## Order when several match

1. Repository lookup, before opening a large catalog, doc, skill reference, or `DESIGN.md`.
2. Brainstorming, while the outcome is still open and the user has not told you to proceed.
3. create-plan, once the design is approved or the user asked for a plan.
4. Test-driven development, once behavior will change.
5. The package skill for the files being edited.
6. Verification before completion, before any claim that the work passes or is done.

A known bug with a clear symptom uses test-driven development. It does not need a design workshop. A one-line correction the user already specified does not need brainstorming.

## Harness

Cursor and Claude Code both read the linked `.agents/skills` tree. Announce the skill in chat, then follow its file. Do not look for upstream platform notes about other agent products. This repository's commands are `pnpm`, the root `package.json` scripts, and the tools named in each skill.

## Attribution

The session, design, test-first, and evidence-before-claims ideas come from Jesse Vincent's MIT-licensed project [obra/superpowers](https://github.com/obra/superpowers). The instructions in this repository are written for MyDevStudio. Runtime work must not clone or call that project.

## Rationalizations that mean stop

| Thought                                    | What to do                                         |
| ------------------------------------------ | -------------------------------------------------- |
| The change is too small for a skill.       | Read the skill that matches the change.            |
| The skill can be recalled from memory.     | Read the current file.                             |
| Exploration should happen first.           | The skill says how to explore. Read it first.      |
| A question needs context before any skill. | Read the skill, then ask only what it leaves open. |
