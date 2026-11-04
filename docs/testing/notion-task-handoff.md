# Notion task testing handoff

The user requested a How to test section inside each implemented task, with clickable URLs, matching route paths, prerequisites, exact actions, expected results, actual evidence and links to its guide/PR. AGENTS.md now requires this for subsequent task handoffs.

Task 04 was updated and read back successfully with eleven test steps. Notion then rejected new blocks because the workspace reached its free block limit. Do not automatically retry this entitlement failure. Existing task requirements/statuses were preserved; no task was marked Done from this documentation update.

The remaining sections were prepared from the dedicated guides below. Once the user resolves the workspace limit, fetch each task, inspect for an existing How to test section, then update or append only the missing material. Preserve manual outcomes as Not run until executed. Use the actual PR preview hostname when testing; production-shaped links identify routes rather than prove deployment.

| Task                                | Notion page                                                          | Guide                                    | Notion write                  |
| ----------------------------------- | -------------------------------------------------------------------- | ---------------------------------------- | ----------------------------- |
| 04. Critical journey tests          | [Open task](https://app.notion.com/40bbddaed4fe81079ae9d6363d70efe0) | [Steps](manual/ci-build.md)              | Added and verified            |
| 05. Guided onboarding               | [Open task](https://app.notion.com/40bbddaed4fe818a92c0f0ecaa36615c) | [Steps](manual/onboarding.md)            | Pending workspace block limit |
| 06. Completion checklist            | [Open task](https://app.notion.com/40bbddaed4fe81b99206d807d3849b6a) | [Steps](manual/completion.md)            | Pending workspace block limit |
| 07. Draft and publication controls  | [Open task](https://app.notion.com/40bbddaed4fe81c783d9cd0f9a16b70f) | [Steps](manual/publication.md)           | Pending workspace block limit |
| 08. Autosave and recovery           | [Open task](https://app.notion.com/40bbddaed4fe8172a1b9efcf27af8048) | [Steps](manual/draft-recovery.md)        | Pending workspace block limit |
| 09. Undo and redo                   | [Open task](https://app.notion.com/40bbddaed4fe81c09aa6ce63bb28b81e) | [Steps](manual/undo-redo.md)             | Pending workspace block limit |
| 10. Revision history                | [Open task](https://app.notion.com/40bbddaed4fe81b8bc42e2347c84cdc7) | [Steps](manual/revision-history.md)      | Pending workspace block limit |
| 11. Responsive editor previews      | [Open task](https://app.notion.com/40bbddaed4fe81f2a1c8dedb8fbef50d) | [Steps](manual/responsive-preview.md)    | Pending workspace block limit |
| 12. Curated portfolio templates     | [Open task](https://app.notion.com/40bbddaed4fe81349c9fd895c8505048) | [Steps](manual/curated-templates.md)     | Pending workspace block limit |
| 14. Username redirects              | [Open task](https://app.notion.com/40bbddaed4fe81ea976ee3f3a8cac331) | [Steps](manual/username-redirects.md)    | Pending workspace block limit |
| 15. Portfolio visibility controls   | [Open task](https://app.notion.com/40bbddaed4fe81ba9b09f272efa5f77f) | [Steps](manual/password-access.md)       | Pending workspace block limit |
| 16. Scheduled publishing            | [Open task](https://app.notion.com/40bbddaed4fe813fbad8cb480bdcafce) | [Steps](manual/scheduled-publication.md) | Pending workspace block limit |
| 17. AI change review                | [Open task](https://app.notion.com/40bbddaed4fe81e79b16e2253db408b4) | [Steps](manual/ai-review.md)             | Pending workspace block limit |
| 18. AI writing assistant            | [Open task](https://app.notion.com/40bbddaed4fe811db6add478b728f3c8) | [Steps](manual/ai-writing.md)            | Pending workspace block limit |
| 20. AI portfolio feedback           | [Open task](https://app.notion.com/40bbddaed4fe81a19052c1b6579bae8c) | [Steps](manual/ai-feedback.md)           | Pending workspace block limit |
| 21. Visitor chat improvements       | [Open task](https://app.notion.com/40bbddaed4fe8116b222e5e197bd52fb) | [Steps](manual/visitor-chat.md)          | Pending workspace block limit |
| 25. Multiple CV versions            | [Open task](https://app.notion.com/40bbddaed4fe81aaa32afe4852d0b013) | [Steps](manual/cv-versions.md)           | Pending workspace block limit |
| 26. Job specific CV drafts          | [Open task](https://app.notion.com/40bbddaed4fe8125acf6d57b0ec8500a) | [Steps](manual/job-cv.md)                | Pending workspace block limit |
| 27. ATS friendly CV layouts         | [Open task](https://app.notion.com/40bbddaed4fe81a29e8dd23d00a6394d) | [Steps](manual/cv-layouts.md)            | Pending workspace block limit |
| 28. Portfolio and CV field controls | [Open task](https://app.notion.com/40bbddaed4fe81c7bdd5e8c18ffb5e3d) | [Steps](manual/output-fields.md)         | Pending workspace block limit |
| 30. Media integration improvements  | [Open task](https://app.notion.com/40bbddaed4fe815180a3ee3aac472f8f) | [Steps](manual/media.md)                 | Pending workspace block limit |

## Reliability group follow-up

Task [01 — Billing reliability](https://app.notion.com/40bbddaed4fe81bb9c77ee4e54b1a82b) and task 02 are In Review with [PR #88](https://github.com/yusufyilmz/devhub-showcase/pull/88). This branch implements its remaining guidance/event gaps and adds actual PostgreSQL contention coverage shared with [02 — AI usage reliability](https://app.notion.com/40bbddaed4fe81fc8702c165a6be08be). Their task-body testing sections must link the [billing reliability guide](manual/billing-reliability.md) once the Notion workspace block limit is resolved. No content-creation retry was attempted for this group. Existing PR #59/#60 AI cancellation/UI work is retained.

## Monitoring group follow-up

[03 — Production monitoring](https://app.notion.com/40bbddaed4fe81daad66f72a6974569d) now has request correlation, safe operation events and an optional collector implementation on `feat/operation-monitoring`, stacked on PR #88. Add its [manual testing section](manual/operation-monitoring.md) to the task once the workspace block limit is resolved. Hosted receiver/alert receipt remains Not run. Existing task content was preserved; no new content-write retry was attempted.

## Account support follow-up

[32 — Account support dashboard](https://app.notion.com/40bbddaed4fe81fba324dbd1a833c235) has a metadata-only dashboard and atomic audited chat-disable action on `feat/account-support`, stacked on PR #89. Its [manual guide](manual/account-support.md) is ready for the task-body How-to-test section after the workspace block limit is resolved. No content-write retry was attempted. Task 34 remains pending its own operation registry/retry implementation; no production migration was applied.
