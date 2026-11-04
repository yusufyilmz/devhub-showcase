# Publication rollout record — 2026-11-04

The user authorized applying the pending database migrations and configuring the recurring worker. Credentials will be added separately by the user in Vercel. This authorization does not merge PR #86 or deploy its unfinished password-protection feature.

## Verified targets

- Supabase: `devhub-showcase`, project `quepwjalwkfzxyqhtyby`.
- Vercel: `devhub-showcase`, project `prj_6vMihdg2V3t5405P0RdV4RNmEtpH`.
- Production: [MyDevStudio](https://mydevstudio.vercel.app/), path `/`.
- Production commit at inspection: `57c5e1b5c83d936da8b68f8077ae19187043e444`, merged PR #84.
- Working branch: `feat/protected-publications`, based on current `main`. PR #86 was merged into `feat/publication-foundation`, so its changes are carried forward in a follow-up PR targeting `main`.

## Migration state

Apply by migration name and dependency order. The connected migration tool records the execution timestamp, which can differ from the repository file's original timestamp. Do not rerun an applied file just because its local timestamp differs.

| Repository migration                           | Production state          | Evidence                                                                                          |
| ---------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------- |
| `20261103110000_private_cv_variants.sql`       | Applied                   | Recorded as `20261104090307_private_cv_variants`; anonymous table access denied.                  |
| `20261103120000_private_profile_history.sql`   | Applied                   | Five current saved revisions backfilled; anonymous reads and authenticated direct inserts denied. |
| `20261103130000_publication_snapshots.sql`     | Pending tool confirmation | Confirmation expired twice; publication snapshot tables are still absent.                         |
| `20261103140000_retained_username_aliases.sql` | Pending prerequisite      | Requires publication snapshots.                                                                   |
| `20261103150000_unlisted_publications.sql`     | Pending prerequisite      | Requires publication snapshots.                                                                   |
| `20261104090000_scheduled_publication.sql`     | Pending prerequisite      | Requires publication snapshots; prepare aliases/visibility first.                                 |
| `20261104093457_enable_publication_cron.sql`   | Prepared, not applied     | Requires the scheduled worker function.                                                           |

## Manual fallback for expired connector confirmations

The publication confirmation expired repeatedly without executing. Open [the project SQL Editor](https://supabase.com/dashboard/project/quepwjalwkfzxyqhtyby/sql/new), path `/dashboard/project/quepwjalwkfzxyqhtyby/sql/new`, copy the complete [remaining-setup script](../../supabase/rollout/publication-setup.sql), and run it once. It applies the five pending migrations in one transaction, records the repository versions, then reports public snapshot counts and the active cron job. It requires no credentials in the editor. It deliberately excludes unfinished password-protection work.

If it reports that publication setup already exists or is partially applied, stop and inspect state before rerunning. Do not drop existing publication tables or rerun the two already-applied prerequisite migrations.

## Recurring worker

Use the native database worker via `20261104093457_enable_publication_cron.sql`. It enables `pg_cron`, registers `mydevstudio-publication-worker` on `* * * * *`, and runs the existing atomic worker with a 45-second statement limit. It stores no HTTP secrets and restricts the cron schema from application roles. No Vercel cron entry is needed with this option.

After applying it, verify the active job and a successful run in [Supabase Cron](https://supabase.com/dashboard/project/quepwjalwkfzxyqhtyby/integrations/cron/overview), path `/dashboard/project/quepwjalwkfzxyqhtyby/integrations/cron/overview`. Do not enable a second HTTP scheduler at the same time. Disabling only this worker uses `cron.unschedule('mydevstudio-publication-worker')`; do not drop the extension, which could remove other jobs.

The user will add server-only `SUPABASE_SERVICE_ROLE_KEY` and a random `CRON_SECRET` of at least 32 characters in Vercel. These are required by the app's schedule-creation check and authenticated HTTP worker alternative. Native cron does not need the keys in its command. New environment variables require a fresh deployment to take effect.

## Remaining verification

- Apply the pending migrations after the required tool confirmation.
- Confirm three existing published profiles become sanitized website/CV snapshots, with private canonical documents unavailable anonymously.
- Confirm worker execute privilege belongs only to the service role and database administrators, not ordinary application roles.
- Verify one successful minute-level cron invocation. Do not create or publish a real user's scheduled revision solely as a test.
- After credentials and a reviewed deployment, follow the [scheduled publication manual guide](manual/scheduled-publication.md) using disposable content.

## Existing advisor findings

Security advisors report legacy tables without RLS, legacy `_heroku` functions with mutable search paths, disabled leaked-password checking and available Postgres security patches. These are separate pre-existing platform findings; this rollout does not silently change their access or upgrade the database. No finding identified the newly created private CV/history tables as publicly readable. See [Supabase database advisors](https://supabase.com/docs/guides/database/database-advisors) for interpretation.
