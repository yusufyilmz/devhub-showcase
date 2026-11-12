create table public.job_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null check (length(name) between 1 and 100),
  filters jsonb not null check (jsonb_typeof(filters) = 'object' and octet_length(filters::text) <= 8000),
  hours smallint not null check (hours in (3, 6, 12, 24)),
  threshold smallint not null check (threshold between 0 and 100),
  enabled boolean not null default false,
  due_at timestamptz not null default now(),
  lease uuid,
  failures integer not null default 0,
  unique (user_id, id)
);
create index job_searches_due on public.job_searches (due_at) where enabled;

create table public.job_listings (
  user_id uuid not null references auth.users on delete cascade,
  id text not null,
  listing jsonb not null,
  primary key (user_id, id)
);
create table public.job_matches (
  user_id uuid not null,
  listing_id text not null,
  score smallint not null check (score between 0 and 100),
  cv_revision integer not null,
  explanation jsonb not null,
  state text not null default 'new' check (state in ('new', 'saved', 'dismissed')),
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id),
  foreign key (user_id, listing_id) references public.job_listings on delete cascade
);
create index job_matches_owner_recent on public.job_matches (user_id, created_at desc);
create index job_matches_owner_saved on public.job_matches (user_id, created_at desc) where state = 'saved';

create table public.job_scan_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  search_id uuid not null,
  created_at timestamptz not null default now(),
  examined integer not null,
  matched integer not null,
  issues text[] not null,
  foreign key (user_id, search_id) references public.job_searches (user_id, id) on delete cascade
);
create index job_scan_runs_owner on public.job_scan_runs (user_id, created_at desc);
create index job_scan_runs_search on public.job_scan_runs (search_id);

create table public.job_applications (
  user_id uuid not null default auth.uid(),
  listing_id text not null,
  status text not null default 'preparing'
    check (status in ('preparing', 'opened', 'applied', 'interview', 'offer', 'rejected', 'withdrawn')),
  draft jsonb check (draft is null or (jsonb_typeof(draft) = 'object' and octet_length(draft::text) <= 16000)),
  updated_at timestamptz not null default now(),
  primary key (user_id, listing_id),
  foreign key (user_id, listing_id) references public.job_matches on delete cascade
);

create index job_applications_owner_recent on public.job_applications (user_id, updated_at desc);

create table public.job_push_devices (
  id text primary key,
  user_id uuid not null references auth.users on delete cascade,
  subscription jsonb not null
);
create index job_push_devices_owner on public.job_push_devices (user_id);
create table public.job_push_deliveries (
  id uuid primary key default gen_random_uuid(),
  device_id text not null references public.job_push_devices on delete cascade,
  available_at timestamptz not null default now(),
  attempt integer not null default 0,
  lease uuid
);
create index job_push_due on public.job_push_deliveries (available_at);
create index job_push_device on public.job_push_deliveries (device_id);

create table public.job_provider_usage (
  provider text not null,
  market text not null,
  usage_day date not null,
  requests integer not null default 1,
  primary key (provider, market, usage_day)
);

create function public.reserve_job_provider_request(source text, country text, daily_limit integer)
returns boolean language plpgsql set search_path = '' as $$
begin
  delete from public.job_provider_usage where usage_day < (now() at time zone 'UTC')::date - 1;
  insert into public.job_provider_usage (provider, market, usage_day)
  values (source, country, (now() at time zone 'UTC')::date)
  on conflict (provider, market, usage_day) do update
  set requests = public.job_provider_usage.requests + 1
  where public.job_provider_usage.requests < daily_limit;
  return found;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['job_searches', 'job_listings', 'job_matches', 'job_scan_runs',
      'job_applications', 'job_push_devices', 'job_push_deliveries', 'job_provider_usage']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from public, anon, authenticated', table_name);
    execute format('grant all on public.%I to service_role', table_name);
    if table_name not in ('job_push_devices', 'job_push_deliveries', 'job_provider_usage') then
      execute format('grant select on public.%I to authenticated', table_name);
      execute format(
        'create policy jobs_read_own on public.%I for select to authenticated using ((select auth.uid()) = user_id)',
        table_name
      );
    end if;
  end loop;
end;
$$;
grant insert (name, filters, hours, threshold, enabled), update (name, filters, hours, threshold, enabled),
  delete on public.job_searches to authenticated;
create policy jobs_write_search on public.job_searches for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant update (state) on public.job_matches to authenticated;
create policy jobs_update_match on public.job_matches for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant insert (listing_id, status, draft), update (listing_id, status, draft) on public.job_applications to authenticated;
create policy jobs_write_application on public.job_applications for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create function public.touch_job_application() returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.listing_id <> old.listing_id then
    raise exception 'An application cannot change listings';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger touch_job_application before update on public.job_applications
for each row execute function public.touch_job_application();

create function public.reset_job_search() returns trigger language plpgsql set search_path = ''
as $$
begin
  new.due_at := now();
  new.lease := null;
  new.failures := 0;
  return new;
