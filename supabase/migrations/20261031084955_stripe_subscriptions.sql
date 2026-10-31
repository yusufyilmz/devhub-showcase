create table public.billing_customers (
 account_id uuid primary key references auth.users(id) on delete cascade,
 customer_id text unique,
 checkout_id text,
 checkout_key uuid not null default gen_random_uuid(),
 lease uuid,
 lease_until timestamptz
);
create table public.billing_events (event_id text primary key, processed_at timestamptz not null default now());
alter table public.billing_customers enable row level security;
alter table public.billing_events enable row level security;
revoke all on public.billing_customers,public.billing_events from public,anon,authenticated;
grant all on public.billing_customers,public.billing_events to service_role;
create function public.claim_billing(p_account uuid,p_lease uuid) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 insert into public.billing_customers(account_id) values(p_account) on conflict do nothing;
 update public.billing_customers set lease=p_lease,lease_until=clock_timestamp()+interval '90 seconds'
 where account_id=p_account and (lease is null or lease_until<clock_timestamp());
 return found;
end; $$;
create function public.commit_billing(p_account uuid,p_lease uuid,p_state jsonb,p_event text) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 perform 1 from public.billing_customers where account_id=p_account and lease=p_lease and lease_until>clock_timestamp() for update;
 if not found then return false; end if;
 if p_event is not null and exists(select 1 from public.billing_events where event_id=p_event) then return true; end if;
 insert into public.billing_entitlements(account_id,plan,status,period_start,period_end,chat_limit,editor_limit)
 values(p_account,case when p_state->>'status' in ('active','trialing') then 'pro' else 'free' end,p_state->>'status',(p_state->>'start')::timestamptz,(p_state->>'end')::timestamptz,(p_state->>'chat')::integer,(p_state->>'editor')::integer)
 on conflict(account_id) do update set plan=excluded.plan,status=excluded.status,period_start=excluded.period_start,period_end=excluded.period_end,chat_limit=excluded.chat_limit,editor_limit=excluded.editor_limit;
 if p_event is not null then insert into public.billing_events(event_id) values(p_event); end if;
 return true;
end; $$;
revoke all on function public.claim_billing(uuid,uuid),public.commit_billing(uuid,uuid,jsonb,text) from public,anon,authenticated;
grant execute on function public.claim_billing(uuid,uuid),public.commit_billing(uuid,uuid,jsonb,text) to service_role;
