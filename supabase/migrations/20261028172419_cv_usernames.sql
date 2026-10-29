-- A stable public handle is separate from the immutable profile ID and auth UUID.
alter table public.portfolio_profiles add column username text;
update public.portfolio_profiles set username = case when id = 'main' then 'yusufyilmz' else 'cv-' || id end;
alter table public.portfolio_profiles alter column username set default 'cv-' || gen_random_uuid()::text;
alter table public.portfolio_profiles alter column username set not null;
alter table public.portfolio_profiles add constraint portfolio_profiles_username_unique unique(username);
alter table public.portfolio_profiles add constraint portfolio_profiles_username_format check (
 length(username) between 3 and 50 and username ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
 and username not in ('admin','api','auth','p','reviews','login','logout','edit','settings','new','account','cv','www')
);
-- The existing owner-only UPDATE policy governs username changes as well.
grant update(username) on public.portfolio_profiles to authenticated;
