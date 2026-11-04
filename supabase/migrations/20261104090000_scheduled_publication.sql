-- Scheduled content stays private until the reviewed snapshot is executed.
create table private.portfolio_schedules (
 id uuid primary key default gen_random_uuid(),
 profile_id text not null references public.portfolio_profiles(id) on delete cascade,
 username text not null,
 revision integer not null,
 website jsonb not null,
 cv jsonb not null,
 owner_id uuid,
 managed_by uuid,
 run_at timestamptz not null,
 timezone text not null,
 state text not null default 'pending' check(state in ('pending','completed','cancelled','failed')),
 error text,
 created_at timestamptz not null default now(),
 finished_at timestamptz
);
alter table private.portfolio_schedules enable row level security;
revoke all on private.portfolio_schedules from public,anon,authenticated;
create unique index portfolio_schedule_pending on private.portfolio_schedules(profile_id) where state='pending';
create index portfolio_schedule_due on private.portfolio_schedules(run_at) where state='pending';

create function private.authorized_publication_profile(profile_id text)
returns public.portfolio_profiles language plpgsql security definer set search_path='' as $$
declare p public.portfolio_profiles;
begin
 select * into p from public.portfolio_profiles where id=profile_id for update;
 if not found or auth.uid() is null or not coalesce(p.owner_id=auth.uid() or (p.owner_id is null and p.managed_by=auth.uid() and private.is_portfolio_admin()),false) then
 raise exception 'Publication access denied' using errcode='42501'; end if;
 return p;
end;
$$;
revoke all on function private.authorized_publication_profile(text) from public,anon,authenticated;

create function public.portfolio_schedule_status(profile_id text) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
 perform private.authorized_publication_profile(profile_id);
 return coalesce((select jsonb_agg(to_jsonb(s)) from (
 select id,revision,username,run_at,timezone,state,error,finished_at from private.portfolio_schedules
 where portfolio_schedules.profile_id=portfolio_schedule_status.profile_id order by created_at desc,id desc limit 10) s),'[]'::jsonb);
end;
$$;
create function public.schedule_portfolio_publication(profile_id text, expected_revision integer, run_at timestamptz, timezone text)
returns uuid language plpgsql security definer set search_path='' as $$
declare p public.portfolio_profiles; job uuid;
begin
 p:=private.authorized_publication_profile(profile_id);
 if p.revision is distinct from expected_revision then raise exception 'Revision changed' using errcode='40001'; end if;
 if run_at is null or run_at < now()+interval '1 minute' or run_at > now()+interval '366 days' or not exists(select 1 from pg_catalog.pg_timezone_names n where n.name=timezone) then
 raise exception 'Invalid schedule time' using errcode='22023'; end if;
 -- Only supported snapshot modes may be scheduled; future protected modes need their own credentials snapshot.
 if coalesce(p.document->>'publicationVisibility','public') not in ('public','unlisted') then raise exception 'Unsupported visibility' using errcode='22023'; end if;
 update private.portfolio_schedules set state='cancelled',finished_at=now() where portfolio_schedules.profile_id=p.id and state='pending';
 insert into private.portfolio_schedules(profile_id,username,revision,website,cv,owner_id,managed_by,run_at,timezone)
 values(p.id,p.username,p.revision,private.project_portfolio_document(p.document,'website'),private.project_portfolio_document(p.document,'cv'),p.owner_id,p.managed_by,run_at,timezone) returning id into job;
 return job;
end;
$$;
create function public.cancel_portfolio_schedule(profile_id text, schedule_id uuid) returns boolean
language plpgsql security definer set search_path='' as $$
begin
 perform private.authorized_publication_profile(profile_id);
 update private.portfolio_schedules set state='cancelled',finished_at=now() where portfolio_schedules.profile_id=cancel_portfolio_schedule.profile_id and id=schedule_id and state='pending';
 return found;
