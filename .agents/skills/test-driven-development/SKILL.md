---
name: test-driven-development
description: Use when implementing or fixing behavior in this repository, before writing production code. Write a failing colocated test, watch it fail, then make the smallest change that passes.
---

# Test-driven development

Change behavior by writing the test first, watching it fail for the missing behavior, and then writing the smallest production change that makes it pass.

## When to use

Use this for a new behavior, a bug fix, a refactor that can change behavior, and any other production change a test can observe.

Do not use it for an explanation, a review, or a documentation-only edit. Generated catalogs, generated database types, and generated Next.js files are not hand-edited to satisfy a test. Put the test on the source that produces them, or on the contract that consumes them. A throwaway spike needs the user's explicit agreement, and its code is not kept as the implementation.

## The rule

No production behavior change without a test that failed first because that behavior was absent.

If production code for the new behavior was written first, delete that new behavior and start from the test. Leave unrelated dirty files alone. Do not keep the premature code in the tree as a reference.

## Files and commands

Colocate the test with the source, using the source base name. `route.ts` is covered by `route.test.ts`. `user-profile.ts` is covered by `user-profile.test.ts`. A component story, when the component has one, is `<name>.stories.tsx` in that same folder. The suite starts with `describe`. Keep `beforeEach`, `afterEach`, and `it` inside that suite. Helpers that are not tests stay at module scope.

Run the test from the repository root. Use the current scripts in the root `package.json` if they differ from these:

```sh
pnpm exec vitest run --project unit path/to/file.test.ts
pnpm test
pnpm test:fitness
node --test path/to/script.test.mjs
```

`pnpm test` is the unit project. Fitness tests are `pnpm test:fitness`. A green run of one new file does not stand in for the suite the change can affect.

Read [red, green, refactor](workflows/red-green-refactor.md) before writing the test, and [writing good tests](references/writing-good-tests.md) before adding a mock or a helper.

## Done

The new test failed for the missing behavior, then passed. The broader command required by the change passed, or the unrun command is named. Coverage of the new behavior includes the error and permission cases the change can reach. Assertions were not weakened to get a pass.

A user-facing feature still needs its manual guide under `docs/testing/manual/` and an index entry. That guide does not replace the failing test.
