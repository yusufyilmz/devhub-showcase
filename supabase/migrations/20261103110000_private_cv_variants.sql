-- Account-private CV snapshots, never included in the public profile document.
create table public.portfolio_cv_variants (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  variants jsonb not null default '[]'::jsonb,
  revision integer not null default 1 check (revision >= 1),
  updated_at timestamptz not null default now(),
  constraint cv_variant_array check (jsonb_typeof(variants) = 'array' and jsonb_array_length(variants) <= 8),
  constraint cv_variant_size check (octet_length(variants::text) <= 2000000)
);
alter table public.portfolio_cv_variants enable row level security;
revoke all on public.portfolio_cv_variants from public, anon;
grant select, insert, update, delete on public.portfolio_cv_variants to authenticated;
create policy cv_variants_select on public.portfolio_cv_variants
  for select to authenticated using ((select auth.uid()) = owner_id);
create policy cv_variants_insert on public.portfolio_cv_variants
  for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy cv_variants_update on public.portfolio_cv_variants
  for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy cv_variants_delete on public.portfolio_cv_variants
  for delete to authenticated using ((select auth.uid()) = owner_id);
