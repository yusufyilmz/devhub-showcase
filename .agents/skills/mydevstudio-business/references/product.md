# Product rules and workflow

MyDevStudio lets each account create a portfolio website and downloadable CV from a canonical profile document. It is not only a CV generator. Google sign-in is backed by Supabase Auth. Anonymous visitors can read published portfolios; signing in does not give permission to edit another user's portfolio.

| Route or concept   | Contract                                                                |
| ------------------ | ----------------------------------------------------------------------- |
| /                  | Product homepage and fictional layout examples                          |
| /{username}        | Public portfolio only when published                                    |
| /{username}/edit   | Owner's protected editor                                                |
| /{username}/cv.pdf | Public CV only for a published portfolio                                |
| /admin             | Authenticated editor entry point                                        |
| /admin/portfolios  | Membership-restricted portfolio management                              |
| /p/examples/{slug} | Fictional examples, not real accounts or discoverable personal profiles |

New users choose a layout, edit their own details and explicitly publish. Saving private edits does not grant public access. Missing and private profiles return 404 to public readers. Username changes change public links. Preserve existing reserved-name validation.

The editor holds a draft until Save changes. Save includes the original revision for conflict detection. Reload or discard must not silently overwrite a newer saved version. Server handlers enforce identity, authorization, validation and origin controls; UI visibility is not an authorization boundary. Profiles are persisted in the existing JSON document, with row ownership and publication enforced by repository logic and RLS.

Managed portfolios are temporary records handled by authorized managers, not fake shared login accounts. Managers can import/edit/publish and transfer to a verified recipient through the existing protected workflow. Transfer changes who can edit; preserve the recipient's existing content and the main portfolio restrictions. Never substitute a service role key or public email allowlist for membership checks.

Portfolio type (Engineer, Designer, Consultant, Minimal), theme, color mode, accent and language are separate preferences. English, Spanish and Turkish localize interface labels and dates, not authored prose. CV language and Classic/Editorial/Compact layout are independent. PDFs read the canonical profile through packages/cv. Portfolio-only item selections, hidden sections, custom sections and hero/media options do not automatically change PDF inclusion.

Public project views must exclude projects marked private, including preview adapters. Custom content is escaped text with validated links. Remote images/media are loaded by the visitor, never fetched by the app server from arbitrary user URLs. Social showcases contain selected public work, not synchronized account feeds.

Before changing a rule, read packages/lib/src/domain/profile.ts, profile services/repositories, apps/web/app route handlers, apps/web/features/admin and docs/features/section-system.md. For auth/RLS or migrations, inspect the actual current policies and use the Supabase guidance rather than guessing. Use fictional identities in tests and public PR examples.
