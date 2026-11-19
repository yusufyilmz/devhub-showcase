# ChatGPT Job Research Import for MyDevStudio Job Hunter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the results of the existing ChatGPT job research automation into MyDevStudio Job Hunter as reviewed, deduplicated job listings, without relying on an unsupported direct ChatGPT automation webhook.

**Architecture:** Keep MyDevStudio and Supabase as the source of truth. Add a **user-initiated structured import** first: ChatGPT generates a small JSON payload, the user pastes or uploads it to a protected Job Hunter import surface, and existing discovery/matching/application workflows take over. Only after testing an independently verified delivery channel should automatic ingestion be added; existing LinkedIn email forwarding is a separate path and must not be assumed to carry ChatGPT automation output.

**Tech Stack:** Next.js App Router, TypeScript, Zod, Supabase/Postgres with RLS, existing Job Hunter domain services, React, Vitest and Playwright.

**Spec:** Requirements and decisions in this plan's “Product contract” section; source of truth is the current Job Hunter implementation and documented manual tests.

## Product contract and decisions

1. The existing automation **Birleşik Kariyer ve İş Fırsatları** searches Monday, Tuesday and Thursday at 14:00 Europe/Madrid; it checks recruiter emails and open roles, prefers Spain-compatible Senior/Staff Frontend and frontend-heavy Full-Stack roles, prioritizes approximately €90k+ when verified, and always generates a Turkish summary even if none are found.
2. **Do not claim or assume** the ChatGPT Automations runtime can HTTP POST a payload or invoke the app's private API. Verify supported export/integration capabilities before proposing automation. V1 must work without any new ChatGPT integration permission.
3. An imported item is **untrusted external research**, not a verified vacancy or a sent application. Preserve source attribution and original URL. Do not fabricate salary, date, location or eligibility; distinguish recruiter contact from machine-generated alerts.
4. No automated applications, no sending email, and no importing private Gmail message bodies. Never store recruiter personal contact information unless separately consented and needed.
5. Inbound API must be session-authenticated and tenant scoped using existing workspace authorization. Use Zod parsing with strict limits, explicit idempotency/deduplication, and Postgres ownership protection.
6. Reuse the current Job Hunter's matching, save/dismiss and notifications logic rather than creating a parallel job board. Imported items must be identifiable as `chatgpt_research` and be **reviewable before being treated as saved/applied**.
7. Follow existing repo conventions, keep secrets in server config, and include negative tests for malicious URLs, forged owners, duplicates, partial metadata, retries and unauthorized access.

## Relevant repository map (inspect again before modifying)

- `apps/my-dev-studio/app/studio/jobs/page.tsx`: Job Hunter entry page.
- `apps/my-dev-studio/app/api/jobs/route.ts`: protected GET/POST API using `requireWorkspace()`, `sameOrigin()`, `changeJobs()`, and request size limit.
- `apps/my-dev-studio/services/jobs/jobs-client.tsx`: UI client requests.
- `apps/my-dev-studio/services/jobs/get-workspace.ts`: workspace/domain orchestration.
- `packages/assistant/src/components/portfolio/jobs/`: Job Hunter UI.
- `packages/lib/src/services/jobs/`: discovery, matching and normalization logic; inspect exact module names first.
- `apps/my-dev-studio/app/api/jobs/linkedin/`: existing LinkedIn forwarding ingestion route, if present.
- `supabase/migrations/`: inspect newest migrations and actual job table schema before creating the next migration.
- `docs/testing/manual/job-hunter.md`: current local MVP workflow and configuration.
- `docs/testing/manual/linkedin-job-alerts.md`: existing email forwarding design; hosted relay still pending verification.
- `apps/my-dev-studio/e2e/studio/jobs/job-hunter.spec.ts`: UI regression coverage.
- `packages/lib/src/services/jobs/discovery.test.ts`, `apps/my-dev-studio/app/api/jobs/route.test.ts`, `supabase/tests/job-hunter.sql`: regression tests.

