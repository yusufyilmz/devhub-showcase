-- Run manually after creating and confirming your Supabase Auth user.
-- This is intentionally separate from the migration and never runs in CI.
do $$
declare admin_id uuid;
begin
 select id into strict admin_id from auth.users
 where lower(email) = 'yilmazyu@gmail.com' and email_confirmed_at is not null;
 update public.portfolio_profiles set owner_id = admin_id where id = 'main';
 if not found then raise exception 'Apply the portfolio migration first'; end if;
end $$;
