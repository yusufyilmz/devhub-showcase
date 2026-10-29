-- Admin membership is server controlled, never inferred from editable user metadata.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
create table private.portfolio_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table private.portfolio_admins enable row level security;
revoke all on private.portfolio_admins from public, anon, authenticated;
insert into private.portfolio_admins(user_id)
 select owner_id from public.portfolio_profiles where id = 'main' and owner_id is not null;

create function private.is_portfolio_admin() returns boolean
 language sql stable security definer set search_path = ''
 as $$ select exists(select 1 from private.portfolio_admins where user_id = (select auth.uid())) $$;
revoke all on function private.is_portfolio_admin() from public, anon;
grant execute on function private.is_portfolio_admin() to authenticated;
create function public.is_portfolio_admin() returns boolean
 language sql stable security invoker set search_path = ''
 as $$ select private.is_portfolio_admin() $$;
revoke all on function public.is_portfolio_admin() from public, anon;
grant execute on function public.is_portfolio_admin() to authenticated;

alter table public.portfolio_profiles add column managed_by uuid references auth.users(id) on delete restrict;
alter table public.portfolio_profiles add constraint managed_profiles_unowned check (managed_by is null or owner_id is null);
create index portfolio_profiles_manager_updated on public.portfolio_profiles(managed_by, updated_at desc) where managed_by is not null;
grant insert(managed_by, username) on public.portfolio_profiles to authenticated;
create policy "Admin reads managed portfolios" on public.portfolio_profiles for select to authenticated
 using ((select private.is_portfolio_admin()) and managed_by = (select auth.uid()) and owner_id is null);
create policy "Admin creates temporary portfolios" on public.portfolio_profiles for insert to authenticated
 with check ((select private.is_portfolio_admin()) and managed_by = (select auth.uid()) and owner_id is null and id <> 'main' and is_public = false);
create policy "Admin updates managed portfolios" on public.portfolio_profiles for update to authenticated
 using ((select private.is_portfolio_admin()) and managed_by = (select auth.uid()) and owner_id is null)
 with check ((select private.is_portfolio_admin()) and managed_by = (select auth.uid()) and owner_id is null);

-- Privileged ownership changes are limited to this operation in a non-exposed schema.
create function private.transfer_managed_portfolio(profile_id text, target_email text, expected_revision integer)
 returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
 target_id uuid;
 source_row public.portfolio_profiles%rowtype;
 existing_row public.portfolio_profiles%rowtype;
begin
 if not private.is_portfolio_admin() then raise exception 'Admin access required' using errcode = '42501'; end if;
 select * into source_row from public.portfolio_profiles
  where id = profile_id and managed_by = auth.uid() and owner_id is null and id <> 'main' for update;
 if not found then raise exception 'Managed portfolio not found' using errcode = '42501'; end if;
 if source_row.revision <> expected_revision then raise exception 'Reload the latest portfolio before transferring' using errcode = '40001'; end if;
 select id into target_id from auth.users
  where lower(email) = lower(trim(target_email)) and email_confirmed_at is not null for update;
 if target_id is null then raise exception 'Ask the recipient to sign in with Google first' using errcode = '22023'; end if;
 select * into existing_row from public.portfolio_profiles where owner_id = target_id for update;
 if found then
  -- Preserve even an untouched starter as a private managed record. Never replace edited work.
  if existing_row.revision <> 1 or existing_row.is_public
   or existing_row.document->>'templateChosen' is distinct from 'false'
   or existing_row.document->'projects' is distinct from '[]'::jsonb
   or existing_row.document->'experiences' is distinct from '[]'::jsonb
   or existing_row.document->'education' is distinct from '[]'::jsonb
   or existing_row.document->'skills' is distinct from '{}'::jsonb
   or existing_row.document->'about' is distinct from '[]'::jsonb
   or existing_row.document->'languages' is distinct from '[]'::jsonb
  then raise exception 'This account already has edited work. No portfolios were changed' using errcode = '23505'; end if;
  update public.portfolio_profiles set owner_id = null, managed_by = auth.uid(), revision = revision + 1, updated_at = now()
   where id = existing_row.id;
 end if;
 update public.portfolio_profiles set owner_id = target_id, managed_by = null, revision = revision + 1, updated_at = now()
  where id = source_row.id;
 return jsonb_build_object('id', source_row.id, 'username', source_row.username);
end;
$$;
revoke all on function private.transfer_managed_portfolio(text,text,integer) from public, anon;
grant execute on function private.transfer_managed_portfolio(text,text,integer) to authenticated;
create function public.transfer_managed_portfolio(profile_id text, target_email text, expected_revision integer)
 returns jsonb language sql security invoker set search_path = ''
 as $$ select private.transfer_managed_portfolio(profile_id, target_email, expected_revision) $$;
revoke all on function public.transfer_managed_portfolio(text,text,integer) from public, anon;
grant execute on function public.transfer_managed_portfolio(text,text,integer) to authenticated;
