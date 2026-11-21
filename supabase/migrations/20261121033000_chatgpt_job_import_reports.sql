create table public.job_import_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  source text not null check (source = 'chatgpt_research'),
  automation_title text not null check (char_length(automation_title) between 1 and 150),
  summary text not null check (char_length(summary) <= 3000),
  generated_at timestamptz,
  job_count integer not null check (job_count between 0 and 5),
  new_count integer not null check (new_count between 0 and 5),
  duplicate_count integer not null check (duplicate_count between 0 and 5),
  created_at timestamptz not null default now()
);
create index job_import_reports_owner on public.job_import_reports (user_id, created_at desc);

alter table public.job_import_reports enable row level security;
revoke all on public.job_import_reports from public, anon, authenticated;
grant all on public.job_import_reports to service_role;
grant select on public.job_import_reports to authenticated;
create policy jobs_read_import_reports on public.job_import_reports
  for select to authenticated
  using ((select auth.uid()) = user_id);
