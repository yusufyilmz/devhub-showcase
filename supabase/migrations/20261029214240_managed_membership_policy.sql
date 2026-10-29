-- Explicit deny policy documents that only the private helper may read membership.
create policy "Membership is not client readable" on private.portfolio_admins
 for all to authenticated using (false) with check (false);
