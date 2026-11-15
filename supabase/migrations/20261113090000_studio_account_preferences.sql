create table public.studio_account_preferences (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null check (
    key ~ '^(mode|theme:[a-z-]{1,40}|layout:(studio|portfolio)|tips:(studio|portfolio))$'
  ),
  value jsonb check (octet_length(value::text) <= 512),
  primary key (user_id, key)
);

alter table public.studio_account_preferences enable row level security;
revoke all on public.studio_account_preferences from public, anon, authenticated;
grant select, insert, update on public.studio_account_preferences to authenticated;

create policy "users manage their own Studio preferences"
  on public.studio_account_preferences for all to authenticated
  using (
    user_id = (select auth.uid())
    and not coalesce((select auth.jwt() ->> 'is_anonymous')::boolean, false)
  )
  with check (
    user_id = (select auth.uid())
    and not coalesce((select auth.jwt() ->> 'is_anonymous')::boolean, false)
  );
