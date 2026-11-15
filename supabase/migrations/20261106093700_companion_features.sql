create table public.companion_features (
  app text not null check (app in ('studio', 'fitness')),
  feature_id text not null check (feature_id ~ '^[a-z][a-z0-9-]{0,79}$'),
  category text not null,
  title text not null,
  message text not null,
  context text,
  position integer not null check (position >= 0),
  primary key (app, feature_id)
);

create table public.companion_feature_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  app text not null,
  feature_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, app, feature_id),
  foreign key (app, feature_id) references public.companion_features(app, feature_id) on delete cascade
);

create index companion_feature_progress_feature_idx
  on public.companion_feature_progress(app, feature_id);

alter table public.companion_features enable row level security;
alter table public.companion_feature_progress enable row level security;
revoke all on public.companion_features, public.companion_feature_progress from public, anon, authenticated;
grant select on public.companion_features to authenticated;
grant select on public.companion_feature_progress to authenticated;
grant insert (user_id, app, feature_id) on public.companion_feature_progress to authenticated;

create policy "signed in users can read feature descriptions"
  on public.companion_features for select to authenticated
  using (not coalesce((select auth.jwt() ->> 'is_anonymous')::boolean, false));

create policy "users can read their own feature progress"
  on public.companion_feature_progress for select to authenticated
  using (
    (select auth.uid()) = user_id
    and not coalesce((select auth.jwt() ->> 'is_anonymous')::boolean, false)
  );

create policy "users can complete their own features"
  on public.companion_feature_progress for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and not coalesce((select auth.jwt() ->> 'is_anonymous')::boolean, false)
  );

