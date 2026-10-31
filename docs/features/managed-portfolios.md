# Managed portfolios

The platform administrator can open /admin/portfolios or use **Manage portfolios** in the studio header. Ordinary users cannot access this area. Administrator membership lives in a private database table and is initially granted to the existing main portfolio owner. It is independent of user editable auth metadata.

Create a temporary portfolio with a name, username and optional contact email. Alternatively, import a JSON file containing either a profile document or an object with username and profile properties. Imports are limited to 250 KB and validated with the normal profile schema. They preserve projects, image URLs, themes, language settings and CV preferences. Ownership and publication flags supplied in the file are ignored.

Every new managed portfolio starts private and uses no separate login or shared password. Missing contact emails use <pending@example.com> as an explicitly temporary value. Replace placeholder contacts before publishing. Temporary portfolio records have no auth owner and are assigned to the administrator who creates them.

The managed editor provides the existing content, language, layout, theme, section order and PDF settings. Save changes to update the document, or toggle publication to show or hide the public username page. Username changes keep the administrator on the same management URL. Private PDF downloads also require the administrator session. The list shows 50 records per page.

## Transfer to a real account

Ask the recipient to sign in with Google, then enter that verified account email and confirm **Transfer portfolio**. This operation transfers only a portfolio currently managed by the signed in administrator. It uses a revision check, so concurrent changes cannot be silently overwritten.

If the recipient has no portfolio, ownership is assigned directly. If login created an untouched private starter, that starter is preserved as a separate private managed record before assignment. A published or edited destination portfolio blocks transfer; none of its data is replaced. The original main profile cannot become managed. After transfer the recipient uses their username edit page, while the administrator loses management access to that profile.

No invitations or account emails are sent. No service role key or new environment variable is needed. The normal authenticated Supabase client and database RLS enforce access. Normal personal workspaces and main portfolio moderation retain their existing authorization.

## Database setup

The managed portfolio migrations add a manager column and index, a private administrator membership table, explicit deny access to that table, management RLS policies, and a tightly scoped transfer operation. Privileged helpers reside in a non-exposed private schema with a fixed empty search path, explicit auth UID checks and revoked public/anonymous execution. Public RPC wrappers run as the caller.

Inspect the target environment's migration history before applying missing committed migrations in order. The managed-portfolio migrations initialize administrator membership from the main profile's verified owner; configure that owner first. Historical rollout notes are not evidence of current production state.

## Verification and existing advisories

Tests exercise RLS as anonymous, normal and administrator roles, protect private user records and the main profile, and check transfer conflicts and preservation of an untouched starter. Browser tests use isolated fixture accounts to verify creation/import, editing, publication, unpublishing, private PDFs and transfer of access on desktop and mobile. They do not exercise live Google OAuth.

Run Supabase security advisors after applying migrations. This feature does not alter unrelated legacy table permissions or platform settings. See the [database advisor documentation](https://supabase.com/docs/guides/database/database-advisors) for interpreting findings.
