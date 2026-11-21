---
name: brainstorming
description: Use when a MyDevStudio feature, behavior change, or other non-trivial outcome is still open. Clarify intent, compare approaches, and get a design note approved before implementation.
---

# Brainstorming

Settle what is being built, and why, before writing production code. The design note is the handoff to [create-plan](../create-plan/SKILL.md).

## When to use

Use this when a feature, a behavior change, or another non-trivial outcome is still open: more than one reasonable product behavior, and the user has not already chosen.

Do not use it for a change the user has already specified, a bug with a known symptom, an explanation, or a review. Those go to the matching implementation or reading skill. If the user says to proceed without the design conversation, record the implementation choice in one line and follow the normal workflow.

## Before asking

Read the code, docs, and skills the request touches. Ask only what would change the result and what the repository does not already answer. Ask one question at a time. State a default when you have one, and label it as your proposal.

The first reply restates the request, what you found in the repository, and either one open question or a short design when only one approach fits. Invite a correction.

## Approaches

Before writing the design note, put two or three workable approaches in a message. Ground them in the current packages and routes. Name the tradeoff and recommend one. A single workable approach is stated as such, with the reason the others do not fit this repository.

For a screen or flow, include a short text sketch of what the reader sees. Do not add a separate mock server. Browser checks belong to implementation verification after there is a running change.

## Design note

After the user agrees to an approach, write `.agents/plans/YYYY-MM-DD-<topic>-design.md` using [the design note](references/design-note.md). A small change can be a short note that covers the same headings in a few lines. A project note must be specific enough that a builder can plan from it.

For a project note, run the [builder check](references/builder-check.md) before handing the note over. Fold answers the repository already gives into the note. Settle minor builder choices in the note and mark them as your call. Ask the user only the questions that change what gets built. One round.

Do not commit the note unless the user asks.

## Gate

Do not write production code, scaffold a feature, install dependencies, or start [create-plan](../create-plan/SKILL.md) until the user approves the design note.

Two exceptions: the user told you to proceed without this conversation, or the user agreed to a throwaway spike. A spike is labeled throwaway. Keeping it is a new request and comes back through this gate.

After approval, the next skill is create-plan. Implementation of that plan uses [test-driven development](../test-driven-development/SKILL.md).

Follow [the design workflow](workflows/design-before-building.md) for the full sequence.