end;
$$;
revoke all on function public.portfolio_schedule_status(text),public.schedule_portfolio_publication(text,integer,timestamptz,text),public.cancel_portfolio_schedule(text,uuid) from public,anon;
grant execute on function public.portfolio_schedule_status(text),public.schedule_portfolio_publication(text,integer,timestamptz,text),public.cancel_portfolio_schedule(text,uuid) to authenticated;

-- Any immediate publish or withdrawal supersedes a pending schedule, under the same profile lock.
alter function public.set_portfolio_publication(text,integer,boolean) set schema private;
revoke all on function private.set_portfolio_publication(text,integer,boolean) from public,anon,authenticated;
create function public.set_portfolio_publication(profile_id text, expected_revision integer, publish boolean) returns integer
language plpgsql security definer set search_path='' as $$
declare revision integer;
begin
 revision:=private.set_portfolio_publication(profile_id,expected_revision,publish);
 update private.portfolio_schedules set state='cancelled',finished_at=now() where portfolio_schedules.profile_id=set_portfolio_publication.profile_id and state='pending';
 return revision;
end;
$$;
revoke all on function public.set_portfolio_publication(text,integer,boolean) from public,anon;
grant execute on function public.set_portfolio_publication(text,integer,boolean) to authenticated;

create function private.cancel_transferred_schedules() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if old.owner_id is distinct from new.owner_id or old.managed_by is distinct from new.managed_by then
 update private.portfolio_schedules set state='cancelled',finished_at=now() where profile_id=new.id and state='pending';
 end if;
 return new;
end;
$$;
revoke all on function private.cancel_transferred_schedules() from public,anon,authenticated;
create trigger cancel_transferred_schedules after update of owner_id,managed_by on public.portfolio_profiles for each row execute function private.cancel_transferred_schedules();

create function public.execute_portfolio_schedules() returns integer
language plpgsql security definer set search_path='' as $$
declare candidate record; p public.portfolio_profiles; job private.portfolio_schedules; completed integer:=0;
begin
 -- Profile then job is the lock order for create, replace, cancel, transfer and execution.
 for candidate in select profile_id from private.portfolio_schedules where state='pending' and run_at<=now() order by run_at limit 50 loop
 select * into p from public.portfolio_profiles where id=candidate.profile_id for update skip locked;
 if not found then continue; end if;
 select * into job from private.portfolio_schedules where profile_id=p.id and state='pending' and run_at<=now() for update;
 if not found then continue; end if;
 begin
 if p.owner_id is distinct from job.owner_id or p.managed_by is distinct from job.managed_by or
 (p.owner_id is null and not exists(select 1 from private.portfolio_admins where user_id=p.managed_by)) then
 raise exception 'Authorization changed'; end if;
 insert into public.portfolio_publications(id,username,document,revision) values(p.id,job.username,job.website,job.revision)
 on conflict(id) do update set username=excluded.username,document=excluded.document,revision=excluded.revision,updated_at=now();
 insert into public.portfolio_public_cvs(id,username,document,revision) values(p.id,job.username,job.cv,job.revision)
 on conflict(id) do update set username=excluded.username,document=excluded.document,revision=excluded.revision,updated_at=now();
 update public.portfolio_profiles set is_public=true where id=p.id;
 update private.portfolio_schedules set state='completed',finished_at=now() where id=job.id;
 completed:=completed+1;
 exception when others then
 -- The two snapshot writes roll back together. No raw SQL or private content is returned.
 update private.portfolio_schedules set state='failed',error='Publication failed. Review current access and username, then create a new schedule.',finished_at=now() where id=job.id;
 end;
 end loop;
 -- Bound retained private snapshots; operational metadata is not a permanent archive.
 delete from private.portfolio_schedules where state<>'pending' and finished_at<now()-interval '90 days';
 return completed;
end;
$$;
revoke all on function public.execute_portfolio_schedules() from public,anon,authenticated;
grant execute on function public.execute_portfolio_schedules() to service_role;
