# Product rules and workflow

MyDevStudio lets each account create a portfolio website and a downloadable CV from one profile document. It is not only a CV generator. Google sign-in uses Supabase Auth. Anonymous visitors can read published portfolios. Signing in does not allow editing another person's portfolio.

| Route or concept     | Contract                                             |
| -------------------- | ---------------------------------------------------- |
| `/`                  | Product homepage and fictional layout examples       |
| `/{username}`        | Public portfolio only when that profile is published |
| `/{username}/edit`   | That owner's protected editor                        |
| `/{username}/cv.pdf` | Public CV only for a published portfolio             |
| `/admin`             | Authenticated editor entry                           |
| `/admin/portfolios`  | Membership-restricted portfolio management           |
| `/p/examples/{slug}` | Fictional examples, not real accounts                |

Routes live in `apps/my-dev-studio/app`. Data access for those routes lives in `apps/my-dev-studio/features`.

New users choose a layout, edit their own details, and publish explicitly. Saving a private edit does not make the portfolio public. Missing and private profiles return 404 to public readers. Changing a username changes the public link. Keep the existing reserved-name validation.

The editor holds a draft until Save changes. Save sends the original revision so a conflict can be detected. Reload or discard must not overwrite a newer saved version. Server handlers enforce identity, authorization, validation, and origin checks. Hiding a control is not authorization. Profiles are stored as the existing JSON document. Row ownership and publication are enforced by repository logic and RLS.

Managed portfolios are temporary records for authorized managers. They are not shared logins. Managers can import, edit, publish, and transfer to a verified recipient through the existing protected workflow. Transfer changes who can edit. It must not replace the recipient's existing content or bypass the main portfolio restrictions. Do not use a service-role key or a public email allowlist in place of the membership check.

Portfolio type (Engineer, Designer, Consultant, Minimal), theme, color mode, accent, and language are separate preferences. English, Spanish, and Turkish change interface labels and dates, not the owner's prose. CV language and Classic, Editorial, and Compact layouts are independent. PDFs read the canonical profile through `packages/assistant`. Portfolio-only selections, hidden sections, custom sections, and hero media do not automatically change what the PDF includes.

Public project views exclude projects marked private, including preview adapters. Custom content is escaped text with validated links. Remote images and media load in the visitor's browser. The app server does not fetch arbitrary user URLs. Social showcases are selected public work, not synchronized account feeds.

Before changing a rule, read `packages/lib/src/schemas/profile/profile.ts`, the profile services and repositories, the matching route under `apps/my-dev-studio/app`, and the feature module under `apps/my-dev-studio/features`. For auth, RLS, or migrations, read the current policies. Use fictional identities in tests and public PR examples.
