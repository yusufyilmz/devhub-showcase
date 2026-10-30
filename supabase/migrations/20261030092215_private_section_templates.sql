-- Account-private library. Never attach authored templates to a published profile document.
create table public.portfolio_section_templates (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  templates jsonb not null default '[]'::jsonb,
  revision integer not null default 1 check (revision >= 1),
  updated_at timestamptz not null default now(),
  constraint section_template_array check (jsonb_typeof(templates) = 'array' and jsonb_array_length(templates) <= 5),
  constraint section_template_size check (octet_length(templates::text) <= 800000)
);
alter table public.portfolio_section_templates enable row level security;
revoke all on public.portfolio_section_templates from public, anon;
grant select, insert, update, delete on public.portfolio_section_templates to authenticated;
create policy section_templates_select on public.portfolio_section_templates
  for select to authenticated using ((select auth.uid()) = owner_id);
create policy section_templates_insert on public.portfolio_section_templates
  for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy section_templates_update on public.portfolio_section_templates
  for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy section_templates_delete on public.portfolio_section_templates
  for delete to authenticated using ((select auth.uid()) = owner_id);
