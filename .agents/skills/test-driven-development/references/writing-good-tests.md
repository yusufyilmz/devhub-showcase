# Writing good tests

Load this when writing or changing a test, adding a mock, or adding a helper.

## Name the break

Before the test body, name the production change that should make it fail, and whether that change is a bug. A useful test catches a wrong branch, a missing side effect, a wrong argument, a boundary, or a broken contract.

Write the expected value as a literal or a hand-checked fixture. An expectation computed by the code under test, or by its helpers, passes no matter what that code does.

Assert the behavior a caller can observe. A test that only checks a constant, a private field, or that a source file contains a line fails on a rewrite and misses the bug. For a script, run it and assert the exit code, output, or file change.

Test this repository's contract: the value a schema accepts, the row a repository returns, the response a route sends, the element a reader finds. A framework's own routing mechanics are not the subject. Constructors, getters, and pure forwarding need a test when they validate, default, derive, or cause a side effect.

## Exercise the real code

Assert the component, function, or route result. An assertion that only checks a mock passes when the mock is present and fails when it is absent.

Mock with Vitest at the boundary that is slow or external. Keep the behavior the test depends on real. Learn the real method's side effects before replacing it. A mock response includes the fields the real payload has, not only the field the assertion reads. Each branch gets its own fixture.

Cleanup that only tests call lives in the test file or `tools/test/support`. It does not become a method on the production type.

When mock setup is larger than the behavior under test, use the real collaborators.

## Mutation check

Before finishing, consider one realistic mutation at a time: a wrong constant, a wrong branch, a missing write, an empty return, and a missing check for empty, unauthorized, or malformed input. At least one test should fail for each mutation that would be a bug. A mutation that nothing catches is unprotected behavior or a tautological test.

## Repository shape

Follow [docs/testing.md](../../../../docs/testing.md). Use existing fixtures. Cover the cases that match the change: invalid input, an earlier document that omits a new field, owner and other-user access, a denied write, a revision conflict, and a missing integration. Do not weaken Biome or TypeScript rules to make a test pass. Do not log credentials, CV content, prompts, tokens, or raw request bodies from a test.