insert into public.companion_features (app, feature_id, category, title, message, context, position)
values
  ('fitness', 'agenda', 'Today and activity logging', 'Daily agenda', 'Open Today to see your activities in time order. Select an activity to see its notes and subtasks.', 'Today', 0),
  ('fitness', 'progress', 'Today and activity logging', 'Daily progress', 'Tick off an activity as you go. Daily progress shows what you’ve completed or skipped.', 'Today', 1),
  ('fitness', 'hydration', 'Today and activity logging', 'Hydration tracking', 'Need a water break? Log a glass from the Hydration card and check it against your goal.', 'Today', 2),
  ('fitness', 'workouts', 'Today and activity logging', 'Workouts, supersets and sets', 'Open a workout to log reps and weight for each set. Previous results help you pick where to start.', 'Today', 3),
  ('fitness', 'meals', 'Today and activity logging', 'Meals, ingredients and alternatives', 'Open a meal to check its ingredients or choose an available alternative.', 'Today', 4),
  ('fitness', 'supplements', 'Today and activity logging', 'Supplement routines', 'Add supplements as routine tasks and check the activity details for the saved instructions.', 'Today', 5),
  ('fitness', 'task-plans', 'Plans and calendar', 'Workout, diet and routine plans', 'Open Tasks to choose a plan, explore its tasks and build a routine that fits your week.', 'Tasks', 6),
  ('fitness', 'task-edit', 'Plans and calendar', 'Tasks and subtasks', 'Create, edit or reorder the tasks inside a plan. Archive an old template to keep its past logs.', 'Tasks', 7),
  ('fitness', 'rotation', 'Plans and calendar', 'Diet rotation and day overrides', 'Use schedule settings to rotate meal plans and adjust an individual day as needed.', 'Tasks', 8),
  ('fitness', 'recurrence', 'Plans and calendar', 'Weekday scheduling', 'Give a template a time and choose the weekdays it should appear on your calendar.', 'Tasks', 9),
  ('fitness', 'calendar', 'Plans and calendar', 'Calendar and date navigation', 'Switch between month and week views. Select a date for its agenda or open an activity directly.', 'Calendar', 10),
  ('fitness', 'reschedule', 'Plans and calendar', 'Reschedule an activity', 'On desktop, drag a pending activity to another date. Its details also let you edit the date and time.', 'Calendar', 11),
  ('fitness', 'cooking', 'Plans and calendar', 'Weekly cooking plan', 'Open Week to turn the meals on your calendar into a cooking checklist.', 'Week', 12),
  ('fitness', 'shopping', 'Plans and calendar', 'Weekly grocery list', 'Open the shopping list in Week to see ingredients combined across your planned meals.', 'Week', 13),
  ('fitness', 'week-save', 'Plans and calendar', 'Save and regenerate a week', 'Save your cooking and shopping lists. If the meal plan changes, you can regenerate the week.', 'Week', 14),
  ('fitness', 'assistant', 'Assistant and preferences', 'Fitness assistant', 'Want help with a workout, a task, a shopping list or reminder? Open my chat and review the suggestion before saving.', null, 15),
  ('fitness', 'reminders', 'Assistant and preferences', 'Activity reminders', 'Turn on activity reminders in More. I can show a bubble when a scheduled activity is due.', 'More', 16),
  ('fitness', 'device-notifications', 'Assistant and preferences', 'Device notifications', 'In More, set up device notifications and use the test action to check this device.', 'More', 17),
  ('fitness', 'goals', 'Assistant and preferences', 'Personal goals and time zone', 'Set your hydration or protein targets, reminder lead time and workspace time zone in More.', 'More', 18),
  ('fitness', 'weight', 'Assistant and preferences', 'Weight tracking', 'Log your weight in More if you want to keep a record alongside your daily routines.', 'More', 19),
  ('fitness', 'appearance', 'Assistant and preferences', 'Appearance', 'Use the appearance control to switch your Fitness workspace between light and dark themes.', null, 20),
  ('fitness', 'private', 'Assistant and preferences', 'Private workspace', 'Your plans and activity logs are saved to your signed-in workspace.', null, 21),
  ('fitness', 'preview', 'Assistant and preferences', 'Read-only demo', 'Open the demo for a sample workspace you can explore without editing your own routines.', null, 22),
  ('fitness', 'companion', 'Assistant and preferences', 'Your companion', 'Drag me to either side. You can open this guide or turn off automatic tips whenever you like.', null, 23),
  ('studio', 'workspace', 'Build your portfolio', 'Your private workspace', 'Want to work on your portfolio? Open your workspace to edit your profile and CV in one place.', 'Home', 0),
  ('studio', 'examples', 'Build your portfolio', 'Portfolio examples', 'Need a starting point? Browse example portfolios and see how their matching CVs look.', 'Home', 1),
  ('studio', 'profile', 'Build your portfolio', 'Profile and introduction', 'Tell visitors who you are, what you do and which details they can use to reach you.', 'Profile', 2),
  ('studio', 'career', 'Build your portfolio', 'Experience and achievements', 'Add a role and the outcomes you’re proud of in Experience.', 'Experience', 3),
  ('studio', 'projects', 'Build your portfolio', 'Projects and media', 'Show your work with links and cover images. Keep individual projects private until you’re ready.', 'Projects', 4),
  ('studio', 'education', 'Build your portfolio', 'Education', 'Add your degrees or training in Education so they can appear in your portfolio and CV.', 'Education', 5),
  ('studio', 'skills', 'Build your portfolio', 'Skill groups', 'Group related skills so someone can skim your strengths quickly.', 'Skills', 6),
  ('studio', 'languages', 'Build your portfolio', 'Spoken languages', 'List the languages you speak and your proficiency in each.', 'Languages', 7),
  ('studio', 'layout', 'Build your portfolio', 'Portfolio layouts', 'Try a different portfolio layout in Layout. Your existing content comes with you.', 'Layout', 8),
  ('studio', 'visual-order', 'Build your portfolio', 'Drag and drop sections', 'By the way, you can drag sections into a new order in Preview your draft. The PDF has its own layout.', 'Section order', 9),
  ('studio', 'section-display', 'Build your portfolio', 'Section visibility and presentation', 'Choose which sections and items visitors see, and try a different presentation in Section display.', 'Section display', 10),
  ('studio', 'custom-sections', 'Build your portfolio', 'Custom sections', 'Want to add testimonials, an FAQ, services or a gallery? Start with Custom sections.', 'Custom sections', 11),
  ('studio', 'section-templates', 'Build your portfolio', 'Reusable section templates', 'Save a section to your private template library or import a configuration you’ve exported.', 'Templates', 12),
  ('studio', 'appearance', 'Build your portfolio', 'Themes and hero backgrounds', 'Try a theme, accent, image or video background in Appearance.', 'Appearance', 13),
  ('studio', 'responsive-preview', 'Build your portfolio', 'Responsive draft preview', 'Check how your portfolio looks on a phone, tablet and desktop before publishing.', 'Layout', 14),
  ('studio', 'draft-save', 'Drafts, sharing and CVs', 'Save and recover a draft', 'Save changes to keep a private revision. The editor also offers undo, redo and draft recovery.', 'Profile', 15),
  ('studio', 'history', 'Drafts, sharing and CVs', 'Revision history', 'Want to revisit an earlier version? Open Revision history to review and restore it into the draft.', 'Revision history', 16),
  ('studio', 'publication', 'Drafts, sharing and CVs', 'Publish your portfolio and CV', 'Review publication when you’re ready to share. You can publish now, schedule it, or withdraw a published version.', null, 17),
  ('studio', 'sharing', 'Drafts, sharing and CVs', 'Link and access settings', 'Choose public, unlisted or password access and review the link before sharing.', null, 18),
  ('studio', 'branding', 'Drafts, sharing and CVs', 'Share cards and page metadata', 'Your published portfolio uses your name, role and accent in its share card.', null, 19),
  ('studio', 'field-visibility', 'Drafts, sharing and CVs', 'Website and CV visibility', 'Choose separately which contact details appear on your website and in the PDF.', 'Field visibility', 20),
  ('studio', 'locale', 'Drafts, sharing and CVs', 'Website and CV language', 'You can choose different languages for the portfolio and PDF in Language settings.', 'Language settings', 21),
  ('studio', 'pdf', 'Drafts, sharing and CVs', 'PDF layouts and download', 'Try a different PDF layout, adjust what it includes and download a copy of your saved CV.', 'PDF', 22),
  ('studio', 'cv-versions', 'Drafts, sharing and CVs', 'Private CV versions and job drafts', 'Keep private CV variants, or review a draft tailored to a job description in CV versions.', 'CV versions', 23),
  ('studio', 'cv-import', 'Drafts, sharing and CVs', 'Import an existing CV', 'If CV import is available, upload your CV and review the extracted fields before applying them.', 'Import CV', 24),
  ('studio', 'google-import', 'Drafts, sharing and CVs', 'Import from Google', 'If Google import is configured, choose which profile details to share and review them before applying.', 'Import Google', 25),
  ('studio', 'ai-knowledge', 'Assistants and account', 'Inspect assistant knowledge', 'Open AI profile to see which saved information is available to your assistants.', 'AI profile', 26),
  ('studio', 'owner-assistant', 'Assistants and account', 'Private AI editing', 'If your plan includes AI editing, I can suggest wording or draft changes for you to review.', 'AI assistant', 27),
  ('studio', 'ai-tools', 'Assistants and account', 'Writing, feedback and interview prep', 'Studio chat can help you review your portfolio, rewrite a passage or prepare for a job interview when the tools are enabled.', 'AI assistant', 28),
  ('studio', 'visitor-assistant', 'Assistants and account', 'Public portfolio assistant', 'Eligible accounts can enable visitor questions about their published work in Plan and usage.', null, 29),
  ('studio', 'billing', 'Assistants and account', 'Plans and AI usage', 'Check your plan, assistant allowances and feature readiness in Plan and usage.', 'Home', 30),
  ('studio', 'managed', 'Assistants and account', 'Managed portfolios', 'Authorized managers can create, edit and transfer temporary portfolios from the management workspace.', null, 31),
  ('studio', 'companion', 'Assistants and account', 'Your companion', 'Drag me to either side. You can open this guide or turn off automatic tips whenever you like.', null, 32),
  ('studio', 'fitness', 'Assistants and account', 'Try My Fitness Studio', 'Want a space for workouts, meals and daily habits too? You can open My Fitness Studio and set up your own fitness workspace.', 'Home', 33);