## Example import contract (finalize against existing domain types)

```ts
type JobResearchImportV1 = {
  schemaVersion: 1;
  report: {
    generatedAt: string; // ISO8601; untrusted
    source: "chatgpt_automation";
    automationTitle: string;
    summary: string;
  };
  jobs: Array<{
    title: string;
    company: string;
    originalUrl: string; // https only; known providers preferred
    location?: string;
    workModel?: "remote" | "hybrid" | "onsite" | "unknown";
    spainEligible?: boolean | null; // null = unverified
    postedAt?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryCurrency?: string | null;
    matchReason?: string;
    evidenceUrl?: string;
  }>;
};
```

Keep `jobs` at most 5 per report in V1. Recruiter-message summaries remain in the human-readable report, **not** in structured job records until a separate privacy/design review. Reject `javascript:`, `file:`, localhost/private-network URLs, non-http protocols, oversized fields and invalid timestamps. Treat external links as outbound links only, never server-side fetch arbitrary user-supplied URLs.

## Task 1: Validate feasibility and lock the import spec

**Files:** `docs/testing/manual/job-hunter.md`, `docs/testing/manual/linkedin-job-alerts.md`, current `packages/lib/src/services/jobs` models, and this plan.

- [ ] Read current job domain types, DB tables, RLS policies, API operations and UI state enums; note exact names before implementation.
- [ ] Verify whether scheduled ChatGPT task output has a supported machine-readable export or push connector. Record the evidence and supported auth model; do not assume a webhook exists.
- [ ] Specify user flow: open Job Hunter → import ChatGPT report → preview validation errors and candidate jobs → confirm import → review and save.
- [ ] Choose either existing raw/discovered listing representation or a separate pending-import staging table based on the current schema; document why, and preserve per-user ownership.
- [ ] Establish canonical deduplication: normalized original-provider job ID where available, otherwise validated canonical URL + owner; do not collapse distinct roles at the same company.
- [ ] Record the final request/response schema, rate/size limits, duplicate policy, PII policy, and failure UX in a brief design note alongside the code.
- [ ] Commit: `docs(jobs): lock ChatGPT report import contract`.

## Task 2: Implement validation and idempotent persistence (TDD)

**Files:** `packages/lib/src/services/jobs/chatgpt-import.ts` (new, or established jobs service path), `packages/lib/src/services/jobs/chatgpt-import.test.ts` (new), next `supabase/migrations/*` if needed, `supabase/tests/job-hunter.sql`.

- [ ] Write failing tests for schema version, zero jobs, maximum 5 jobs, missing optional salary, malformed URL, unsupported protocol, excessive length, duplicate candidates, malformed timestamp and rejected personally identifying fields.
- [ ] Run the smallest relevant Vitest command using repo scripts; confirm red tests.
- [ ] Implement Zod normalization and strictly typed import preview with field-specific errors.
- [ ] Write failing persistence tests for same-user retry, different-user isolation, provider ID/URL dedupe, partial success and source attribution.
- [ ] Run red tests; implement the minimal transaction / upsert using existing jobs repository patterns and ownership checks.
- [ ] Add migration and RLS test **only if** existing storage cannot represent import provenance or pending review safely; test authenticated owner vs another user and anonymous caller.
- [ ] Run unit and SQL tests; commit: `feat(jobs): persist validated ChatGPT research imports`.

## Task 3: Add protected import endpoint (TDD)

**Files:** `apps/my-dev-studio/app/api/jobs/import-chatgpt/route.ts` (new), `apps/my-dev-studio/app/api/jobs/import-chatgpt/route.test.ts` (new); reuse `requireWorkspace` / `sameOrigin`.

- [ ] Write failing tests for no session (401/403 following repo convention), cross-origin (403), invalid JSON (400), oversized payload (413), repeat import (idempotent), and safe error responses without payload leaks.
- [ ] Run tests red; implement authenticated preview/commit operations that call Task 2's service; ensure only server-side identity sets `owner_id`.
- [ ] Apply a bounded body size and any existing rate limit primitives; never accept a client-supplied owner or secret.
- [ ] Run route tests green and relevant existing `/api/jobs` tests; commit: `feat(jobs): expose authenticated ChatGPT import API`.

