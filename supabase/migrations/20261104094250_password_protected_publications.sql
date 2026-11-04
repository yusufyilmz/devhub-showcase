-- Protected snapshot documents are never readable using the anonymous Data API.
alter table public.portfolio_publications drop constraint portfolio_publications_visibility_check;
alter table public.portfolio_publications add constraint portfolio_publications_visibility_check check(visibility in ('public','unlisted','password'));
alter table public.portfolio_public_cvs drop constraint portfolio_public_cvs_visibility_check;
alter table public.portfolio_public_cvs add constraint portfolio_public_cvs_visibility_check check(visibility in ('public','unlisted','password'));

create table private.portfolio_passwords (
 profile_id text primary key references public.portfolio_profiles(id) on delete cascade,
 password_digest text not null check(password_digest ~ '^scrypt-v1[$][0-9a-f]{32}[$][0-9a-f]{64}$'),
 access_version uuid not null default gen_random_uuid()
);
create table private.portfolio_access_attempts (
 bucket text primary key,
 started_at timestamptz not null default now(),
 attempts integer not null
);
alter table private.portfolio_passwords enable row level security;
alter table private.portfolio_access_attempts enable row level security;
revoke all on private.portfolio_passwords,private.portfolio_access_attempts from public,anon,authenticated;

create function private.can_manage_publication(profile_id text) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.portfolio_profiles p where p.id=profile_id and
 (p.owner_id=auth.uid() or (p.owner_id is null and p.managed_by=auth.uid() and private.is_portfolio_admin())))
$$;
revoke all on function private.can_manage_publication(text) from public,anon;
grant execute on function private.can_manage_publication(text) to authenticated;
drop policy publication_read on public.portfolio_publications;
drop policy publication_cv_read on public.portfolio_public_cvs;
create policy publication_open_read on public.portfolio_publications for select to anon,authenticated using(visibility<>'password');
create policy publication_managed_read on public.portfolio_publications for select to authenticated using(private.can_manage_publication(id));
create policy publication_cv_open_read on public.portfolio_public_cvs for select to anon,authenticated using(visibility<>'password');
create policy publication_cv_managed_read on public.portfolio_public_cvs for select to authenticated using(private.can_manage_publication(id));

create or replace function public.set_portfolio_publication(profile_id text, expected_revision integer, publish boolean) returns integer
language plpgsql security definer set search_path='' as $$
declare p public.portfolio_profiles; revision integer;
begin
 p:=private.authorized_publication_profile(profile_id);
 if p.revision is distinct from expected_revision then raise exception 'Revision changed' using errcode='40001'; end if;
 if publish and p.document->>'publicationVisibility'='password' then
   if not exists(select 1 from private.portfolio_passwords where portfolio_passwords.profile_id=p.id) then
     raise exception 'Set a publication password' using errcode='22023'; end if;
   update private.portfolio_passwords set access_version=gen_random_uuid() where portfolio_passwords.profile_id=p.id;
 else
   delete from private.portfolio_passwords where portfolio_passwords.profile_id=p.id;
 end if;
 revision:=private.set_portfolio_publication(profile_id,expected_revision,publish);
 update private.portfolio_schedules set state='cancelled',finished_at=now() where portfolio_schedules.profile_id=p.id and state='pending';
 return revision;
end;
$$;
create function public.publish_portfolio_with_password(profile_id text, expected_revision integer, password_digest text) returns integer
language plpgsql security definer set search_path='' as $$
declare p public.portfolio_profiles;
begin
 p:=private.authorized_publication_profile(profile_id);
 if p.revision is distinct from expected_revision then raise exception 'Revision changed' using errcode='40001'; end if;
 if p.document->>'publicationVisibility' is distinct from 'password' or password_digest is null or password_digest !~ '^scrypt-v1[$][0-9a-f]{32}[$][0-9a-f]{64}$' then
   raise exception 'Invalid protected publication' using errcode='22023'; end if;
 insert into private.portfolio_passwords(profile_id,password_digest) values(p.id,password_digest)
 on conflict on constraint portfolio_passwords_pkey do update set password_digest=excluded.password_digest,access_version=gen_random_uuid();
 return public.set_portfolio_publication(p.id,p.revision,true);
