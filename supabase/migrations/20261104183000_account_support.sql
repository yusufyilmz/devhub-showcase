-- Support is metadata-only. Membership is existing server-controlled portfolio_admins.
create table private.support_audit (
 request_id uuid primary key,
 actor_id uuid not null,
 account_id uuid not null,
 action text not null check(action='disable_visitor_chat'),
 reason text not null check(reason in ('customer_request','incident_response','configuration_review')),
 before_enabled boolean not null,
 after_enabled boolean not null default false check(after_enabled=false),
 created_at timestamptz not null default now()
);
alter table private.support_audit enable row level security;
revoke all on private.support_audit from public,anon,authenticated,service_role;
create index support_audit_account_time on private.support_audit(account_id,created_at desc);

create function private.require_support_admin() returns void
language plpgsql security definer set search_path='' as $$
begin
 perform 1 from private.portfolio_admins where user_id=(select auth.uid()) for key share;
 if not found or not exists(select 1 from auth.users where id=(select auth.uid()) and email_confirmed_at is not null) then
 raise exception 'Support access denied' using errcode='42501'; end if;
end;
$$;
revoke all on function private.require_support_admin() from public,anon,authenticated,service_role;

create function public.support_accounts(after_account uuid default null) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
 perform private.require_support_admin();
 return coalesce((select jsonb_agg(to_jsonb(a) order by a.id) from (
 select u.id, u.created_at, u.email_confirmed_at is not null as confirmed
 from auth.users u where (exists(select 1 from public.portfolio_profiles p where p.owner_id=u.id) or exists(select 1 from public.billing_customers b where b.account_id=u.id) or exists(select 1 from public.billing_entitlements e where e.account_id=u.id))
 and (after_account is null or u.id>after_account) order by u.id limit 26
 ) a),'[]'::jsonb);
end;
$$;

create function public.support_account_summary(target_account uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 perform private.require_support_admin();
 select jsonb_build_object(
  'id',u.id,'created_at',u.created_at,'confirmed',u.email_confirmed_at is not null,
  'profiles',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'revision',p.revision,
    'websitePublished',exists(select 1 from public.portfolio_publications w where w.id=p.id),
    'cvPublished',exists(select 1 from public.portfolio_public_cvs c where c.id=p.id)))
    from public.portfolio_profiles p where p.owner_id=u.id),'[]'::jsonb),
  'billing',coalesce((select jsonb_build_object(
    'plan',e.plan,'status',e.status,'periodEnd',e.period_end,
    'active',e.plan='pro' and e.status in ('active','trialing') and e.period_start<=now() and e.period_end>now(),
    'chatLimit',e.chat_limit,'editorLimit',e.editor_limit,
    'chatUsed',(select count(*) from public.billing_usage x where x.account_id=u.id and x.period_start=e.period_start and x.feature='portfolio_chat'),
    'editorUsed',(select count(*) from public.billing_usage x where x.account_id=u.id and x.period_start=e.period_start and x.feature='studio_assistant'),
    'chatEnabled',coalesce((select chat_enabled from public.billing_assignments b where b.account_id=u.id),false)
  ) from public.billing_entitlements e where e.account_id=u.id),jsonb_build_object('plan','free','status','inactive','active',false,'chatLimit',0,'editorLimit',0,'chatUsed',0,'editorUsed',0,'chatEnabled',false)),
  'audit',coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc,a.request_id) from (
    select request_id,actor_id,action,reason,before_enabled,after_enabled,created_at from private.support_audit where account_id=u.id order by created_at desc,request_id limit 50
  ) a),'[]'::jsonb)
 ) into result from auth.users u where u.id=target_account
 and (exists(select 1 from public.portfolio_profiles p where p.owner_id=u.id) or exists(select 1 from public.billing_customers b where b.account_id=u.id) or exists(select 1 from public.billing_entitlements e where e.account_id=u.id));
 if result is null then raise exception 'Studio account unavailable' using errcode='P0002'; end if;
 return result;
end;
$$;

create function public.support_disable_visitor_chat(target_account uuid, request_id uuid, reason text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare previous private.support_audit; enabled boolean;
begin
 perform private.require_support_admin();
 if request_id is null or reason is null or reason not in ('customer_request','incident_response','configuration_review') then
 raise exception 'Select a supported reason' using errcode='22023'; end if;
 -- Serialize a logical request even when retries target different accounts.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(request_id::text,0));
 select * into previous from private.support_audit a where a.request_id=support_disable_visitor_chat.request_id;
 if found then
  if previous.actor_id is distinct from auth.uid() or previous.account_id is distinct from target_account or previous.reason is distinct from reason then
   raise exception 'Request identifier already used' using errcode='42501'; end if;
  return jsonb_build_object('requestId',previous.request_id,'changed',previous.before_enabled);
 end if;
 if not (exists(select 1 from public.portfolio_profiles p where p.owner_id=target_account) or exists(select 1 from public.billing_customers b where b.account_id=target_account) or exists(select 1 from public.billing_entitlements e where e.account_id=target_account)) then
 raise exception 'Studio account unavailable' using errcode='P0002'; end if;
 select chat_enabled into enabled from public.billing_assignments b where b.account_id=target_account for update;
 update public.billing_assignments b set chat_enabled=false where b.account_id=target_account;
 insert into private.support_audit(request_id,actor_id,account_id,action,reason,before_enabled)
 values(request_id,auth.uid(),target_account,'disable_visitor_chat',reason,coalesce(enabled,false));
 return jsonb_build_object('requestId',request_id,'changed',coalesce(enabled,false));
end;
$$;
revoke all on function public.support_accounts(uuid),public.support_account_summary(uuid),public.support_disable_visitor_chat(uuid,uuid,text) from public,anon;
grant execute on function public.support_accounts(uuid),public.support_account_summary(uuid),public.support_disable_visitor_chat(uuid,uuid,text) to authenticated;
