# Legacy Supabase RLS review

Supabase reports RLS disabled on the following existing public tables: `project_skills`, `achievements`, `certifications`, `challenges`, `characteristics`, `companies`, `educations`, `experiences`, `languages`, `projects`, `referrals`, `reviews`, and `skills`.

This means database access can bypass the application's owner guard. The new portfolio editor uses a separate RLS-protected table. Legacy policies should be reviewed separately, with a database backup and an inventory of current grants and consumers.

The following SQL enables RLS. **Do not run it alone on production**: without matching policies, existing reads/writes will stop. Decide and create the policies in the same reviewed change first. No part of this file runs in the app, CI or migration.

```sql
alter table public.project_skills enable row level security;
alter table public.achievements enable row level security;
alter table public.certifications enable row level security;
alter table public.challenges enable row level security;
alter table public.characteristics enable row level security;
alter table public.companies enable row level security;
alter table public.educations enable row level security;
alter table public.experiences enable row level security;
alter table public.languages enable row level security;
alter table public.projects enable row level security;
alter table public.referrals enable row level security;
alter table public.reviews enable row level security;
alter table public.skills enable row level security;
```

For public career tables, policies can allow SELECT while limiting writes to the configured owner. Projects should expose only public rows and their skill links. Referrals need separate decisions: display only approved testimonials, protect contact/session information, restrict moderation to the owner, and define how visitors may submit referrals. Test the existing app and direct Data API with anon, owner and non-owner credentials before committing the change.
