-- Upgrade the existing single portfolio without changing its document or owner.
alter table public.portfolio_profiles drop constraint portfolio_profiles_id_check;
alter table public.portfolio_profiles alter column id set default gen_random_uuid()::text;
alter table public.portfolio_profiles add column is_public boolean not null default false;
update public.portfolio_profiles set is_public = true where id = 'main';
create unique index portfolio_profiles_owner_unique on public.portfolio_profiles(owner_id) where owner_id is not null;
alter table public.portfolio_profiles add constraint portfolio_profiles_id_format
 check (id = 'main' or id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
drop policy "Public portfolio is readable" on public.portfolio_profiles;
create policy "Read published CV" on public.portfolio_profiles for select to anon, authenticated
 using (is_public);
create policy "Read own private CV" on public.portfolio_profiles for select to authenticated
 using ((select auth.uid()) = owner_id);
grant insert (id, owner_id, document) on public.portfolio_profiles to authenticated;
grant update (is_public) on public.portfolio_profiles to authenticated;
create policy "Create own private CV" on public.portfolio_profiles for insert to authenticated
 with check ((select auth.uid()) = owner_id and id <> 'main' and is_public = false);
-- The existing update policy already checks auth.uid() against owner_id in
-- both USING and WITH CHECK. Ownership/id columns remain non-updatable.
-- No client delete privilege, and nobody can claim or replace the main profile.
