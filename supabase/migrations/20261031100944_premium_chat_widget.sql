alter table public.billing_assignments add column chat_enabled boolean not null default false;
create or replace function public.reserve_premium_usage(p_account uuid,p_profile text,p_feature text,p_request uuid)
returns boolean language plpgsql security invoker set search_path='' as $$
declare e public.billing_entitlements%rowtype; allowance integer; used bigint;
begin
 if p_feature is null or p_feature not in ('portfolio_chat','studio_assistant') or p_request is null then return false; end if;
 select * into e from public.billing_entitlements where account_id=p_account for update;
 if not found or e.plan<>'pro' or e.status not in ('active','trialing') or e.period_start>now() or e.period_end<=now() then return false; end if;
 perform 1 from public.billing_assignments where account_id=p_account and profile_id=p_profile and (p_feature<>'portfolio_chat' or chat_enabled) for share;
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
