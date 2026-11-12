-- OPTIONAL operator-run setup, NOT a migration and NOT executed by this PR.
-- Enable Supabase Cron (pg_cron), pg_net and Vault first.
-- In Vault create job_hunter_origin (exact HTTPS app origin, no trailing
-- slash) and job_hunter_cron_secret (same >=32-character CRON_SECRET
-- configured in the MyDevStudio server). Never paste values into this file.
-- pg_net temporarily stores authorization headers in net.http_request_queue:
-- access to database login roles and extension tables must remain restricted.
-- Run only against the approved environment after the Job Hunter migration.
select cron.schedule(
  'mydevstudio-job-hunter',
  '* * * * *',
  $job$
  select net.http_get(
    url := (select decrypted_secret from vault.decrypted_secrets
            where name = 'job_hunter_origin') || '/api/cron/jobs',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets
                                    where name = 'job_hunter_cron_secret')),
    timeout_milliseconds := 115000
  );
  $job$
);
-- Inspect cron.job_run_details and net._http_response (status_code, not headers).
-- Pause with: select cron.unschedule('mydevstudio-job-hunter');
