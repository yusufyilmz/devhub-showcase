-- OPTIONAL operator-run setup, NOT a migration and NOT executed by this PR.
-- Enable Supabase Cron (pg_cron), pg_net and Vault first.
-- In Vault create fitness_notification_origin (exact HTTPS app origin, no trailing
-- slash) and fitness_notification_cron_secret (same >=32-character CRON_SECRET
-- configured in the Fitness OS server). Never paste values into this file.
-- pg_net temporarily stores authorization headers in net.http_request_queue:
-- access to database login roles and extension tables must remain restricted.
-- Run only against the approved environment after the notification migration.
select cron.schedule(
  'fitness-os-notifications',
  '* * * * *',
  $job$
  select net.http_get(
    url := (select decrypted_secret from vault.decrypted_secrets
            where name = 'fitness_notification_origin') || '/api/cron/notifications',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets
                                    where name = 'fitness_notification_cron_secret')),
    timeout_milliseconds := 55000
  );
  $job$
);
-- Inspect cron.job_run_details and net._http_response (status_code, not headers).
-- Pause with: select cron.unschedule('fitness-os-notifications');
