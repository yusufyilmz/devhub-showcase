# Publication foundation — work in progress

This group covers roadmap tasks 07, 10 and 28. It is not ready to merge. Public/draft snapshot separation, field controls, history review/restore UI and their full browser journeys remain to be implemented.

## Implemented checkpoint

`20261103120000_private_profile_history.sql` records saved profile revisions in an owner/authorized-manager-only table. It keeps at most 20 revisions per profile and hides entries older than 90 days. Expired rows are physically removed on the next profile write. Access follows the current portfolio owner/manager, not a historical creator. Clients receive SELECT only; snapshot creation and pruning occur through a trigger. No production migration has been applied.

`GET /api/profile-history` lists timestamps/revision numbers for the authenticated workspace. `?revision=N` reads one compatible snapshot. Missing/expired entries return 404, incompatible documents return 409, unauthenticated access returns 403, and storage errors leave the draft unchanged. This endpoint does not restore, save or publish anything. A forged profile query parameter cannot change the workspace identity.

The current save/publication behavior is unchanged at this checkpoint. Do not interpret this as completion of draft/public separation or field privacy. The migration must ship together with the remaining reviewed group, not as an instruction to apply it immediately.

## Checkpoint checks

Use a disposable account and PR preview hostname. Replace test-owner with the account's username. The links below identify routes; they do not prove production deployment.

| Step | Clickable URL                                                             | Route path                        | Action                                                               | Expected result                                                    |
| ---- | ------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1    | [History](https://mydevstudio.vercel.app/api/profile-history)             | `/api/profile-history`            | Request while signed out.                                            | Access denied; no revision content.                                |
| 2    | [Editor](https://mydevstudio.vercel.app/test-owner/edit)                  | `/test-owner/edit`                | In a disposable migrated environment, save several revisions.        | Private history rows are created; ordinary conflict checks remain. |
| 3    | [History](https://mydevstudio.vercel.app/api/profile-history)             | `/api/profile-history`            | Request while signed in to the disposable account.                   | Only its current workspace's revision metadata is returned.        |
| 4    | [Revision](https://mydevstudio.vercel.app/api/profile-history?revision=1) | `/api/profile-history?revision=1` | Inspect a listed revision; try missing/expired/incompatible records. | Compatible content only; safe 404/409 for unusable revisions.      |

Local PGlite tests verify owner/manager isolation, anonymous denial, direct-write denial, retention counts and expiry. Route tests verify workspace scoping and safe errors. Final group checks must also cover draft versus public pages/PDF/chat, explicit publication, stale publishing, restoration into draft only and excluded-field payloads.
