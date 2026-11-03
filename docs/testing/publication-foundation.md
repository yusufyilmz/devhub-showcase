# Publication, revision review and output privacy

This group covers roadmap tasks 07, 10 and 28. Draft/public snapshot separation, explicit publishing with before/after review, manager history and output projections are implemented. Verification and release requirements are recorded below. No production migrations have been applied.

## Implemented checkpoint

`20261103120000_private_profile_history.sql` records saved profile revisions in an owner/authorized-manager-only table. It keeps at most 20 revisions per profile and hides entries older than 90 days. Expired rows are physically removed on the next profile write. Access follows the current portfolio owner/manager, not a historical creator. Clients receive SELECT only; snapshot creation and pruning occur through a trigger. No production migration has been applied.

`GET /api/profile-history` lists timestamps/revision numbers for the authenticated workspace. `?revision=N` reads one compatible snapshot. Missing/expired entries return 404, incompatible documents return 409, unauthenticated access returns 403, and storage errors leave the draft unchanged. This endpoint does not restore, save or publish anything. A forged profile query parameter cannot change the workspace identity.

Saved profile writes now update only the private canonical document. The legacy `isPublic` save input is accepted but cannot change publication. Owners and current authorized managers publish or withdraw using a separate revision-checked action. The publication review shows the before/after data for both public outputs. Each private CV version also has independent contact-field controls.

## Owner review and output controls

The owner editor now has Revision history and Field visibility tabs. History inspection captures the current draft and saved revision; a changed draft/revision blocks restore until inspected again. Explicit restore updates only the local draft. No history operation writes or publishes the profile.

Structured website and CV contact flags are stored independently. The CV controls remain aligned with the older email/phone settings. Publishable projection helpers remove excluded values, hidden/selected records, private projects, dormant custom-source items, birthdate and private CV URLs. Visitor chat and PDF data creation now use these projections. Public pages, discovery, visitor chat and public CV routes read explicit output snapshots; anonymous reads of canonical profile documents are revoked. Private draft preview uses the website projection. The AI knowledge inspector shows private saved and public published revisions separately.

These flags do not scrub arbitrary text or images authored by the owner. Contact details repeated in prose/media must be reviewed separately.

## Additional owner UI steps

