create table public.studio_calendar_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  day date not null,
  start_time time(0) check (start_time < time '24:00' and extract(second from start_time) = 0),
  completed boolean not null default false,
  revision integer not null default 1 check (revision > 0)
);

create index studio_calendar_tasks_user_day_idx on public.studio_calendar_tasks (user_id, day);

alter table public.studio_calendar_tasks enable row level security;
revoke all on public.studio_calendar_tasks from public, anon, authenticated;
grant select, insert, update, delete on public.studio_calendar_tasks to authenticated;

create policy "users manage their own Studio calendar tasks"
  on public.studio_calendar_tasks for all to authenticated
  using (
    user_id = (select auth.uid())
    and not coalesce((select auth.jwt() ->> 'is_anonymous')::boolean, false)
  )
  with check (
    user_id = (select auth.uid())
    and not coalesce((select auth.jwt() ->> 'is_anonymous')::boolean, false)
  );
