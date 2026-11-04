-- Public documents are explicit snapshots; private saves no longer feed anonymous reads.
create function private.project_portfolio_document(source jsonb, surface text) returns jsonb
language plpgsql immutable set search_path = '' as $$
declare
  result jsonb := source - 'birthDate' - 'cvUrl';
  flags jsonb;
  field text;
  pair record;
  items jsonb;
  section jsonb;
  sections jsonb := '[]'::jsonb;
  allowed jsonb;
begin
  if jsonb_typeof(source) <> 'object' or surface not in ('website','cv') then raise exception 'Invalid projection'; end if;
  flags := coalesce(source -> case when surface='website' then 'websiteFields' else 'cvFields' end, '{}'::jsonb);
  foreach field in array array['email','phone','location','website','github','linkedin'] loop
    if flags->field = 'false'::jsonb then result := jsonb_set(result,array[field],'""'::jsonb); end if;
  end loop;
  select coalesce(jsonb_agg(value),'[]'::jsonb) into items from jsonb_array_elements(coalesce(result->'projects','[]'::jsonb)) where value->'public'='true'::jsonb;
  result := jsonb_set(result,'{projects}',items);
  if surface='cv' then
    if source#>'{cvSettings,showEmail}'='false'::jsonb then result:=jsonb_set(result,'{email}','""'::jsonb); end if;
    if source#>'{cvSettings,showPhone}'='false'::jsonb then result:=jsonb_set(result,'{phone}','""'::jsonb); end if;
    if source#>'{cvSettings,includeProjects}'='false'::jsonb then result:=jsonb_set(result,'{projects}','[]'::jsonb); end if;
    if source#>'{cvSettings,includeLanguages}'='false'::jsonb then result:=jsonb_set(result,'{languages}','[]'::jsonb); end if;
    result:=result-'customSections'-'hero'-'sectionSequence'-'sectionOrder'-'sectionSettings';
  else
    for pair in select * from (values ('about','about'),('projects','projects'),('experience','experiences'),('education','education'),('languages','languages'),('skills','skills')) as map(kind,key) loop
      if source#>array['sectionSettings',pair.kind,'visible']='false'::jsonb then
        result:=jsonb_set(result,array[pair.key],case when pair.key='skills' then '{}'::jsonb else '[]'::jsonb end);
      elsif source#>array['sectionSettings',pair.kind,'itemIds'] is not null and pair.key not in ('about','skills') then
        select coalesce(jsonb_agg(value),'[]'::jsonb) into items from jsonb_array_elements(result->pair.key) where (source#>array['sectionSettings',pair.kind,'itemIds']) ? (value->>'id');
        result:=jsonb_set(result,array[pair.key],items);
      elsif pair.key='skills' and source#>'{sectionSettings,skills,itemIds}' is not null then
        select coalesce(jsonb_object_agg(key,value),'{}'::jsonb) into items from jsonb_each(result->'skills') where (source#>'{sectionSettings,skills,itemIds}') ? key;
        result:=jsonb_set(result,'{skills}',items);
      end if;
      if result#>array['sectionSettings',pair.kind] is not null then result:=jsonb_set(result,array['sectionSettings',pair.kind],(result#>array['sectionSettings',pair.kind])-'itemIds'); end if;
    end loop;
    for section in select value from jsonb_array_elements(coalesce(result->'customSections','[]'::jsonb)) loop
      if section->'visible'<>'true'::jsonb or (section->>'sectionType'='map' and flags->'location'='false'::jsonb) then continue; end if;
      if section->'source' is not null then
        section:=jsonb_set(section,'{items}','[]'::jsonb);
        field:=section#>>'{source,field}';
        if section#>'{source,itemIds}' is not null then
          if field='about' then allowed:='["about"]'::jsonb;
          elsif field='skills' then select coalesce(jsonb_agg(key),'[]'::jsonb) into allowed from jsonb_each(result->'skills');
          else select coalesce(jsonb_agg(value->>'id'),'[]'::jsonb) into allowed from jsonb_array_elements(coalesce(result->field,'[]'::jsonb)); end if;
          select coalesce(jsonb_agg(value),'[]'::jsonb) into items from jsonb_array_elements(section#>'{source,itemIds}') where allowed ? (value#>>'{}');
          section:=jsonb_set(section,'{source,itemIds}',items);
        end if;
      end if;
      if flags->'email'='false'::jsonb and section->'options' is not null then section:=jsonb_set(section,'{options}',(section->'options')-'email'); end if;
      sections:=sections||jsonb_build_array(section);
    end loop;
    result:=jsonb_set(result,'{customSections}',sections);
    if result->'sectionSequence' is not null then
      select coalesce(jsonb_agg(seq.value),'[]'::jsonb) into items from jsonb_array_elements(result->'sectionSequence') seq(value) where left(seq.value#>>'{}',7)<>'custom-' or exists(select 1 from jsonb_array_elements(sections) sec(value) where sec.value->>'id'=seq.value#>>'{}');
      result:=jsonb_set(result,'{sectionSequence}',items);
    end if;
  end if;
  select coalesce(jsonb_agg(case when project.value->>'experienceId' is not null and not exists(select 1 from jsonb_array_elements(result->'experiences') experience(value) where experience.value->>'id'=project.value->>'experienceId') then jsonb_set(project.value,'{experienceId}','null'::jsonb) else project.value end),'[]'::jsonb) into items from jsonb_array_elements(result->'projects') project(value);
  return jsonb_set(result,'{projects}',items);
end;
$$;
revoke all on function private.project_portfolio_document(jsonb,text) from public, anon, authenticated;

create table public.portfolio_publications (
 id text primary key references public.portfolio_profiles(id) on delete cascade,
 username text not null unique,
 document jsonb not null,
 revision integer not null,
 updated_at timestamptz not null default now()
);
create table public.portfolio_public_cvs (like public.portfolio_publications including all);
alter table public.portfolio_public_cvs add foreign key(id) references public.portfolio_profiles(id) on delete cascade;
alter table public.portfolio_publications enable row level security;
alter table public.portfolio_public_cvs enable row level security;
revoke all on public.portfolio_publications,public.portfolio_public_cvs from public,anon,authenticated;
grant select on public.portfolio_publications,public.portfolio_public_cvs to anon,authenticated;
create policy publication_read on public.portfolio_publications for select to anon,authenticated using(true);
create policy publication_cv_read on public.portfolio_public_cvs for select to anon,authenticated using(true);
-- Preserve existing publication during migration, but sanitize before opening the new public surface.
insert into public.portfolio_publications(id,username,document,revision,updated_at)
 select id,username,private.project_portfolio_document(document,'website'),revision,updated_at from public.portfolio_profiles where is_public;
insert into public.portfolio_public_cvs(id,username,document,revision,updated_at)
 select id,username,private.project_portfolio_document(document,'cv'),revision,updated_at from public.portfolio_profiles where is_public;
drop policy "Read published CV" on public.portfolio_profiles;
revoke select on public.portfolio_profiles from anon;
revoke update(is_public) on public.portfolio_profiles from authenticated;

create function public.set_portfolio_publication(profile_id text, expected_revision integer, publish boolean)
returns integer language plpgsql security definer set search_path = '' as $$
declare p public.portfolio_profiles%rowtype;
begin
 select * into p from public.portfolio_profiles where id=profile_id for update;
 if not found or auth.uid() is null or not coalesce((p.owner_id=auth.uid() or (p.owner_id is null and p.managed_by=auth.uid() and private.is_portfolio_admin())), false) then raise exception 'Publication access denied' using errcode='42501'; end if;
 if expected_revision is null or p.revision<>expected_revision then raise exception 'Publication revision conflict' using errcode='40001'; end if;
 if publish is null then raise exception 'Publication choice required' using errcode='22023'; end if;
 if publish then
   insert into public.portfolio_publications(id,username,document,revision) values(p.id,p.username,private.project_portfolio_document(p.document,'website'),p.revision)
    on conflict(id) do update set username=excluded.username,document=excluded.document,revision=excluded.revision,updated_at=now();
   insert into public.portfolio_public_cvs(id,username,document,revision) values(p.id,p.username,private.project_portfolio_document(p.document,'cv'),p.revision)
    on conflict(id) do update set username=excluded.username,document=excluded.document,revision=excluded.revision,updated_at=now();
 else
   delete from public.portfolio_publications where id=p.id;
   delete from public.portfolio_public_cvs where id=p.id;
 end if;
 update public.portfolio_profiles set is_public=publish where id=p.id;
 return p.revision;
end;
$$;
revoke all on function public.set_portfolio_publication(text,integer,boolean) from public,anon;
grant execute on function public.set_portfolio_publication(text,integer,boolean) to authenticated;
