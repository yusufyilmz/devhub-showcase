# Personal CV workspaces

Every confirmed Google (or existing email/password) user can open `/admin`, which redirects to their own `/{username}/edit` page. The server verifies the Supabase identity, finds that UUID's unique profile, and creates a private starter CV if none exists. Display name/email can prefill from that identity; no experiences, projects, skills, or other facts are copied from Yusuf's profile. Google profile metadata never grants ownership or moderation privileges.

Each account owns its contact/career content, theme, PDF page size and text size, contact visibility and optional sections. The PDF uses that account's accent. Save writes one validated document and revision. Stale saves return a conflict. The server chooses the profile from the session; clients cannot select another user's workspace by supplying an ID or owner in their payload.

## Privacy and links

New CVs are private. `Download my saved CV` uses `/api/admin/cv` and the current authenticated workspace. Turn on **Publish my profile and CV at a public link**, then save, to make `/{username}` and `/{username}/cv.pdf` accessible. Choose your unique username in the editor. New workspaces start with an automatically assigned `cv-…` handle. Usernames use 3–50 lowercase letters, numbers and single hyphens; app routes such as `admin`, `api` and `auth` are reserved. Renaming changes your links. Old `/p/{profile-id}` page links redirect to the current username. Published profile/contact information is public by design; PDF hide-email/hide-phone settings control PDF output only. To hide contact information from the public profile itself, keep the CV private or remove the optional contact details before publishing.

Visitors see only the read only CV. The owner sees an **Edit my CV** link when signed in. Direct requests to `/{username}/edit` redirect visitors to login and return 404 for a different signed in account. Both the route and the save API verify ownership; the username is never proof of ownership.

Turning public sharing off and saving immediately hides both public endpoints, including from search and direct API reads. Named profiles never fall back to Yusuf's data. A public website link can be an external URL; CV download URLs are automatically scoped to the correct profile unless an external CV URL is explicitly chosen. Avoid publishing sensitive information. An already downloaded PDF cannot be recalled.

`/` and `/cv.pdf` retain the original portfolio. The assigned owner edits that same main row in their workspace. Site review moderation still requires ownership of `main`; registering a CV account does not grant it. Owner and ID columns are immutable to API clients. New users cannot insert or claim `main`.

## Activate safely

1. Configure Google as described in [google-login.md](google-login.md). Use an external Google audience and publish the OAuth app when you want users outside your test list to sign in. Keep only basic identity scopes.
2. Apply the existing `20261028063646_portfolio_admin.sql` migration if the profile table does not exist yet, then apply `20261028105541_user_cv_profiles.sql` and `20261028172419_cv_usernames.sql` in that order. Do not replay the historical remote schema migration into an existing database. The new migration preserves the main document, revision and owner; it enables one row per owner, private creation and row-level isolation. No migration is automatically applied by CI.
3. For the original site portfolio only, create/confirm its owner Auth account and run `supabase/set-portfolio-owner.sql` **before** opening a new personal workspace for that account. If the account already owns a separate CV, the unique-owner index rejects a second assignment. Preserve both documents and choose which profile to keep; do not delete a user's work merely to claim main. Everyone else requires no SQL assignment or allow list: their profile is provisioned on first verified sign in.
4. Deploy the app with the existing Supabase URL and publishable/anon key. Optionally set `NEXT_PUBLIC_SITE_URL` to the canonical deployed base URL. No service-role credential is used by the application.
5. Verify two independent accounts: create/edit/download both CVs, publish one, ensure the other remains unreadable, turn sharing off, and confirm both public links stop working. Verify the original site owner still edits main and other users cannot moderate its reviews.

The pre-existing legacy tables are separate from the CV document table. Their earlier RLS audit remains relevant; see [legacy-rls-review.md](legacy-rls-review.md). This migration does not grant CV users privileges on those tables or alter their policies.

## Local generation

`pnpm cv:generate` prompts for an output file and a public profile ID (`main` for the original site). For example:

```sh
pnpm cv:generate --args output/alice.pdf 11111111-1111-4111-8111-111111111111
```

Private CVs are downloaded through the signed-in studio. Local public generation uses only public data; a missing/private profile fails rather than producing someone else's resume. Existing output files are never overwritten.

## Deployment setup status

The original profile and multiuser migrations were applied to the DevHub Supabase project on 28 October 2026. The username migration must also be applied before deploying the username routes. Google credentials and provider URL configuration still need dashboard setup. No confirmed Auth account matching the original portfolio email existed when setup was checked; assign the main owner using the existing setup script before creating a personal workspace for that account. Do not replay already applied migrations.
