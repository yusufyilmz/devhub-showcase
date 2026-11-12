-- Run with psql -v ON_ERROR_STOP=1 against a disposable database with the migration applied.
begin;
insert into auth.users (id, email) values
  ('741fc347-441a-4331-9281-16c841164734', 'job-owner@example.test'),
  ('741fc347-441a-4331-9281-16c841164735', 'other-owner@example.test');
set local role authenticated;
select set_config('request.jwt.claim.sub', '741fc347-441a-4331-9281-16c841164734', true);
insert into public.job_searches (name, filters, hours, threshold, enabled)
values ('London', '{"title":"Engineer","country":"gb"}', 3, 85, true);
do $$
begin
  if (select count(*) from public.job_searches) <> 1 then raise exception 'Owner cannot read search'; end if;
  begin
    perform public.claim_job_search();
    raise exception 'Owner can claim privileged work';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.job_searches set due_at = now();
    raise exception 'Owner can overwrite scheduler fields';
  exception when insufficient_privilege then null;
  end;
end;
$$;

set local role service_role;
insert into public.job_push_devices (id, user_id, subscription)
values ('fixture', '741fc347-441a-4331-9281-16c841164734', '{}');
do $$
declare
  claimed public.job_searches;
  delivery record;
  result jsonb := '[{"id":"listing","listing":{"title":"Engineer"},"score":92,"cvRevision":1,"explanation":{"reason":"Test"}}]';
begin
  if not public.reserve_job_provider_request('jooble', 'gb', 1)
    or public.reserve_job_provider_request('jooble', 'gb', 1)
    or not public.reserve_job_provider_request('jooble', 'es', 1) then
    raise exception 'Provider quota is not isolated by market';
  end if;
  select * into strict claimed from public.claim_job_search();
  if exists (select from public.claim_job_search()) then raise exception 'Claim repeated'; end if;
  if not public.finish_job_search(claimed.id, claimed.lease, result, 1, '{}', false) then
    raise exception 'Worker failed to commit';
  end if;
  if public.finish_job_search(claimed.id, claimed.lease, result, 1, '{}', false) then
    raise exception 'Stale worker can commit';
  end if;
  update public.job_searches set due_at = now();
  select * into strict claimed from public.claim_job_search();
  result := jsonb_set(jsonb_set(result, '{0,cvRevision}', '2'), '{0,score}', '94');
  perform public.finish_job_search(claimed.id, claimed.lease, result, 1, '{Jooble unavailable}', true);
  if (select score from public.job_matches) <> 94 then raise exception 'CV revision did not refresh match'; end if;
  if (select failures from public.job_searches) <> 1 then raise exception 'Retry was not scheduled'; end if;
  if (select count(*) from public.job_matches) <> 1 then raise exception 'Duplicate match'; end if;
  if (select count(*) from public.job_push_deliveries) <> 1 then raise exception 'Duplicate alert'; end if;
  select * into strict delivery from public.claim_job_push(20);
  if delivery.attempt <> 1 then raise exception 'Incorrect delivery attempt'; end if;
  perform public.finish_job_push(delivery.id, delivery.lease, 'sent');
  if exists (select from public.claim_job_push(20)) then raise exception 'Delivery repeated'; end if;
end;
$$;

set local role authenticated;
insert into public.job_applications (listing_id, status)
values ('listing', 'opened') on conflict (user_id, listing_id) do nothing;
insert into public.job_applications (listing_id, draft)
values ('listing', '{"summary":"Fictional draft"}') on conflict (user_id, listing_id)
do update set listing_id = excluded.listing_id, draft = excluded.draft;
do $$
begin
  if (select status from public.job_applications) <> 'opened' then raise exception 'Draft overwrote status'; end if;
end;
$$;

select set_config('request.jwt.claim.sub', '741fc347-441a-4331-9281-16c841164735', true);
do $$
begin
  if exists (select from public.job_searches) or exists (select from public.job_listings)
    or exists (select from public.job_matches) or exists (select from public.job_scan_runs)
    or exists (select from public.job_applications) then
    raise exception 'Another user can read private Job Hunter data';
  end if;
  begin
    insert into public.job_applications (listing_id, status) values ('listing', 'opened');
    raise exception 'Another user can attach an application to a private match';
  exception when foreign_key_violation then null;
  end;
end;
$$;

set local role anon;
do $$
begin
  begin
    perform 1 from public.job_searches;
    raise exception 'Anonymous can query private searches';
  exception when insufficient_privilege then null;
  end;
end;
$$;
rollback;