## Task 4: Add Job Hunter import and review UI (TDD)

**Files:** `packages/assistant/src/components/portfolio/jobs/` (new small import component), `apps/my-dev-studio/services/jobs/jobs-client.tsx`, `apps/my-dev-studio/e2e/studio/jobs/job-hunter.spec.ts`.

- [ ] Write failing component/E2E coverage for paste JSON, preview 0–5 candidates, schema errors, duplicate labels, confirmation, and resulting Discover or review inbox state.
- [ ] Run red test; implement `Import ChatGPT report` in existing Job Hunter UI patterns and accessible keyboard interactions.
- [ ] Show `ChatGPT research · unverified`, source URL, unknown salary indicators and local import time; never present model-reported claims as provider verification.
- [ ] Reuse existing save, dismiss, CV match and application tracking states. Import alone must never mark an application submitted.
- [ ] Run unit and E2E tests on desktop/mobile; commit: `feat(jobs): review ChatGPT research in Job Hunter`.

## Task 5: Provide an automation-safe export and notifications policy

**Files:** `docs/testing/manual/job-hunter.md`, new `docs/testing/manual/chatgpt-job-import.md`, existing notification tests/services only if behavior changes.

- [ ] Document a copyable, human-reviewed JSON instruction to append to the ChatGPT job-search automation: valid `schemaVersion: 1` object, ≤5 roles, no fabricated values, no private recruiter message bodies, zero results allowed.
- [ ] Do not silently alter the live ChatGPT automation until the app import schema is implemented, tested and the user approves the change.
- [ ] Keep a simple manual copy/paste MVP. Describe optional future assisted transfer only with documented, supported APIs or mail relay; never store ChatGPT tokens or scrape task UI.
- [ ] Deduplicate notifications per user and canonical job key; notify only on genuinely new matching results above existing thresholds. No notification for report with zero new jobs; always retain import/report history for visibility.
- [ ] Add tests for notification retry and duplicate suppression **if** modifying notifications.
- [ ] Run existing job checks and document setup plus rollback; commit: `docs(jobs): document ChatGPT job report import and rollout`.

## Verification and release gates

- [ ] All new service/route unit tests green; existing Job Hunter tests still green.
- [ ] SQL RLS checks confirm tenant isolation; browser checks confirm signed-out and second-account denial.
- [ ] Playwright tests cover mobile/desktop paste → preview → import → review → save and duplicate reimport.
- [ ] Imported 5-job fixture renders safely; empty report is accepted and recorded; 6 jobs is rejected.
- [ ] Running the same report twice creates no duplicate jobs or alerts.
- [ ] Unsafe links, oversized data, forged identity and malformed JSON are rejected without exposing internals.
- [ ] Live-provider tests run only in disposable staging against authorized credentials; no real recruiter data in fixtures.
- [ ] Feature flag or UI gating allows rollback to existing Job Hunter without deleting imported records.
- [ ] Update docs and obtain approval before turning on production imports or changing automation instructions.

## Review Focus

- [ ] Distinct opportunities with similar company/title do not accidentally merge.
- [ ] Provider links with tracking parameters dedupe without stripping meaningful identity parameters.
- [ ] Imported research isn't mistaken for verified salary, legal eligibility or direct recruiter correspondence.
- [ ] Cross-account duplicates remain separately owned and invisible across tenants.
- [ ] Partial failures/retries do not create duplicate in-app/browser notifications.

## Out of scope for V1

Direct autonomous ChatGPT webhook delivery, Gmail inbox body import, applications sent on user's behalf, recruiter contact sync, scraping LinkedIn, new job providers, or replacing the current scheduled discovery worker.

## Implementation handoff

Review this plan before execution. Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`; implement one tested commit at a time. Do not merge infrastructure/security changes without review.
