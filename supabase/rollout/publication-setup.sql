-- MyDevStudio: remaining publication setup (no credentials required).
-- Target project: devhub-showcase / quepwjalwkfzxyqhtyby.
-- Run in the Supabase SQL Editor only after reviewing this script.
-- Private CV versions and revision history are already applied.
-- This bundle deliberately excludes unfinished password protection.
-- All five remaining migrations commit together or roll back together.
begin;
do $$ begin
 if to_regclass('public.portfolio_publications') is not null or to_regclass('public.portfolio_public_cvs') is not null then
   raise exception 'Publication setup already exists or is partially applied. Inspect migration state before rerunning.';
 end if;
 if to_regclass('public.portfolio_profile_history') is null then
   raise exception 'Apply the private profile history prerequisite first.';
 end if;
end $$;

-- Source: supabase/migrations/20261103130000_publication_snapshots.sql
-- Public documents are explicit snapshots; private saves no longer feed anonymous reads.
create function private.project_portfolio_document(source jsonb, surface text) returns jsonb
language plpgsql immutable set search_path = '' as $$
declare
  result jsonb := source - 'birthDate' - 'cvUrl';
  flags jsonb;
  field text;
  pair record;
  items jsonb;
  section jsonb;
  sections jsonb := '[]'::jsonb;
  allowed jsonb;
