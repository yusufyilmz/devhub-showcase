# Private CV versions and evidence-based job drafts

Tasks 25 and 26 use a separate account-private library. No CV variant or job description is stored in the published portfolio document. Versions are independent snapshots, with their own title, summary, experience/project selection, section order, language and layout. Creating or saving a version does not save, publish or replace the portfolio or public CV.

Source updates never propagate automatically. Create a fresh version from the current profile to use newer content, leaving previous versions intact. Duplicate a version before removing items you may want to reuse. The maximum is eight versions per account and a 2 MB serialized library. Saves use an independent library revision; conflicts preserve local edits for review and retry. Stay on the screen if saving fails: this library does not yet have browser draft recovery.

Job tailoring uses local, transparent keyword matches against the selected snapshot's existing experience and project text. It makes no provider requests, generates no new qualifications and does not promise that requirements are satisfied. All matches start unchecked. Explicit selection creates a new independent version; saving remains separate. Sparse or unrelated descriptions produce no matches. The source CV and portfolio stay unchanged.

## Setup

Apply `supabase/migrations/20261103110000_private_cv_variants.sql` through the normal reviewed migration process before enabling the library on a deployment. This migration has not been applied to production by this task. It adds an owner-only table, revokes anonymous privileges and enables per-operation row policies. No new environment variables or paid AI configuration is needed. Missing storage shows an unavailable state while the ordinary editor remains usable. Managers do not use another owner's CV library from a managed portfolio editor.

The API derives identity from a verified confirmed session. `GET /api/cv-variants`, `PUT /api/cv-variants` and `GET /api/cv-variants/{id}/pdf` never accept another owner as authority. Public portfolio and CV routes do not expose versions. Authentication, database policies, request size and revision checks all apply. See the official [Supabase row policy guide](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Manual checks

Replace test-owner with a disposable account and use these paths on the PR preview host. Production links identify screens, not verification of unreleased changes. Perform migration and entitlement-independent checks only in a disposable test environment.

| Step | Clickable URL                                                     | Route path         | Action                                                                                                    | Expected result                                                                  |
| ---- | ----------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)          | `/test-owner/edit` | Open CV versions and create a fresh version.                                                              | Independent snapshot; portfolio remains unchanged.                               |
| 2    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)          | `/test-owner/edit` | Change its name/title/summary, language, layout and export order; exclude an item.                        | Only this version changes. Download stays unavailable until saved.               |
| 3    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)          | `/test-owner/edit` | Save CV versions, duplicate one and change the copy.                                                      | Original version retains its content and settings.                               |
| 4    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)          | `/test-owner/edit` | Reload and download each saved version.                                                                   | Saved content/order/language/layout match each chosen version.                   |
| 5    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)          | `/test-owner/edit` | Paste a relevant job description, review matching terms, select evidence and create the reviewed version. | No item is selected automatically; only existing facts enter a separate version. |
| 6    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)          | `/test-owner/edit` | Try unrelated requirements or instructions asking to publish or access another account.                   | No fabricated qualifications, publication or cross-account reads.                |
| 7    | [Private library](https://mydevstudio.vercel.app/api/cv-variants) | `/api/cv-variants` | Open signed out, then with another disposable account.                                                    | Signed-out access denied; other account sees only its own versions.              |
| 8    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)          | `/test-owner/edit` | Save conflicting edits from two tabs.                                                                     | Stale save returns a conflict; local edits remain on screen for recovery.        |
| 9    | [Public portfolio](https://mydevstudio.vercel.app/test-owner)     | `/test-owner`      | Compare public page and public CV before and after private version saves.                                 | Neither changes and no private versions appear.                                  |

Local browser tests simulate library responses; database isolation is tested against local PGlite policies. Neither proves a production migration has run. Real deployment migration, direct authenticated PDF downloads and live multi-account smoke checks remain deployment verification steps.
