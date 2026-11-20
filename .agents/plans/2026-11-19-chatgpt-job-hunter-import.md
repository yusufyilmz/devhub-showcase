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

## Progress update (PR #174, 2026-11-19)

**Completed checklist items are marked [x] only when the full wording is supported by code or documentation.** This is a progress record, not a release sign-off.

**Implemented but not yet fully validated:** versioned JSON validation and URL normalization; user-scoped idempotent upserts; same-origin, authenticated import endpoint; preview-and-confirm UI; parser, API, service, and PGlite tests. Browser confirmation of the signed-in paste flow is still open.

**Outstanding:** Playwright was run for `e2e/studio/jobs/job-hunter.spec.ts` on desktop and mobile. The signed-out redirect passed. Signed-in tests, including the homepage profile menu, stayed on the public welcome screen, so the paste flow was not confirmed in the browser. Production migration, live-provider checks, and approval to change the ChatGPT automation remain undone. Do not merge or deploy from local unit tests alone.

**2026-11-21 session:** OpenAI's help center documents consumer scheduled tasks as chat results, with event triggers only for Gmail, Slack and GitHub, and excludes those tasks from personal data exports. The Agents API is a separate key-based product. V1 stays copy/paste. Imports stay in `job_listings` / `job_matches` (`chatgpt_research`, state `new`, null score, null `notified_at`). Report history is `job_import_reports`. Deduping hashes the canonical URL after dropping tracking parameters and sorting the remaining query. `JOBS_CHATGPT_IMPORT=false` hides the form and returns 404. Redis limits hosted imports to 20 per account each hour and 500 per day.

## Task 1: Validate feasibility and lock the import spec

**Files:** `docs/testing/manual/job-hunter.md`, `docs/testing/manual/linkedin-job-alerts.md`, current `packages/lib/src/services/jobs` models, and this plan.

- [x] Read current job domain types, DB tables, RLS policies, API operations and UI state enums; note exact names before implementation.
- [x] Verify whether scheduled ChatGPT task output has a supported machine-readable export or push connector. Record the evidence and supported auth model; do not assume a webhook exists. Evidence: docs/testing/manual/chatgpt-job-import.md cites OpenAI help and the Agents API; no consumer webhook is used.
- [x] Specify user flow: open Job Hunter → import ChatGPT report → preview validation errors and candidate jobs → confirm import → review and save.
- [x] Choose either existing raw/discovered listing representation or a separate pending-import staging table based on the current schema; document why, and preserve per-user ownership. Evidence: existing listing/match rows plus `job_import_reports`; no staging table.
- [x] Establish canonical deduplication: normalized original-provider job ID where available, otherwise validated canonical URL + owner; do not collapse distinct roles at the same company. Evidence: `chatgpt-import.test.ts` keeps two URLs at one company and sorts identity query parameters.
- [x] Record the final request/response schema, rate/size limits, duplicate policy, PII policy, and failure UX in a brief design note alongside the code. Evidence: contract section in docs/testing/manual/chatgpt-job-import.md.
- [ ] Commit: `docs(jobs): lock ChatGPT report import contract`.

## Task 2: Implement validation and idempotent persistence (TDD)

**Files:** `packages/lib/src/services/jobs/chatgpt-import.ts` (new, or established jobs service path), `packages/lib/src/services/jobs/chatgpt-import.test.ts` (new), next `supabase/migrations/*` if needed, `supabase/tests/job-hunter.sql`.

- [x] Write failing tests for schema version, zero jobs, maximum 5 jobs, missing optional salary, malformed URL, unsupported protocol, excessive length, duplicate candidates, malformed timestamp and rejected personally identifying fields. Evidence: `packages/lib/src/services/jobs/chatgpt-import.test.ts`.
- [x] Run the smallest relevant Vitest command using repo scripts; confirm red tests. Evidence: field-error and query-order assertions failed, then passed, on 2026-11-21.
- [x] Implement Zod normalization and strictly typed import preview with field-specific errors. Evidence: `chatgptImportIssues`.
- [x] Write failing persistence tests for same-user retry, different-user isolation, provider ID/URL dedupe, partial success and source attribution. Evidence: `apps/my-dev-studio/services/jobs/import-chatgpt.test.ts`.
- [x] Run red tests; implement the minimal transaction / upsert using existing jobs repository patterns and ownership checks. Evidence: per-job upsert with `ignoreDuplicates`; a failed later match leaves the earlier job and the retry does not duplicate it. History is written only after the batch succeeds.
- [x] Add migration and RLS test **only if** existing storage cannot represent import provenance or pending review safely; test authenticated owner vs another user and anonymous caller. Evidence: provenance fits existing tables; `20261121033000_chatgpt_job_import_reports.sql` stores report history. `packages/lib/src/db/rls/chatgpt-job-import.test.ts` passed.
- [ ] Run unit and SQL tests; commit: `feat(jobs): persist validated ChatGPT research imports`. Unit and PGlite checks passed. Commit is still open with the later tasks.

## Task 3: Add protected import endpoint (TDD)

**Files:** `apps/my-dev-studio/app/api/jobs/import-chatgpt/route.ts` (new), `apps/my-dev-studio/app/api/jobs/import-chatgpt/route.test.ts` (new); reuse `requireWorkspace` / `sameOrigin`.