| Step | Clickable URL                                            | Route path         | Action                                                       | Expected result                                                             |
| ---- | -------------------------------------------------------- | ------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 5    | [Editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Open Field visibility and exclude website email.             | CV email remains independently enabled; nothing saves automatically.        |
| 6    | [Editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Exclude CV phone, then open PDF.                             | The existing Include phone checkbox agrees with the CV field choice.        |
| 7    | [Editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Open Revision history, choose an entry and Inspect revision. | Before/after data is reviewable; no draft mutation or save.                 |
| 8    | [Editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Restore the reviewed entry, then inspect Profile.            | Earlier data enters the local draft only; no automatic save or publication. |

## Checkpoint checks

Use a disposable account and PR preview hostname. Replace test-owner with the account's username. The links below identify routes; they do not prove production deployment.

| Step | Clickable URL                                                             | Route path                        | Action                                                               | Expected result                                                    |
| ---- | ------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1    | [History](https://mydevstudio.vercel.app/api/profile-history)             | `/api/profile-history`            | Request while signed out.                                            | Access denied; no revision content.                                |
| 2    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)                  | `/test-owner/edit`                | In a disposable migrated environment, save several revisions.        | Private history rows are created; ordinary conflict checks remain. |
| 3    | [History](https://mydevstudio.vercel.app/api/profile-history)             | `/api/profile-history`            | Request while signed in to the disposable account.                   | Only its current workspace's revision metadata is returned.        |
| 4    | [Revision](https://mydevstudio.vercel.app/api/profile-history?revision=1) | `/api/profile-history?revision=1` | Inspect a listed revision; try missing/expired/incompatible records. | Compatible content only; safe 404/409 for unusable revisions.      |

Local PGlite tests verify owner/manager isolation, anonymous denial, direct-write denial, retention counts and expiry. Route tests verify workspace scoping and safe errors. Owner desktop/mobile fixture tests additionally cover independent contact choices and explicit restore with zero profile writes. Final group checks must also cover draft versus public pages/PDF/chat, explicit publication, stale publishing, restoration into draft only and excluded-field payloads.

## Publication storage and rollout

`20261103130000_publication_snapshots.sql` introduces read-only public website and CV snapshot tables. Existing published documents are projected into these tables during migration. A security-definer function authorizes the current owner or current manager, locks the canonical revision, and atomically publishes or withdraws both outputs. It rejects stale/null revisions and unauthorized identities. Direct authenticated updates of `is_public` are revoked. Username changes remain private until publication.

The private-history migration and publication migration must accompany this app version, after the earlier CV library migration if using its editor tab. Use a disposable database first. Coordinate the migration and app release: older app instances still reading the canonical public table will fail closed once its anonymous access is removed. Do not run this draft migration against production from this task. Storage failures never fall back to another person's bundled profile.

Review the migration using local database tests, then verify both owner and manager paths in a disposable preview. A public CV and website are independent outputs: hiding a field on one does not hide it on the other. Withdrawal removes both public snapshots; personal saved CVs and private variant downloads remain available to their authorized owner. Existing downloaded copies cannot be withdrawn.

## Publication journey

Use a disposable account and replace the hostname with the PR preview. These production-shaped links identify paths; they do not claim deployment.

| Step | Clickable URL                                                                    | Route path                        | Action                                                                                             | Expected result                                                                                        |
| ---- | -------------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 9    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)                         | `/test-owner/edit`                | Change name and website/CV contact visibility, then Save changes.                                  | Saved draft changes; the public website and CV keep their previous snapshots.                          |
| 10   | [Editor](https://mydevstudio.vercel.app/test-owner/edit)                         | `/test-owner/edit`                | Open Preview, then Review publication and Confirm publication.                                     | Only permitted fields are published at the confirmed saved revision. Dirty drafts cannot be published. |
| 11   | [Website](https://mydevstudio.vercel.app/test-owner)                             | `/test-owner`                     | Open signed out and inspect page payload/contact links.                                            | Excluded website fields, private projects and hidden records are absent from public data.              |
| 12   | [CV](https://mydevstudio.vercel.app/test-owner/cv.pdf)                           | `/test-owner/cv.pdf`              | Download signed out.                                                                               | Uses independent CV field choices from the last published CV snapshot.                                 |
| 13   | [Editor](https://mydevstudio.vercel.app/test-owner/edit)                         | `/test-owner/edit`                | Save a different username; check the existing share link before publishing again.                  | Old published URL keeps working; the new URL stays unavailable until confirmed publication.            |
| 14   | [Publication](https://mydevstudio.vercel.app/api/publication)                    | `/api/publication`                | Submit a stale revision, forged identity/document or unauthenticated publication request.          | Conflict, validation or authorization error; no public snapshot changes.                               |
| 15   | [Editor](https://mydevstudio.vercel.app/test-owner/edit)                         | `/test-owner/edit`                | Withdraw public website and CV, then revisit both signed out.                                      | Both public routes return 404; private saved work remains.                                             |
| 16   | [Managed editor](https://mydevstudio.vercel.app/admin/portfolios/PROFILE_ID)     | `/admin/portfolios/PROFILE_ID`    | As its current authorized manager, inspect history, restore to draft, save and explicitly publish. | History and publication are scoped to that managed record; restore never publishes automatically.      |
| 17   | [Managed history](https://mydevstudio.vercel.app/api/managed/PROFILE_ID/history) | `/api/managed/PROFILE_ID/history` | After transfer or manager revocation, request the old managed history and publication endpoints.   | Access denied; no historical or draft records leak.                                                    |

## Verification results

Local verification for this group passed: `pnpm check`, 472 unit tests (439 shared/app and 33 fitness), the production app build, and all 198 desktop/mobile browser tests. Database tests execute the migration in PGlite and exercise owner/current-manager authorization, direct-write denial, independent projection parity, stale/null revisions and withdrawal. Browser tests use disposable local transport fixtures, not production accounts or a deployed Supabase migration. Production rollout and real-account post-deployment verification remain outstanding.
