-- Fitness task data for the same Supabase Auth users as the portfolio tables.
-- user_id references auth.users. Deleting that user removes the fitness workspace.
-- The legacy JSON table stays so an existing v1 document can be imported once.

create table public.fitness_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision integer not null default 0 check (revision >= 0),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);
alter table public.fitness_workspaces enable row level security;
revoke all on public.fitness_workspaces from public, anon, authenticated;
grant select, insert, update on public.fitness_workspaces to authenticated;
create policy "Read own fitness workspace" on public.fitness_workspaces
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own fitness workspace" on public.fitness_workspaces
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own fitness workspace" on public.fitness_workspaces
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table public.task_day_overrides (
  user_id uuid not null,
  date date not null,
  diet_task_id text not null,
  workout_task_id text,
  constraint task_day_overrides_user_id_date_pk primary key (user_id, date)
);
alter table public.task_day_overrides enable row level security;

create table public.task_meal_choices (
  user_id uuid not null,
  id text not null,
  date date not null,
  meal_source_id text not null,
  group_id text not null,
  ingredient_key text not null,
  constraint task_meal_choices_user_id_id_pk primary key (user_id, id)
);
alter table public.task_meal_choices enable row level security;

create table public.task_diet_rotation (
  user_id uuid not null,
  position integer not null,
  task_id text not null,
  constraint task_diet_rotation_user_id_position_pk primary key (user_id, position)
);
alter table public.task_diet_rotation enable row level security;

create table public.task_schedules (
  user_id uuid not null,
  id text not null,
  task_id text not null,
  weekdays integer[] not null,
  time text not null,
  constraint task_schedules_user_id_id_pk primary key (user_id, id)
);
alter table public.task_schedules enable row level security;

create table public.task_meal_ingredients (
  user_id uuid not null,
  id text not null,
  meal_task_id text not null,
  group_id text not null,
  ingredient_key text not null,
  name text not null,
  unit text not null,
  quantity_min double precision,
  quantity_max double precision,
  is_choice boolean not null,
  optional boolean not null,
  note text not null,
  position integer not null,
  constraint task_meal_ingredients_user_id_id_pk primary key (user_id, id)
);
alter table public.task_meal_ingredients enable row level security;

create table public.fitness_tasks (
  user_id uuid not null,
  id text not null,
  parent_id text,
  source_task_id text,
  scope text not null,
  kind text not null,
  title text not null,
  notes text not null default '',
  position integer not null,
  date date,
  time text,
  status text not null default 'pending',
  archived boolean not null default false,
  details jsonb not null,
  constraint fitness_tasks_user_id_id_pk primary key (user_id, id)
);
alter table public.fitness_tasks enable row level security;

create table public.task_weight_entries (
  user_id uuid not null,
  date date not null,
  value double precision not null,
  constraint task_weight_entries_user_id_date_pk primary key (user_id, date)
);
alter table public.task_weight_entries enable row level security;

create table public.task_workspaces (
  user_id uuid primary key not null references auth.users(id) on delete cascade,
  revision integer not null default 0,
  name text not null,
  timezone text not null,
  rotation_start date not null,
  water_target integer not null,
  protein_target integer not null,
  reminders boolean not null default false,
  lead_minutes integer not null default 0,
  updated_at timestamp with time zone not null default now()
);
alter table public.task_workspaces enable row level security;

alter table public.task_day_overrides
  add constraint task_day_overrides_user_id_task_workspaces_user_id_fk
  foreign key (user_id) references public.task_workspaces(user_id) on delete cascade on update no action;
alter table public.task_meal_choices
  add constraint task_meal_choices_user_id_task_workspaces_user_id_fk
  foreign key (user_id) references public.task_workspaces(user_id) on delete cascade on update no action;
alter table public.task_diet_rotation
  add constraint task_diet_rotation_user_id_task_id_fitness_tasks_user_id_id_fk
  foreign key (user_id, task_id) references public.fitness_tasks(user_id, id) on delete cascade on update no action;
alter table public.task_schedules
  add constraint task_schedules_user_id_task_id_fitness_tasks_user_id_id_fk
  foreign key (user_id, task_id) references public.fitness_tasks(user_id, id) on delete cascade on update no action;
alter table public.task_meal_ingredients
  add constraint task_meal_ingredients_user_id_meal_task_id_fitness_tasks_user_id_id_fk
  foreign key (user_id, meal_task_id) references public.fitness_tasks(user_id, id) on delete cascade on update no action;
alter table public.fitness_tasks
  add constraint fitness_tasks_user_id_task_workspaces_user_id_fk
  foreign key (user_id) references public.task_workspaces(user_id) on delete cascade on update no action;
alter table public.fitness_tasks
  add constraint fitness_tasks_parent_fk
  foreign key (user_id, parent_id) references public.fitness_tasks(user_id, id) on delete no action on update no action;
alter table public.task_weight_entries
  add constraint task_weight_entries_user_id_task_workspaces_user_id_fk
  foreign key (user_id) references public.task_workspaces(user_id) on delete cascade on update no action;

create index fitness_tasks_parent on public.fitness_tasks using btree (user_id, parent_id);
create index fitness_tasks_date on public.fitness_tasks using btree (user_id, date);

create policy task_overrides_owner on public.task_day_overrides
  as permissive for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy task_choices_owner on public.task_meal_choices
  as permissive for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy task_rotation_owner on public.task_diet_rotation
  as permissive for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy task_schedules_owner on public.task_schedules
  as permissive for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy task_ingredients_owner on public.task_meal_ingredients
  as permissive for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy fitness_tasks_owner on public.fitness_tasks
  as permissive for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy task_weights_owner on public.task_weight_entries
  as permissive for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy task_workspaces_owner on public.task_workspaces
  as permissive for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on public.task_workspaces, public.fitness_tasks, public.task_meal_ingredients, public.task_schedules, public.task_diet_rotation, public.task_day_overrides, public.task_meal_choices, public.task_weight_entries from public, anon;
grant select, insert, update, delete on public.task_workspaces, public.fitness_tasks, public.task_meal_ingredients, public.task_schedules, public.task_diet_rotation, public.task_day_overrides, public.task_meal_choices, public.task_weight_entries to authenticated;
