-- No paid grants are seeded. Absent records mean Free.
create table public.billing_entitlements (
 account_id uuid primary key references auth.users(id) on delete cascade,
 plan text not null default 'free' check(plan in ('free','pro')),
 status text not null default 'inactive' check(status in ('inactive','active','trialing','past_due','canceled')),
 period_start timestamptz not null,
 period_end timestamptz not null check(period_end>period_start),
 chat_limit integer not null default 0 check(chat_limit between 0 and 100000),
 editor_limit integer not null default 0 check(editor_limit between 0 and 100000)
);
create table public.billing_assignments (
 account_id uuid primary key references public.billing_entitlements(account_id) on delete cascade,
 profile_id text not null references public.portfolio_profiles(id) on delete cascade
);
create index billing_assignments_profile on public.billing_assignments(profile_id);
create table public.billing_usage (
 request_id uuid primary key,
 account_id uuid not null references public.billing_entitlements(account_id) on delete cascade,
 profile_id text not null,
 feature text not null check(feature in ('portfolio_chat','studio_assistant')),
 period_start timestamptz not null,
 created_at timestamptz not null default now(),
 outcome text not null default 'reserved' check(outcome in ('reserved','succeeded','failed'))
);
create index billing_usage_period on public.billing_usage(account_id,period_start,feature);
alter table public.billing_entitlements enable row level security;
alter table public.billing_assignments enable row level security;
alter table public.billing_usage enable row level security;
revoke all on public.billing_entitlements,public.billing_assignments,public.billing_usage from public,anon,authenticated;
grant select on public.billing_entitlements,public.billing_assignments,public.billing_usage to authenticated;
grant insert,update,delete on public.billing_assignments to authenticated;
grant all on public.billing_entitlements,public.billing_assignments,public.billing_usage to service_role;
create policy own_entitlement on public.billing_entitlements for select to authenticated using(account_id=(select auth.uid()));
create policy own_assignment on public.billing_assignments for select to authenticated using(account_id=(select auth.uid()));
create policy own_usage on public.billing_usage for select to authenticated using(account_id=(select auth.uid()));
create policy assign_portfolio on public.billing_assignments for insert to authenticated with check(
 account_id=(select auth.uid()) and
 exists(select 1 from public.portfolio_profiles p where p.id=profile_id and p.owner_id=(select auth.uid())) and
 exists(select 1 from public.billing_entitlements e where e.account_id=(select auth.uid()) and e.plan='pro' and e.status in ('active','trialing') and e.period_start<=now() and e.period_end>now())
);
create policy change_assignment on public.billing_assignments for update to authenticated using(account_id=(select auth.uid())) with check(
 account_id=(select auth.uid()) and
 exists(select 1 from public.portfolio_profiles p where p.id=profile_id and p.owner_id=(select auth.uid())) and
 exists(select 1 from public.billing_entitlements e where e.account_id=(select auth.uid()) and e.plan='pro' and e.status in ('active','trialing') and e.period_start<=now() and e.period_end>now())
);
create policy remove_assignment on public.billing_assignments for delete to authenticated using(account_id=(select auth.uid()));
-- Row locks require UPDATE privilege. This is exclusively the trusted server role.
grant select,update on public.portfolio_profiles to service_role;
create function public.reserve_premium_usage(p_account uuid,p_profile text,p_feature text,p_request uuid)
returns boolean language plpgsql security invoker set search_path='' as $$
declare e public.billing_entitlements%rowtype; allowance integer; used bigint;
begin
 if p_feature is null or p_feature not in ('portfolio_chat','studio_assistant') or p_request is null then return false; end if;
 select * into e from public.billing_entitlements where account_id=p_account for update;
 if not found or e.plan<>'pro' or e.status not in ('active','trialing') or e.period_start>now() or e.period_end<=now() then return false; end if;
 perform 1 from public.billing_assignments where account_id=p_account and profile_id=p_profile for share;
 if not found then return false; end if;
 perform 1 from public.portfolio_profiles where id=p_profile and owner_id=p_account and (p_feature<>'portfolio_chat' or is_public) for share;
 if not found then return false; end if;
 if exists(select 1 from public.billing_usage where request_id=p_request) then return false; end if;
 allowance:=case when p_feature='portfolio_chat' then e.chat_limit else e.editor_limit end;
 select count(*) into used from public.billing_usage where account_id=p_account and period_start=e.period_start and feature=p_feature;
 if used>=allowance then return false; end if;
 insert into public.billing_usage(request_id,account_id,profile_id,feature,period_start) values(p_request,p_account,p_profile,p_feature,e.period_start) on conflict do nothing;
 return found;
end;
$$;
revoke all on function public.reserve_premium_usage(uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function public.reserve_premium_usage(uuid,text,text,uuid) to service_role;
