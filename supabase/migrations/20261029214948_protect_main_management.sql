-- The original portfolio can never become a temporary managed record.
alter table public.portfolio_profiles add constraint main_profile_not_managed
 check (id <> 'main' or managed_by is null);
