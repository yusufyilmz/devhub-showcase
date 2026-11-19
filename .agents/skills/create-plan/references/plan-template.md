# Repository implementation plan template

Use this structure in a new file under `.agents/plans/YYYY-MM-DD-feature-slug.md`. Adapt sections to the feature, but retain the **final execution checklist** and stable task identifiers. Replace example content with verified repository details.

# Feature implementation plan

**Goal:** A one-sentence user-observable result.

**Status:** Proposed. No implementation or verification has run.

**Scope:** Exact behavior in scope and explicitly out of scope.

**Repository context:** Current commit or branch; affected app and package paths; read the relevant catalog and skill.

## Architecture and boundaries

Describe request flow, ownership and storage, validation, UI/service/package placement, and rollback or migration boundaries. Document trade-offs and any decisions still open.

## Evidence and prerequisites

Identify existing tests, APIs, tables, configuration and permissions that were read. Note missing prerequisites as unknown rather than guessing.

## Implementation steps

### Step 1: Contract and tests

**Paths:** Exact files to modify or add.

**Procedure:**

1. Write a test covering the requested behavior and one important failure case.
2. Execute the narrow test and record the actual failure.
3. Implement the smallest change satisfying that test.
4. Re-run the test, then the relevant package checks.
5. Review security, accessibility and workspace ownership, and commit the change when requested.

**Acceptance:** Observable behavior and named tests pass; no unintended changes.

### Step 2: Integration

**Paths:** Exact integration files.

**Procedure:** Trace and adapt the actual entry point, domain logic and UI boundary. Check multiuser isolation and existing compatibility. Add a meaningful integration or browser test.

**Acceptance:** Feature works in the targeted environment with documented evidence.

## Verification matrix

| Check | Command or procedure | Required result | Actual evidence |
| --- | --- | --- | --- |
| Targeted unit tests | `pnpm exec vitest run --project unit <test-file>` | Pass | Not run |
| Repository checks | `pnpm check` | Pass | Not run |
| Unit suite | `pnpm test` | Pass | Not run |
| Browser (when applicable) | `pnpm test:e2e:studio` | Pass | Not run |
| Manual guide (when applicable) | `docs/testing/manual/<feature>.md` | Reviewed | Not run |

Do not mark verification as passed from source inspection. Distinguish CI, local, fixture, staging and production evidence.

## Risk and rollback

Describe user/data risk, rollout prerequisites, feature flag or rollback mechanism, and actions that require explicit approval (for example destructive migrations, production changes or merging).

## Execution checklist

- [ ] **P1.1** Confirm repository paths, contracts and acceptance cases.
- [ ] **P1.2** Write and run failing targeted tests; capture the failure.
- [ ] **P1.3** Implement the smallest change and pass the targeted tests.
- [ ] **P1.4** Add integration/error/permission coverage and pass required checks.
- [ ] **P1.5** Update docs, run applicable CI and manual verification, and review the diff.
- [ ] **P1.6** Confirm rollout gates or explicitly document remaining blockers.

## Completion evidence

| Task | Verified evidence |
| --- | --- |

The implementation agent appends a row only after completion is demonstrated. Keep incomplete tasks unchecked, even when code has been written.
