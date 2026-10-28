> Multiuser upgrade: every confirmed user can now create their own CV. Follow [multiuser setup](multiuser-cvs.md) for the new migration and privacy rules. The owner assignment below applies only to the original site portfolio.

# Portfolio studio setup

The new `/admin` studio edits profile/contact details, biography, experience and achievements, projects and links, education, skills, languages, CV URL and appearance. Each collection has add/remove/reorder controls. Publishing saves one validated profile revision. The public page, SEO and AI context use the published profile without a redeploy. An outdated editor tab receives a conflict instead of overwriting a newer save.

## One-time activation

1. Review and merge the admin PR. Before using the editor, apply **only** `supabase/migrations/20261028063646_portfolio_admin.sql` in the DevHub Supabase project (`quepwjalwkfzxyqhtyby`). Use the SQL Editor, or your existing tracked migration process. Do not replay the historical remote-schema migration into an existing database. The new migration creates one table and seeds the current CV profile plus the seven existing public project examples. It leaves all older tables untouched.
2. In [DevHub Authentication → Users](https://supabase.com/dashboard/project/quepwjalwkfzxyqhtyby/auth/users), create your email/password user with your own password and confirm the email. Do not send the password in chat. No matching login existed when this PR was prepared.
3. Run `supabase/set-portfolio-owner.sql` in the same project's SQL Editor. It assigns the single profile to the confirmed `yilmazyu@gmail.com` account. It fails if that account is missing or unconfirmed. This owner ID is independent of the public contact email you can edit in the studio.
4. Keep the existing `NEXT_PUBLIC_SUPABASE_URL` and publishable/anon key in Vercel. No service-role key or extra admin secret is needed. After deploying the PR, open `/admin/login` and sign in.

There is no public signup or ownership-claim endpoint. Supabase verifies the session; the server checks the exact stored owner UUID on every protected read/write. RLS independently restricts updates to that UUID. Clients cannot insert/delete the profile or update its owner column. Supabase remembers sessions in cookies; the password is never stored in the app. Review moderation pages/actions use the same owner guard.

## Publishing and recovery

The editor keeps changes in memory until you choose **Publish changes**, warns before leaving an unsaved draft, and preserves the draft on a save error. **Discard changes** returns to the last saved snapshot. If another tab published first, copy any edits you want to retain and choose **Reload latest version**.

Career/project facts in `packages/content/src/profile.ts` remain the bundled fallback if Supabase is unavailable. Once the new table is configured, it becomes authoritative: the old database project rows are not merged back, so deleting a project in the editor stays deleted. The migration imports all seven existing public tools into the new editable profile. Testimonials continue using the older referral service.

The CV setting accepts `/cv.pdf` or an HTTP(S) link. Keep `/cv.pdf` to generate the PDF from the latest published profile on download, including saved experience, skills, education and public projects. No PDF upload or manual replacement is needed. An external link overrides this automatic download. Edit the shared `packages/cv/templates/cv.json.hbs` template to change its layout; see the README for local Plop generation.

## Appearance

The refreshed portfolio and studio share dark navy and cool-white palettes. The studio lets you select cyan, violet or emerald accents and a default light/dark/system theme. Visitors can override the theme using the header switch; their preference is stored locally under `devhub-theme`. CSS applies it before paint and respects reduced-motion preferences. Profile content is never saved in localStorage.

## Legacy database security issue

The existing DevHub project reports RLS disabled on 13 older tables. These are separate from the new secured `portfolio_profiles` table. The new editor does not grant them additional privileges or silently change their policies. Protecting only the application admin route does not secure direct Supabase access to legacy tables.

Read [the legacy RLS review](legacy-rls-review.md) and decide the required policies before changing those tables. This PR does not apply legacy remediation to production.

## Checks

Run `pnpm format:check`, `pnpm lint:check`, `pnpm assist:check`, `pnpm test`, `pnpm typecheck` and `pnpm build`. Tests cover profile validation, ownership, revision conflicts, editor publishing/error recovery and the actual migration under anonymous/stranger/owner database roles.

After activation, verify signed-out access to `/admin` redirects to login, a different account cannot sign in to the editor, your save survives reload, the public portfolio reflects it, and the theme switch works on desktop and mobile. Live account sign-in still needs the setup above.