end;
$$;
create trigger reset_job_search before update of name, filters, hours, threshold, enabled
on public.job_searches for each row execute function public.reset_job_search();

create function public.claim_job_search()
returns setof public.job_searches language plpgsql set search_path = '' as $$
begin
  if not pg_try_advisory_xact_lock(38391, 8421) then return; end if;
  if exists (select from public.job_searches where enabled and lease is not null and due_at > now()) then
    return;
  end if;
  return query update public.job_searches
  set lease = gen_random_uuid(), due_at = now() + interval '5 minutes'
  where id = (
    select id from public.job_searches where enabled and due_at <= now()
    order by due_at for update skip locked limit 1
  )
  returning *;
end;
$$;

create function public.finish_job_search(
  search uuid, claim uuid, results jsonb, examined_count integer, issues_found text[], should_retry boolean
) returns boolean language plpgsql set search_path = '' as $$
declare
  settings public.job_searches;
  item jsonb;
  changed integer;
  total integer := 0;
  notify boolean := false;
  alert_at timestamptz;
begin
  select * into settings from public.job_searches
  where id = search and lease = claim and enabled and due_at > now() for update;
  if not found then return false; end if;

  for item in select value from jsonb_array_elements(results) loop
    insert into public.job_listings (user_id, id, listing)
    values (settings.user_id, item->>'id', item->'listing')
    on conflict (user_id, id) do update set listing = excluded.listing;
    alert_at := case when (item->>'score')::smallint >= settings.threshold then now() end;
    insert into public.job_matches (user_id, listing_id, score, cv_revision, explanation, notified_at)
    values (settings.user_id, item->>'id', (item->>'score')::smallint, (item->>'cvRevision')::integer,
      item->'explanation', alert_at)
    on conflict (user_id, listing_id) do nothing;
    get diagnostics changed = row_count;
    total := total + changed;
    if alert_at is not null and changed > 0 then notify := true; end if;
    if changed = 0 then
      update public.job_matches set score = (item->>'score')::smallint,
        explanation = item->'explanation', cv_revision = (item->>'cvRevision')::integer
      where user_id = settings.user_id and listing_id = item->>'id'
        and cv_revision < (item->>'cvRevision')::integer;
    end if;
    if alert_at is not null and changed = 0 then
      update public.job_matches set notified_at = alert_at
      where user_id = settings.user_id and listing_id = item->>'id' and notified_at is null
        and state <> 'dismissed' and score >= settings.threshold;
      if found then notify := true; end if;
    end if;
  end loop;

  insert into public.job_scan_runs (user_id, search_id, examined, matched, issues)
  values (settings.user_id, search, examined_count, total, issues_found);
  if notify then
    insert into public.job_push_deliveries (device_id)
    select id from public.job_push_devices where user_id = settings.user_id;
  end if;

  update public.job_searches set lease = null,
    failures = case when should_retry then least(failures + 1, 3) else 0 end,
    due_at = now() + case when should_retry and failures < 3
      then make_interval(mins => 5 * (1 << failures)) else make_interval(hours => hours) end
  where id = search;
  return true;
end;
$$;

create function public.claim_job_push(batch_size integer)
returns table (id uuid, lease uuid, attempt integer, subscription jsonb)
language sql set search_path = '' as $$
  with claimed as (
    update public.job_push_deliveries delivery
    set lease = gen_random_uuid(), attempt = delivery.attempt + 1, available_at = now() + interval '5 minutes'
    where delivery.id in (
      select pending.id from public.job_push_deliveries pending where pending.available_at <= now()
      order by pending.available_at for update skip locked limit greatest(1, least(batch_size, 20))
    )
    returning delivery.*
  )
  select claimed.id, claimed.lease, claimed.attempt, devices.subscription
  from claimed join public.job_push_devices devices on devices.id = claimed.device_id;
$$;

create function public.finish_job_push(delivery_id uuid, claim uuid, outcome text)
returns void language plpgsql set search_path = '' as $$
begin
  case outcome
    when 'retry' then
      update public.job_push_deliveries set available_at = now() + interval '5 minutes', lease = null
      where id = delivery_id and lease = claim;
    when 'expired' then
      delete from public.job_push_devices where id = (
        select device_id from public.job_push_deliveries where id = delivery_id and lease = claim
      );
    else
      delete from public.job_push_deliveries where id = delivery_id and lease = claim;
  end case;
end;
$$;

revoke all on function public.claim_job_search(), public.finish_job_search(uuid, uuid, jsonb, integer, text[], boolean),
  public.claim_job_push(integer), public.finish_job_push(uuid, uuid, text),
  public.reserve_job_provider_request(text, text, integer) from public, anon, authenticated;
grant execute on function public.claim_job_search(), public.finish_job_search(uuid, uuid, jsonb, integer, text[], boolean),
  public.claim_job_push(integer), public.finish_job_push(uuid, uuid, text),
  public.reserve_job_provider_request(text, text, integer) to service_role;