- [x] Write failing tests for no session (401/403 following repo convention), cross-origin (403), invalid JSON (400), oversized payload (413), repeat import (idempotent), and safe error responses without payload leaks. Evidence: route tests use 403 for a missing session, reject forged fields without echoing them, and persistence tests cover repeat imports.
- [x] Run tests red; implement authenticated preview/commit operations that call Task 2's service; ensure only server-side identity sets `owner_id`. Evidence: route tests failed at 200, then passed. The workspace id is the only owner.
- [x] Apply a bounded body size and any existing rate limit primitives; never accept a client-supplied owner or secret. Evidence: 20,000 character body and `allowJobResearchImport`.
- [ ] Run route tests green and relevant existing `/api/jobs` tests; commit: `feat(jobs): expose authenticated ChatGPT import API`. Targeted Vitest passed, including `app/api/jobs/route.test.ts`. Commit is still open.

## Task 4: Add Job Hunter import and review UI (TDD)

**Files:** `packages/assistant/src/components/portfolio/jobs/` (new small import component), `apps/my-dev-studio/services/jobs/jobs-client.tsx`, `apps/my-dev-studio/e2e/studio/jobs/job-hunter.spec.ts`.

- [ ] Write failing component/E2E coverage for paste JSON, preview 0–5 candidates, schema errors, duplicate labels, confirmation, and resulting Discover or review inbox state.
- [ ] Run red test; implement `Import ChatGPT report` in existing Job Hunter UI patterns and accessible keyboard interactions.
- [x] Show `ChatGPT research · unverified`, source URL, unknown salary indicators and local import time; never present model-reported claims as provider verification. Evidence: preview copy and Discover card in the jobs dashboard. Browser confirmation is still open.
- [x] Reuse existing save, dismiss, CV match and application tracking states. Import alone must never mark an application submitted. Evidence: persistence test rejects `job_applications` and `job_push_deliveries` writes and keeps score null. Import does not run CV scoring, so an unscored research row cannot cross an alert threshold. The existing Prepare with CV action remains available after review.
- [ ] Run unit and E2E tests on desktop/mobile; commit: `feat(jobs): review ChatGPT research in Job Hunter`.

## Task 5: Provide an automation-safe export and notifications policy

**Files:** `docs/testing/manual/job-hunter.md`, new `docs/testing/manual/chatgpt-job-import.md`, existing notification tests/services only if behavior changes.

- [x] Document a copyable, human-reviewed JSON instruction to append to the ChatGPT job-search automation: valid `schemaVersion: 1` object, ≤5 roles, no fabricated values, no private recruiter message bodies, zero results allowed.
- [x] Do not silently alter the live ChatGPT automation until the app import schema is implemented, tested and the user approves the change.
- [x] Keep a simple manual copy/paste MVP. Describe optional future assisted transfer only with documented, supported APIs or mail relay; never store ChatGPT tokens or scrape task UI.
- [x] Deduplicate notifications per user and canonical job key; notify only on genuinely new matching results above existing thresholds. No notification for report with zero new jobs; always retain import/report history for visibility. Evidence: imports leave `notified_at` null and do not enqueue push deliveries. Empty, new, and duplicate reports each insert one history row.
- [x] Add tests for notification retry and duplicate suppression **if** modifying notifications. Evidence: the notification sender was not changed. Import tests cover a failed match retry and a duplicate reimport without a second job or an alert timestamp.
- [ ] Run existing job checks and document setup plus rollback; commit: `docs(jobs): document ChatGPT job report import and rollout`.

## Verification and release gates

- [x] All new service/route unit tests green; existing Job Hunter tests still green. Evidence: targeted Vitest on 2026-11-21, including the import parser, persistence, route, limiter, discovery, and Job Hunter PGlite tests.
- [ ] SQL RLS checks confirm tenant isolation; browser checks confirm signed-out and second-account denial.
- [ ] Playwright tests cover mobile/desktop paste → preview → import → review → save and duplicate reimport.
- [ ] Imported 5-job fixture renders safely; empty report is accepted and recorded; 6 jobs is rejected.
- [x] Running the same report twice creates no duplicate jobs or alerts. Evidence: persistence test, second import `imported: 0`, `notified_at` stays null.
- [x] Unsafe links, oversized data, forged identity and malformed JSON are rejected without exposing internals. Evidence: parser and route tests on 2026-11-21.
- [ ] Live-provider tests run only in disposable staging against authorized credentials; no real recruiter data in fixtures.
- [x] Feature flag or UI gating allows rollback to existing Job Hunter without deleting imported records. Evidence: `JOBS_CHATGPT_IMPORT=false` returns 404 and the page omits the form. Records are not deleted. Browser confirmation is still open.
- [ ] Update docs and obtain approval before turning on production imports or changing automation instructions.

## Review Focus

- [x] Distinct opportunities with similar company/title do not accidentally merge. Evidence: two URLs at one company keep two keys.
- [x] Provider links with tracking parameters dedupe without stripping meaningful identity parameters. Evidence: `utm_*` is removed, `jobId` and `ref` remain, and parameter order does not change the key.
- [x] Imported research isn't mistaken for verified salary, legal eligibility or direct recruiter correspondence. Evidence: card and explanation copy say unverified; recruiter fields are rejected.
- [x] Cross-account duplicates remain separately owned and invisible across tenants. Evidence: persistence isolation test and `chatgpt-job-import` PGlite RLS test.
- [x] Partial failures/retries do not create duplicate in-app/browser notifications. Evidence: a failed second match retries to two owned rows and does not set `notified_at`.

## Out of scope for V1

Direct autonomous ChatGPT webhook delivery, Gmail inbox body import, applications sent on user's behalf, recruiter contact sync, scraping LinkedIn, new job providers, or replacing the current scheduled discovery worker.

## Implementation handoff

Review this plan before execution. Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`; implement one tested commit at a time. Do not merge infrastructure/security changes without review.
