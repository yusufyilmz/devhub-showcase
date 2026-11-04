-- Saved revision history is account/manager private, never an anonymous publication source.
create table public.portfolio_profile_history (
  profile_id text not null references public.portfolio_profiles(id) on delete cascade,
  revision integer not null check (revision >= 0),
  document jsonb not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, revision)
);
create index profile_history_retention on public.portfolio_profile_history(profile_id, created_at desc);
alter table public.portfolio_profile_history enable row level security;
revoke all on public.portfolio_profile_history from public, anon, authenticated;
grant select on public.portfolio_profile_history to authenticated;
create policy profile_history_read on public.portfolio_profile_history for select to authenticated
using (created_at >= now() - interval '90 days' and exists (
  select 1 from public.portfolio_profiles p where p.id = profile_id and (
    p.owner_id = (select auth.uid()) or (
      p.owner_id is null and p.managed_by = (select auth.uid()) and (select private.is_portfolio_admin())
    )
  )
));
create function private.capture_profile_revision() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.portfolio_profile_history(profile_id, revision, document, created_at)
    values (new.id, new.revision, new.document, now()) on conflict do nothing;
  delete from public.portfolio_profile_history h where h.profile_id = new.id and (
    h.created_at < now() - interval '90 days' or h.revision not in (
      select revision from public.portfolio_profile_history where profile_id = new.id order by revision desc limit 20
    )
  );
  return new;
end;
$$;
revoke all on function private.capture_profile_revision() from public, anon, authenticated;
create trigger capture_profile_revision after insert or update on public.portfolio_profiles
for each row execute function private.capture_profile_revision();
insert into public.portfolio_profile_history(profile_id, revision, document)
select id, revision, document from public.portfolio_profiles;
