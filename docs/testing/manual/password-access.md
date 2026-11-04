# Password-protected access — task 15 preparation

**Scope/status:** Work in progress. Database access rules, password hashing and signed-grant utilities are prepared and tested locally. Owner publication controls, the visitor password screen/API and all route integrations remain unfinished. The app still rejects the password visibility value. Do not deploy the password migration as a completed feature.

**Prerequisites:** Use a disposable database with the publication/alias/visibility/scheduling migrations. The password migration is `20261104094250_password_protected_publications.sql`; it has not been applied to production. Use fictional profile documents and passwords. Follow the [shared setup rules](index.md#before-you-start).

**Manual result:** Not run. Automated local PGlite/crypto checks are separate evidence; they do not prove a deployed password flow.

| Step | Clickable URL                                                           | Route path                     | Action                                                                                                                                                                     | Expected result                                                                                                                                                | Actual result / evidence |
| ---- | ----------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new) | `/dashboard/project/_/sql/new` | Select a disposable test project, apply prerequisites and the password migration, then publish a fictional protected fixture using its owner role and a valid test digest. | Website and CV snapshots exist together. No plaintext password is stored in their documents.                                                                   | Not run                  |
| 2    | [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new) | `/dashboard/project/_/sql/new` | In that disposable database, read both snapshot tables as anonymous, unrelated authenticated and owner roles. Attempt direct reads of the password table and record RPC.   | Anonymous/unrelated roles see no protected documents or password record; owner review remains available.                                                       | Not run                  |
| 3    | [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new) | `/dashboard/project/_/sql/new` | Test server-role reads with the current access version, republish/withdraw or transfer, then retry the old version. Test the persistent attempt limiter.                   | Old grants cannot read new/revoked snapshots. Withdrawal/transfer removes password records. Ordinary app roles cannot invoke privileged reads or limiter RPCs. | Not run                  |

## Remaining work before review

- Owner password entry in explicit publication review, with revision/permission checks and secure hashing.
- Visitor verification endpoint, signed HttpOnly cookie issuance, throttling and a shared-library password screen.
- Page, metadata, named/legacy PDF, icon/share-image and chat route checks that cannot bypass access verification.
- Rotation, expiry, transfer, withdrawal, unknown/private names, anonymous Data API and direct URL browser tests.
- Separate public/unlisted/scheduling regressions and deployed configuration instructions.

Server grants use a key derived with a distinct signing domain from the server-only Supabase service credential. They bind one portfolio, its publication access version and a one-hour expiry. Database reads recheck the version atomically. Republish revokes earlier grants; transfer/withdrawal removes the current password record. No extra browser credential is stored in the profile document.

## Local evidence

- [Database boundary tests](../../../packages/lib/src/supabase/rls/password-publication.test.ts)
- [Salted hashing and grant tampering/expiry tests](../../../apps/my-dev-studio/features/portfolio/access/password.test.ts)

Return to the [manual testing index](index.md).
