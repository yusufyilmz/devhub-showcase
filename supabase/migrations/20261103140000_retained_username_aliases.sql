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
