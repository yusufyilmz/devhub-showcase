create schema if not exists private;

-- Reusable application notifications. Device capabilities are server-only secrets.
create table public.notification_devices (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 app_id text not null check(app_id ~ '^[a-z0-9][a-z0-9-]{0,63}$'),
 endpoint_hash text not null check(length(endpoint_hash)=64),
 subscription jsonb not null check(jsonb_typeof(subscription)='object' and octet_length(subscription::text)<4096),
 enabled boolean not null default true,
 updated_at timestamptz not null default now(),
 unique(app_id,endpoint_hash), unique(id,user_id,app_id)
);
create table public.notification_events (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 app_id text not null check(app_id ~ '^[a-z0-9][a-z0-9-]{0,63}$'),
 source_revision integer check(source_revision>=0),
 kind text not null check(kind in ('notification','invalidate')),
 topic text not null check(length(topic) between 1 and 64),
 dedupe_key text not null check(length(dedupe_key) between 1 and 200),
 message jsonb not null check(jsonb_typeof(message)='object' and octet_length(message::text)<8192),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '1 day',
 unique(user_id,app_id,dedupe_key), unique(id,user_id,app_id)
);
create table public.notification_deliveries (
 event_id uuid not null, device_id uuid not null, user_id uuid not null, app_id text not null,
 state text not null default 'pending' check(state in ('pending','leased','sent','failed','expired','cancelled')),
 attempts integer not null default 0 check(attempts between 0 and 3),
 next_attempt timestamptz not null default now(),
 lease uuid, lease_until timestamptz,
 primary key(event_id,device_id),
 foreign key(event_id,user_id,app_id) references public.notification_events(id,user_id,app_id) on delete cascade,
 foreign key(device_id,user_id,app_id) references public.notification_devices(id,user_id,app_id) on delete cascade
);
create index notification_events_owner_time on public.notification_events(user_id,app_id,created_at desc);
create index notification_queue_due on public.notification_deliveries(app_id,user_id,next_attempt) where state in ('pending','leased');
alter table public.notification_devices enable row level security;
alter table public.notification_events enable row level security;
alter table public.notification_deliveries enable row level security;
revoke all on public.notification_devices,public.notification_events,public.notification_deliveries from public,anon,authenticated;
grant select on public.notification_events to authenticated;
create policy notification_events_owner on public.notification_events for select to authenticated using(user_id=(select auth.uid()) and expires_at>now());
grant all on public.notification_devices,public.notification_events,public.notification_deliveries to service_role;

-- A committed workspace revision becomes an authenticated WebSocket invalidation event.
-- Publishing occurs in the same transaction as the save; only its revision is exposed.
create function private.notify_fitness_revision() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 delete from public.notification_events where user_id=new.user_id and app_id='fitness-os' and expires_at<now()-interval '1 day';
 if old.revision is distinct from new.revision then
  insert into public.notification_events(user_id,app_id,kind,topic,dedupe_key,message)
  values(new.user_id,'fitness-os','invalidate','workspace','workspace:'||new.revision,jsonb_build_object('revision',new.revision)) on conflict do nothing;
 end if;
 return new;
end;
$$;
revoke all on function private.notify_fitness_revision() from public,anon,authenticated;
create trigger fitness_notification_revision after update of revision on public.task_workspaces for each row execute function private.notify_fitness_revision();

do $$begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') and not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='notification_events') then
  alter publication supabase_realtime add table public.notification_events;
 end if;
end$$;
