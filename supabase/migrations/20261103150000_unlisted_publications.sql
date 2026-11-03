-- Unlisted is public-by-link, not an authorization boundary.
-- Derive policy from each reviewed snapshot, never the owner's later draft settings.
alter table public.portfolio_publications add column visibility text
 generated always as (coalesce(document->>'publicationVisibility','public')) stored
 check (visibility in ('public','unlisted'));
alter table public.portfolio_public_cvs add column visibility text
 generated always as (coalesce(document->>'publicationVisibility','public')) stored
 check (visibility in ('public','unlisted'));
create index portfolio_discovery_visibility on public.portfolio_publications(visibility,username);
