-- These legacy testimonials belong to the original portfolio.
alter table public.referrals enable row level security;
alter table public.reviews enable row level security;

revoke all on public.referrals, public.reviews from public, anon, authenticated;
grant select on public.referrals, public.reviews to authenticated;
grant update (state, updated_at) on public.reviews to authenticated;

create policy "Original owner reads referrals" on public.referrals
for select to authenticated using (
  exists (select 1 from public.portfolio_profiles
          where id = 'main' and owner_id = (select auth.uid()))
);

create policy "Original owner reads reviews" on public.reviews
for select to authenticated using (
  exists (select 1 from public.portfolio_profiles
          where id = 'main' and owner_id = (select auth.uid()))
);

create policy "Original owner decides pending reviews" on public.reviews
for update to authenticated using (
  state = 'PENDING' and exists (
    select 1 from public.portfolio_profiles where id = 'main' and owner_id = (select auth.uid())
  )
) with check (
  state in ('APPROVED', 'REJECTED') and exists (
    select 1 from public.portfolio_profiles where id = 'main' and owner_id = (select auth.uid())
  )
);

alter table public.referrals alter column id set default gen_random_uuid()::text;

-- The server-only intake writes the referral and queues its new content together.
create function private.queue_portfolio_review()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    if row(new.name, new.relationship, new.feedback, new.recommendation, new.contact_info)
       is not distinct from
       row(old.name, old.relationship, old.feedback, old.recommendation, old.contact_info) then
      return new;
    end if;
  end if;

  insert into public.reviews (id, referral_id, state, updated_at)
  values (gen_random_uuid()::text, new.id, 'PENDING', clock_timestamp() at time zone 'UTC')
  on conflict (referral_id) do update
    set state = 'PENDING',
        updated_at = greatest(excluded.updated_at, reviews.updated_at + interval '1 millisecond');
  return new;
end;
$$;

revoke all on function private.queue_portfolio_review() from public, anon, authenticated;

create trigger queue_portfolio_review
after insert or update on public.referrals
for each row execute function private.queue_portfolio_review();