end;
$$;
revoke all on function public.publish_portfolio_with_password(text,integer,text) from public,anon;
grant execute on function public.publish_portfolio_with_password(text,integer,text) to authenticated;

-- A gate may disclose only a published handle, never a profile document or password record.
create function public.portfolio_access_status(requested_username text) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('id',id,'username',username) from public.portfolio_publications where username=requested_username and visibility='password'
$$;
revoke all on function public.portfolio_access_status(text) from public;
grant execute on function public.portfolio_access_status(text) to anon,authenticated;
create function public.portfolio_password_record(profile_id text) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('password_digest',c.password_digest,'access_version',c.access_version)
 from private.portfolio_passwords c join public.portfolio_publications p on p.id=c.profile_id where c.profile_id=portfolio_password_record.profile_id and p.visibility='password'
$$;
-- The application verifies a signed browser grant before calling this server-only RPC.
-- Version checking and the snapshot read share one database statement to avoid a revocation race.
create function public.read_protected_publication(profile_id text, access_version uuid, surface text) returns jsonb
language sql stable security definer set search_path='' as $$
 select to_jsonb(snapshot) from (
 select p.id,p.username,p.document,p.revision,p.updated_at from public.portfolio_publications p
 join private.portfolio_passwords c on c.profile_id=p.id
 where p.id=read_protected_publication.profile_id and p.visibility='password' and c.access_version=read_protected_publication.access_version and surface='website'
 union all
 select p.id,p.username,p.document,p.revision,p.updated_at from public.portfolio_public_cvs p
 join private.portfolio_passwords c on c.profile_id=p.id
 where p.id=read_protected_publication.profile_id and p.visibility='password' and c.access_version=read_protected_publication.access_version and surface='cv'
 ) snapshot
$$;
create function public.reserve_portfolio_access_attempt(request_bucket text) returns boolean
language plpgsql security definer set search_path='' as $$
declare total integer; individual integer;
begin
 if request_bucket is null or request_bucket !~ '^[0-9a-f]{64}$' then return false; end if;
 -- Serializing the small counters bounds concurrent expensive password checks across instances.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('portfolio-access-limit',0));
 delete from private.portfolio_access_attempts where started_at<now()-interval '10 minutes';
 insert into private.portfolio_access_attempts(bucket,attempts) values('global',1)
 on conflict(bucket) do update set attempts=case when portfolio_access_attempts.started_at<now()-interval '1 minute' then 1 else portfolio_access_attempts.attempts+1 end,
 started_at=case when portfolio_access_attempts.started_at<now()-interval '1 minute' then now() else portfolio_access_attempts.started_at end returning attempts into total;
 if total>30 then return false; end if;
 insert into private.portfolio_access_attempts(bucket,attempts) values(request_bucket,1)
 on conflict(bucket) do update set attempts=case when portfolio_access_attempts.started_at<now()-interval '5 minutes' then 1 else portfolio_access_attempts.attempts+1 end,
 started_at=case when portfolio_access_attempts.started_at<now()-interval '5 minutes' then now() else portfolio_access_attempts.started_at end returning attempts into individual;
 return individual<=5;
end;
$$;
revoke all on function public.portfolio_password_record(text),public.read_protected_publication(text,uuid,text),public.reserve_portfolio_access_attempt(text) from public,anon,authenticated;
grant execute on function public.portfolio_password_record(text),public.read_protected_publication(text,uuid,text),public.reserve_portfolio_access_attempt(text) to service_role;

create function private.invalidate_transferred_password() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if old.owner_id is distinct from new.owner_id or old.managed_by is distinct from new.managed_by then
 delete from private.portfolio_passwords where profile_id=new.id; end if;
 return new;
end;
$$;
revoke all on function private.invalidate_transferred_password() from public,anon,authenticated;
create trigger invalidate_transferred_password after update of owner_id,managed_by on public.portfolio_profiles for each row execute function private.invalidate_transferred_password();
