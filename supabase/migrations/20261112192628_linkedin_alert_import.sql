alter table public.job_matches alter column score drop not null;

create table public.job_alert_addresses (
  user_id uuid primary key references auth.users on delete cascade,
  token uuid not null unique default gen_random_uuid()
);
create table public.job_alert_imports (
  user_id uuid not null references auth.users on delete cascade,
  id text not null check (id ~ '^[0-9a-f]{64}$'),
  listing jsonb not null check (jsonb_typeof(listing) = 'object' and octet_length(listing::text) <= 12000),
  received_at timestamptz not null default now(),
  primary key (user_id, id)
);
alter table public.job_alert_addresses enable row level security;
alter table public.job_alert_imports enable row level security;
revoke all on public.job_alert_addresses, public.job_alert_imports from public, anon, authenticated;
grant all on public.job_alert_addresses, public.job_alert_imports to service_role;
grant select, delete on public.job_alert_addresses, public.job_alert_imports to authenticated;
grant insert (user_id) on public.job_alert_addresses to authenticated;
create policy own_job_alert_address on public.job_alert_addresses for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy read_job_alert_import on public.job_alert_imports for select to authenticated
  using ((select auth.uid()) = user_id);
create policy discard_job_alert_import on public.job_alert_imports for delete to authenticated
  using ((select auth.uid()) = user_id);

create function public.enqueue_linkedin_alert(address_token uuid, verified_sender text, candidates jsonb)
-- The relay must check the current verified Auth email without granting table access.
returns integer language plpgsql security definer set search_path = '' as $$
declare owner_id uuid; remaining integer; inserted integer;
begin
  select a.user_id into owner_id from public.job_alert_addresses a
    join auth.users u on u.id = a.user_id
    where a.token = address_token and u.email_confirmed_at is not null
      and lower(u.email) = lower(verified_sender)
    for update of a;
  if not found then return 0; end if;

  delete from public.job_alert_imports where user_id = owner_id
    and received_at < now() - interval '30 days';
  select greatest(0, 100 - count(*)) into remaining from public.job_alert_imports where user_id = owner_id;
  insert into public.job_alert_imports (user_id, id, listing)
    select owner_id, candidate->>'id', candidate->'listing'
    from jsonb_array_elements(candidates) candidate
    where not exists (
      select from public.job_listings where user_id = owner_id and id = candidate->>'id'
    ) and not exists (
      select from public.job_alert_imports where user_id = owner_id and id = candidate->>'id'
    )
    limit least(remaining, 25)
    on conflict do nothing;
  get diagnostics inserted = row_count;
  return inserted;
end;
$$;

create function public.accept_linkedin_alert(
  account_id uuid, import_id text, reviewed_listing jsonb, match_score integer,
  cv_version integer, match_explanation jsonb
) returns boolean language plpgsql set search_path = '' as $$
declare pending jsonb;
begin
  delete from public.job_alert_imports
    where user_id = account_id and id = import_id and received_at >= now() - interval '30 days'
    returning listing into pending;
  if not found then return false; end if;

  insert into public.job_listings (user_id, id, listing)
    values (account_id, import_id, reviewed_listing || jsonb_build_object(
      'source', 'linkedin', 'sourceId', pending->'sourceId', 'url', pending->'url'
    )) on conflict do nothing;
  insert into public.job_matches (user_id, listing_id, score, explanation, cv_revision, state)
    values (account_id, import_id, match_score, match_explanation, cv_version, 'saved')
    on conflict do nothing;
  return true;
end;
$$;
revoke all on function public.enqueue_linkedin_alert(uuid, text, jsonb),
  public.accept_linkedin_alert(uuid, text, jsonb, integer, integer, jsonb) from public, anon, authenticated;
grant execute on function public.enqueue_linkedin_alert(uuid, text, jsonb),
  public.accept_linkedin_alert(uuid, text, jsonb, integer, integer, jsonb) to service_role;