begin
  if jsonb_typeof(source) <> 'object' or surface not in ('website','cv') then raise exception 'Invalid projection'; end if;
  flags := coalesce(source -> case when surface='website' then 'websiteFields' else 'cvFields' end, '{}'::jsonb);
  foreach field in array array['email','phone','location','website','github','linkedin'] loop
    if flags->field = 'false'::jsonb then result := jsonb_set(result,array[field],'""'::jsonb); end if;
  end loop;
  select coalesce(jsonb_agg(value),'[]'::jsonb) into items from jsonb_array_elements(coalesce(result->'projects','[]'::jsonb)) where value->'public'='true'::jsonb;
  result := jsonb_set(result,'{projects}',items);
  if surface='cv' then
    if source#>'{cvSettings,showEmail}'='false'::jsonb then result:=jsonb_set(result,'{email}','""'::jsonb); end if;
    if source#>'{cvSettings,showPhone}'='false'::jsonb then result:=jsonb_set(result,'{phone}','""'::jsonb); end if;
    if source#>'{cvSettings,includeProjects}'='false'::jsonb then result:=jsonb_set(result,'{projects}','[]'::jsonb); end if;
    if source#>'{cvSettings,includeLanguages}'='false'::jsonb then result:=jsonb_set(result,'{languages}','[]'::jsonb); end if;
    result:=result-'customSections'-'hero'-'sectionSequence'-'sectionOrder'-'sectionSettings';
  else
    for pair in select * from (values ('about','about'),('projects','projects'),('experience','experiences'),('education','education'),('languages','languages'),('skills','skills')) as map(kind,key) loop
      if source#>array['sectionSettings',pair.kind,'visible']='false'::jsonb then
        result:=jsonb_set(result,array[pair.key],case when pair.key='skills' then '{}'::jsonb else '[]'::jsonb end);
      elsif source#>array['sectionSettings',pair.kind,'itemIds'] is not null and pair.key not in ('about','skills') then
        select coalesce(jsonb_agg(value),'[]'::jsonb) into items from jsonb_array_elements(result->pair.key) where (source#>array['sectionSettings',pair.kind,'itemIds']) ? (value->>'id');
        result:=jsonb_set(result,array[pair.key],items);
      elsif pair.key='skills' and source#>'{sectionSettings,skills,itemIds}' is not null then
        select coalesce(jsonb_object_agg(key,value),'{}'::jsonb) into items from jsonb_each(result->'skills') where (source#>'{sectionSettings,skills,itemIds}') ? key;
        result:=jsonb_set(result,'{skills}',items);
      end if;
      if result#>array['sectionSettings',pair.kind] is not null then result:=jsonb_set(result,array['sectionSettings',pair.kind],(result#>array['sectionSettings',pair.kind])-'itemIds'); end if;
    end loop;
    for section in select value from jsonb_array_elements(coalesce(result->'customSections','[]'::jsonb)) loop
      if section->'visible'<>'true'::jsonb or (section->>'sectionType'='map' and flags->'location'='false'::jsonb) then continue; end if;
      if section->'source' is not null then
        section:=jsonb_set(section,'{items}','[]'::jsonb);
        field:=section#>>'{source,field}';
        if section#>'{source,itemIds}' is not null then
          if field='about' then allowed:='["about"]'::jsonb;
          elsif field='skills' then select coalesce(jsonb_agg(key),'[]'::jsonb) into allowed from jsonb_each(result->'skills');
          else select coalesce(jsonb_agg(value->>'id'),'[]'::jsonb) into allowed from jsonb_array_elements(coalesce(result->field,'[]'::jsonb)); end if;
          select coalesce(jsonb_agg(value),'[]'::jsonb) into items from jsonb_array_elements(section#>'{source,itemIds}') where allowed ? (value#>>'{}');
          section:=jsonb_set(section,'{source,itemIds}',items);
        end if;
      end if;
      if flags->'email'='false'::jsonb and section->'options' is not null then section:=jsonb_set(section,'{options}',(section->'options')-'email'); end if;
      sections:=sections||jsonb_build_array(section);
    end loop;
    result:=jsonb_set(result,'{customSections}',sections);
    if result->'sectionSequence' is not null then
      select coalesce(jsonb_agg(seq.value),'[]'::jsonb) into items from jsonb_array_elements(result->'sectionSequence') seq(value) where left(seq.value#>>'{}',7)<>'custom-' or exists(select 1 from jsonb_array_elements(sections) sec(value) where sec.value->>'id'=seq.value#>>'{}');
      result:=jsonb_set(result,'{sectionSequence}',items);
    end if;
  end if;
  select coalesce(jsonb_agg(case when project.value->>'experienceId' is not null and not exists(select 1 from jsonb_array_elements(result->'experiences') experience(value) where experience.value->>'id'=project.value->>'experienceId') then jsonb_set(project.value,'{experienceId}','null'::jsonb) else project.value end),'[]'::jsonb) into items from jsonb_array_elements(result->'projects') project(value);
  return jsonb_set(result,'{projects}',items);
end;
$$;
revoke all on function private.project_portfolio_document(jsonb,text) from public, anon, authenticated;

create table public.portfolio_publications (
 id text primary key references public.portfolio_profiles(id) on delete cascade,
 username text not null unique,
 document jsonb not null,
 revision integer not null,
 updated_at timestamptz not null default now()
);
create table public.portfolio_public_cvs (like public.portfolio_publications including all);
alter table public.portfolio_public_cvs add foreign key(id) references public.portfolio_profiles(id) on delete cascade;
alter table public.portfolio_publications enable row level security;
alter table public.portfolio_public_cvs enable row level security;
revoke all on public.portfolio_publications,public.portfolio_public_cvs from public,anon,authenticated;
grant select on public.portfolio_publications,public.portfolio_public_cvs to anon,authenticated;
create policy publication_read on public.portfolio_publications for select to anon,authenticated using(true);
create policy publication_cv_read on public.portfolio_public_cvs for select to anon,authenticated using(true);
-- Preserve existing publication during migration, but sanitize before opening the new public surface.
insert into public.portfolio_publications(id,username,document,revision,updated_at)
 select id,username,private.project_portfolio_document(document,'website'),revision,updated_at from public.portfolio_profiles where is_public;
insert into public.portfolio_public_cvs(id,username,document,revision,updated_at)
 select id,username,private.project_portfolio_document(document,'cv'),revision,updated_at from public.portfolio_profiles where is_public;
drop policy "Read published CV" on public.portfolio_profiles;
revoke select on public.portfolio_profiles from anon;
revoke update(is_public) on public.portfolio_profiles from authenticated;

create function public.set_portfolio_publication(profile_id text, expected_revision integer, publish boolean)
returns integer language plpgsql security definer set search_path = '' as $$
declare p public.portfolio_profiles%rowtype;
begin
 select * into p from public.portfolio_profiles where id=profile_id for update;
 if not found or auth.uid() is null or not coalesce((p.owner_id=auth.uid() or (p.owner_id is null and p.managed_by=auth.uid() and private.is_portfolio_admin())), false) then raise exception 'Publication access denied' using errcode='42501'; end if;
 if expected_revision is null or p.revision<>expected_revision then raise exception 'Publication revision conflict' using errcode='40001'; end if;
 if publish is null then raise exception 'Publication choice required' using errcode='22023'; end if;
 if publish then
   insert into public.portfolio_publications(id,username,document,revision) values(p.id,p.username,private.project_portfolio_document(p.document,'website'),p.revision)
    on conflict(id) do update set username=excluded.username,document=excluded.document,revision=excluded.revision,updated_at=now();
   insert into public.portfolio_public_cvs(id,username,document,revision) values(p.id,p.username,private.project_portfolio_document(p.document,'cv'),p.revision)
    on conflict(id) do update set username=excluded.username,document=excluded.document,revision=excluded.revision,updated_at=now();
 else
   delete from public.portfolio_publications where id=p.id;
   delete from public.portfolio_public_cvs where id=p.id;
 end if;
 update public.portfolio_profiles set is_public=publish where id=p.id;
 return p.revision;
end;
$$;
revoke all on function public.set_portfolio_publication(text,integer,boolean) from public,anon;
grant execute on function public.set_portfolio_publication(text,integer,boolean) to authenticated;


-- Source: supabase/migrations/20261103140000_retained_username_aliases.sql
-- Aliases are reserved identifiers, not independently readable portfolio content.
-- Do not silently reassign a pre-existing collision between a draft and a public URL.
do $$ begin
 if exists(select 1 from public.portfolio_profiles d join public.portfolio_publications p on p.username=d.username where d.id<>p.id)
 then raise exception 'Resolve existing draft/public username collisions before enabling retained aliases'; end if;
end $$;
create table private.portfolio_username_aliases (
 username text primary key,
 profile_id text not null references public.portfolio_profiles(id) on delete cascade,
 created_at timestamptz not null default now()
);
revoke all on private.portfolio_username_aliases from public,anon,authenticated;

create function private.guard_portfolio_username() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 -- Serialize competing claims of a namespace entry across draft saves and publication.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.username,0));
 if exists(select 1 from private.portfolio_username_aliases a where a.username=new.username and a.profile_id<>new.id)
 or exists(select 1 from public.portfolio_profiles p where p.username=new.username and p.id<>new.id)
 or exists(select 1 from public.portfolio_publications p where p.username=new.username and p.id<>new.id)
 then raise exception 'Username belongs to another portfolio or retained alias' using errcode='23505'; end if;
 return new;
end;
$$;
revoke all on function private.guard_portfolio_username() from public,anon,authenticated;
create trigger guard_draft_username before insert or update of username on public.portfolio_profiles
 for each row execute function private.guard_portfolio_username();
create trigger guard_published_username before insert or update of username on public.portfolio_publications
 for each row execute function private.guard_portfolio_username();

create function private.retain_published_username() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if tg_op='DELETE' and not exists(select 1 from public.portfolio_profiles where id=old.id) then return old; end if;
 if tg_op='DELETE' or old.username is distinct from new.username then
   perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(old.username,0));
   if exists(select 1 from private.portfolio_username_aliases where username=old.username and profile_id<>old.id)
   then raise exception 'Retained alias collision' using errcode='23505'; end if;
   insert into private.portfolio_username_aliases(username,profile_id) values(old.username,old.id) on conflict(username) do nothing;
   -- A former alias can become canonical again for the same portfolio.
   if tg_op='UPDATE' then delete from private.portfolio_username_aliases where username=new.username and profile_id=new.id; end if;
 end if;
 if tg_op='DELETE' then return old; end if;
 return new;
end;
$$;
revoke all on function private.retain_published_username() from public,anon,authenticated;
create trigger retain_published_username after update of username on public.portfolio_publications
 for each row execute function private.retain_published_username();
create trigger retain_withdrawn_username after delete on public.portfolio_publications
 for each row execute function private.retain_published_username();

-- Exact lookup only, with no private document or account identity returned.
-- Every alias resolves directly to the current published username; no chains or loops.
create function public.resolve_published_username(requested_username text)
returns table(id text,username text) language sql stable security definer set search_path='' as $$
 select p.id,p.username from public.portfolio_publications p
 where p.username=requested_username or p.id=(select a.profile_id from private.portfolio_username_aliases a where a.username=requested_username)
 limit 1
$$;
revoke all on function public.resolve_published_username(text) from public;
grant execute on function public.resolve_published_username(text) to anon,authenticated;


-- Source: supabase/migrations/20261103150000_unlisted_publications.sql
-- Unlisted is public-by-link, not an authorization boundary.
-- Derive policy from each reviewed snapshot, never the owner's later draft settings.
alter table public.portfolio_publications add column visibility text
 generated always as (coalesce(document->>'publicationVisibility','public')) stored
 check (visibility in ('public','unlisted'));
alter table public.portfolio_public_cvs add column visibility text
 generated always as (coalesce(document->>'publicationVisibility','public')) stored
 check (visibility in ('public','unlisted'));
create index portfolio_discovery_visibility on public.portfolio_publications(visibility,username);


-- Source: supabase/migrations/20261104090000_scheduled_publication.sql
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


-- Source: supabase/migrations/20261104093457_enable_publication_cron.sql
-- Run the existing atomic worker inside Postgres; no HTTP credentials are stored in cron.
do $$ begin
 if to_regprocedure('public.execute_portfolio_schedules()') is null then
   raise exception 'Apply scheduled_publication before enabling its worker';
 end if;
end $$;
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;
revoke all on schema cron from public,anon,authenticated;
select cron.schedule(
 'mydevstudio-publication-worker',
 '* * * * *',
 $$set statement_timeout = '45s'; select public.execute_portfolio_schedules();$$
);


-- Record the exact repository versions for future CLI migration reconciliation.
insert into supabase_migrations.schema_migrations(version,name) values
 ('20261103130000','publication_snapshots'),
 ('20261103140000','retained_username_aliases'),
 ('20261103150000','unlisted_publications'),
 ('20261104090000','scheduled_publication'),
 ('20261104093457','enable_publication_cron') 
on conflict(version) do nothing;
commit;

-- Verification: counts and worker metadata only, never private document content.
select
 (select count(*) from public.portfolio_publications) as published_websites,
 (select count(*) from public.portfolio_public_cvs) as published_cvs,
 has_table_privilege('anon','public.portfolio_profiles','select') as anonymous_private_profile_access,
 has_function_privilege('authenticated','public.execute_portfolio_schedules()','execute') as ordinary_user_worker_access;
select jobid,jobname,schedule,active from cron.job where jobname='mydevstudio-publication-worker';
