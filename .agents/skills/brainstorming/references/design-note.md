# Design note

Write the note at `.agents/plans/YYYY-MM-DD-<topic>-design.md`. Use the headings below. A small change keeps each heading to a line or two. A project note is detailed enough to plan without another interview.

```markdown
# <Topic> design

## Intent

Who it is for, and why this is being built.

## Goals

What the approved behavior does.

## Non-goals

What this work will not change.

## Constraints

Checkout, package ownership, auth, data isolation, compatibility, and verification limits.

## Approaches

The approaches that were real options, the tradeoff of each, which one was chosen, and why. Mark choices the user made and choices you made.

## Behavior

The parts a reader can observe, including an empty, error, or unauthorized case when those exist. For a screen, include a short text sketch.

## Builder choices

What the implementer may decide. Minor choices already settled are marked as the author's call.

## Next step

Approved notes continue with `.agents/skills/create-plan/SKILL.md`.
```

Keep paths real. Prefer `apps/my-dev-studio/app` for routes, `apps/my-dev-studio/views` for app-only screens, `apps/my-dev-studio/services/<domain>` for app bindings, `packages/ui` for portable controls, `packages/assistant` for studio and portfolio compositions, and `packages/lib` for shared services. Do not invent `apps/web` or a deep package export.

Do not commit the note unless the user asks. Do not check off implementation tasks in this note. The implementation plan carries the execution checklist.
