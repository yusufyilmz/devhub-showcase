-- Keep published website and CV snapshots aligned with the application page projection.
create function private.prune_builder_site(result jsonb) returns jsonb
language plpgsql immutable set search_path = '' as $$
declare
  pages jsonb := '[]'::jsonb;
  home jsonb;
  reached_custom jsonb := '[]'::jsonb;
  reached_kinds jsonb := '[]'::jsonb;
  reach_intro boolean := false;
  reach_contact boolean := false;
  placement jsonb;
  sections jsonb;
  sequence jsonb;
  field text;
  pair record;
begin
  if result->'site' is null or jsonb_typeof(result->'site') <> 'object' then return result; end if;
  select coalesce(jsonb_agg(page.value order by page.ord), '[]'::jsonb) into pages
  from jsonb_array_elements(coalesce(result#>'{site,pages}', '[]'::jsonb)) with ordinality as page(value, ord)
  where page.value->'published' = 'true'::jsonb;
  select page.value into home from jsonb_array_elements(pages) page(value)
  where page.value->>'id' = result#>>'{site,homePageId}' limit 1;
  if home is null or not exists (
    select 1 from jsonb_array_elements(coalesce(home->'placements', '[]'::jsonb)) placement(value)
    where placement.value->'visible' = 'true'::jsonb
  ) then
    result := result || jsonb_build_object(
      'about', '[]'::jsonb,
      'customSections', '[]'::jsonb,
      'education', '[]'::jsonb,
      'email', '""'::jsonb,
      'experiences', '[]'::jsonb,
      'github', '""'::jsonb,
      'languages', '[]'::jsonb,
      'linkedin', '""'::jsonb,
      'location', '""'::jsonb,
      'phone', '""'::jsonb,
      'projects', '[]'::jsonb,
      'skills', '{}'::jsonb,
      'summary', '""'::jsonb,
      'website', '""'::jsonb
    );
    result := result - 'sectionSequence';
    return jsonb_set(result, '{site}', (result->'site') || jsonb_build_object('navigation', '[]'::jsonb, 'pages', '[]'::jsonb));
  end if;
  for placement in
    select item.value from jsonb_array_elements(pages) page(value)
    cross join lateral jsonb_array_elements(coalesce(page.value->'placements', '[]'::jsonb)) item(value)
    where item.value->'visible' = 'true'::jsonb
  loop
    if placement#>>'{reference,type}' = 'custom-section' then
      reached_custom := reached_custom || jsonb_build_array(to_jsonb(placement#>>'{reference,id}'));
    elsif placement#>>'{reference,type}' = 'profile-section' then
      reached_kinds := reached_kinds || jsonb_build_array(to_jsonb(placement#>>'{reference,kind}'));
    elsif placement#>>'{reference,type}' = 'profile-intro' then reach_intro := true;
    elsif placement#>>'{reference,type}' = 'profile-contact' then reach_contact := true;
    end if;
  end loop;
  select coalesce(jsonb_agg(section.value order by section.ord), '[]'::jsonb) into sections
  from jsonb_array_elements(coalesce(result->'customSections', '[]'::jsonb)) with ordinality as section(value, ord)
  where reached_custom ? (section.value->>'id');
  result := jsonb_set(result, '{customSections}', sections);
  if not reach_intro and not (reached_kinds ? 'about') then
    result := jsonb_set(jsonb_set(result, '{about}', '[]'::jsonb), '{summary}', '""'::jsonb);
  end if;
  if not reach_contact then
    foreach field in array array['email','phone','location','website','github','linkedin'] loop
      result := jsonb_set(result, array[field], '""'::jsonb);
    end loop;
  end if;
  for pair in select * from (values
    ('about','about'), ('education','education'), ('experience','experiences'),
    ('languages','languages'), ('projects','projects'), ('skills','skills')
  ) as map(kind, key) loop
    if reached_kinds ? pair.kind then continue; end if;
    if result#>array['sectionSettings', pair.kind] is null then
      result := jsonb_set(result, array['sectionSettings', pair.kind], '{"visible":false}'::jsonb);
    else
      result := jsonb_set(result, array['sectionSettings', pair.kind, 'visible'], 'false'::jsonb);
    end if;
    if pair.kind = 'about' and reach_intro then continue; end if;
    result := jsonb_set(result, array[pair.key], case when pair.key = 'skills' then '{}'::jsonb else '[]'::jsonb end);
  end loop;
  select coalesce(jsonb_agg(
    jsonb_set(page.value, '{placements}', (
      select coalesce(jsonb_agg(item.value order by item.ord), '[]'::jsonb)
      from jsonb_array_elements(coalesce(page.value->'placements', '[]'::jsonb)) with ordinality as item(value, ord)
      where item.value->'visible' = 'true'::jsonb
        and (item.value#>>'{reference,type}' <> 'custom-section' or reached_custom ? (item.value#>>'{reference,id}'))
    )) order by page.ord
  ), '[]'::jsonb) into pages
  from jsonb_array_elements(pages) with ordinality as page(value, ord);
  select coalesce(jsonb_agg(item.value order by item.ord), '[]'::jsonb) into sequence
  from jsonb_array_elements(coalesce(result#>'{site,navigation}', '[]'::jsonb)) with ordinality as item(value, ord)
  where exists (
    select 1 from jsonb_array_elements(pages) page(value) where page.value->>'id' = item.value->>'pageId'
  );
  result := jsonb_set(result, '{site,navigation}', sequence);
  result := jsonb_set(result, '{site,pages}', pages);
  if result->'sectionSequence' is not null then
    select coalesce(jsonb_agg(seq.value order by seq.ord), '[]'::jsonb) into sequence
    from jsonb_array_elements(result->'sectionSequence') with ordinality as seq(value, ord)
    where left(seq.value#>>'{}', 7) <> 'custom-' or reached_custom ? (seq.value#>>'{}');
    result := jsonb_set(result, '{sectionSequence}', sequence);
  end if;
  return result;
end;
$$;

create or replace function private.project_portfolio_document(source jsonb, surface text) returns jsonb
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
    result:=result-'customSections'-'hero'-'sectionSequence'-'sectionOrder'-'sectionSettings'-'site';
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
    result := private.prune_builder_site(result);
  end if;
  select coalesce(jsonb_agg(case when project.value->>'experienceId' is not null and not exists(select 1 from jsonb_array_elements(result->'experiences') experience(value) where experience.value->>'id'=project.value->>'experienceId') then jsonb_set(project.value,'{experienceId}','null'::jsonb) else project.value end),'[]'::jsonb) into items from jsonb_array_elements(result->'projects') project(value);
  return jsonb_set(result,'{projects}',items);
end;
$$;
