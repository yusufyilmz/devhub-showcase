-- Run the existing atomic worker inside Postgres; no HTTP credentials are stored in cron.
do $$ begin
 if to_regprocedure('public.execute_portfolio_schedules()') is null then
   raise exception 'Apply scheduled_publication before enabling its worker';
 end if;
end $$;
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;
revoke all on schema cron from public,anon,authenticated;
select cron.schedule(
 'mydevstudio-publication-worker',
 '* * * * *',
 $$set statement_timeout = '45s'; select public.execute_portfolio_schedules();$$
);
