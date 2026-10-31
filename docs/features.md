# Features

This is the current product overview. It describes repository behavior, not a guarantee that every external service is configured in a deployed environment. Start with [the README](../README.md) for setup and [architecture](architecture.md) for implementation boundaries.

## Availability

| Capability                               | Status               | Dependency or boundary                                           |
| ---------------------------------------- | -------------------- | ---------------------------------------------------------------- |
| Platform homepage and fictional examples | Implemented          | Available without database credentials                           |
| Personal portfolio and CV studio         | Implemented          | Confirmed identity and profile migrations                        |
| Public username pages and PDFs           | Implemented          | Owner explicitly publishes the saved profile                     |
| Layouts, themes and languages            | Implemented          | Independent saved preferences                                    |
| Built-in and custom sections             | Implemented          | Validated profile document                                       |
| Private templates and import/export      | Implemented          | Separate account-private template table                          |
| Managed portfolios and transfer          | Implemented          | Administrator membership and database policies                   |
| CV upload extraction                     | Optional integration | OpenAI, Redis, consent and review                                |
| Saved AI profile inspector               | Implemented          | Authorized saved-profile read; no model call                     |
| Public portfolio chat                    | Optional integration | Published portfolio, owner opt-in, active Pro, OpenAI and Redis  |
| Multiuser premium chat and billing       | Sandbox implemented  | Reviewed migrations, Stripe test setup and webhook confirmation  |
| Private AI editing assistant             | Optional integration | Assigned Pro, bounded usage and explicit review/apply/save       |
| Hosted error monitoring                  | Planned              | Existing Pino logs; Sentry setup is documented but not installed |

## Personal workspaces and sharing

Confirmed users enter through `/admin` and reach their own `/{username}/edit` workspace. A new account starts with a private profile and a layout picker. Signing in never grants access to another person's editor or site moderation.

The studio edits profile/contact details, About, experience and achievements, projects, education, skills and spoken languages. Collections support editing and reordering. Changes remain a draft until **Save changes** succeeds. Discard restores the saved state; stale revisions produce a conflict instead of overwriting newer work.

Publishing exposes `/{username}` and `/{username}/cv.pdf`. Unpublishing hides public reads, but cannot recall downloaded files or search-engine copies. Username changes change public links; legacy `/p/{id}` links resolve to the current username. Private downloads use authenticated endpoints. PDF hide-email/hide-phone preferences do not hide those details on the public website.

See [personal workspace setup](features/multiuser-cvs.md) and [Google login](features/google-login.md) for activation and access rules.

## Layout, appearance and language

| Setting            | Choices                                 | Behavior                                                                                                                                                                              |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio layout   | Engineer, Designer, Consultant, Minimal | Engineer keeps the original career layout; Designer emphasizes a project gallery; Consultant places introduction beside career content on wide screens; Minimal uses a quieter column |
| Theme              | Studio, Paper, Graphite, Bloom          | Original palette, warm serif, neutral monospace, or soft lavender treatments                                                                                                          |
| Accent             | Cyan, violet, emerald                   | Shared accent choice; independent of layout                                                                                                                                           |
| Default color mode | Dark, Light, Match device               | Visitors can override color mode locally                                                                                                                                              |
| Portfolio language | English, Spanish, Turkish               | Website labels, actions, dates and HTML language                                                                                                                                      |
| CV language        | English, Spanish, Turkish               | Independent PDF labels, dates, title and Content-Language header                                                                                                                      |
| CV format          | Classic, Editorial, Compact             | Independent document layout; all use the same canonical profile                                                                                                                       |

Themes work with all four layouts in light/dark mode. Appearance thumbnails and preview mode are local previews; changing preview mode does not silently change the saved default. The homepage and editor use platform styling rather than inheriting the portfolio theme. Visitor overrides remain scoped to profiles/examples.

Existing documents default to Engineer, Studio, English and Classic where settings are absent. A new user's first layout selection suggests a CV format; later layout changes preserve their chosen CV format. Layout and theme changes do not publish, change usernames or replace profile content.

Language choices localize the interface, not authored prose. Names, biographies, project descriptions, skills and qualifications stay as entered. The platform/editor/sign-in UI remains English. There are no alternate-language routes or automatic translation service.

Project covers use validated public image URLs loaded by the visitor's browser with no referrer. Missing images have a usable placeholder. The app/PDF renderer does not fetch arbitrary remote project images.

## Sections, ordering and media

Built-in About, Experience, Projects, Skills, Education and Languages sections use canonical profile content. Owners can select compatible presentations, hide sections and choose included items. Empty selections include no items; absent selections include all compatible items, including future additions. Private projects remain excluded.

Custom sections support creation, names, duplication, deletion, visibility, authored items and compatible profile-source bindings. The library includes 42 converted PageForge families plus native custom/services/social sections. Reusable views include cards, gallery, carousel, timeline, accordion, tabs and text.

Section order supports pointer/touch dragging, move buttons and keyboard controls. Built-in and custom sections can share an explicit sequence; reset restores layout defaults. The introduction, contact area, original testimonials and footer retain their established positions. Portfolio-only section choices do not change PDF inclusion.

Optional image/video hero backgrounds support poster, position, overlay and playback controls. Reduced motion pauses automatic playback. Social work is curated from public links: YouTube loads a privacy-enhanced player after a visitor action; Instagram and Pinterest cards link to original posts. Automatic feeds, scraping, media uploads and transcoding are not provided.

See [section contracts](features/section-system.md), [templates](features/section-templates.md) and [the source mapping](reference/pageforge-section-migration.md). Contact/newsletter/shop/pricing sections do not provision mail, subscriptions, checkout or booking services.

## Templates and import/export

Each account can save up to five templates in its private library. The library has its own immediate save; applying a template changes only the portfolio draft and still requires **Save changes**.

Configuration-only export omits personal authored content by default. Including authored content, media and bindings is explicit. Imports are validated and reviewed before applying; append or confirmed replacement creates fresh section/item IDs. Imports cannot change identity, ownership, username, publication or CV settings. See [template limits and formats](features/section-templates.md).

## CV generation and extraction

Public and private PDF downloads share `packages/cv` and its Handlebars/JSON template. The canonical saved profile supplies content; there is no committed CV PDF to keep in sync. Page size, text size, inclusion and contact preferences remain independent where exposed in the editor. Local public generation uses `pnpm cv:generate`.

Optional **Import CV** accepts PDF, DOCX or UTF-8 text up to 3 MB. After consent, the server validates the file, authorizes the user, applies Redis limits and sends it to OpenAI. The original file is not stored in Supabase. Provider data policies still apply.

Users review and correct extracted fields, select groups to replace and apply them to the draft. Missing facts are not invented; new projects start hidden. Apply does not save or publish. Cancel/failure leaves the existing draft intact. See [CV import](features/cv-import.md) for exact limits, models, retention caveats and tests.

## Managed portfolios

Authorized administrators can create private temporary portfolios, import validated JSON, edit them, download private PDFs and explicitly publish. These records use administrator authorization, not a shared login or password.

Transfer requires a verified recipient and revision checks. An untouched private starter can be preserved before assignment; an edited/published recipient portfolio blocks transfer. Main cannot become managed, and the manager loses access after transfer. No invitation email is sent. See [managed portfolios](features/managed-portfolios.md).

## AI knowledge and chat

The AI profile tab inspects knowledge derived from the saved revision, not unsaved drafts. Public knowledge contains published, visible content; owner knowledge contains the full saved document and stays behind authorized reads. Inspecting it makes no provider request.

The existing public chat is restricted to the main portfolio. Each request re-reads the published snapshot, validates input and enforces Redis limits; missing/private profiles do not fall back to someone else's data. Conversation state is scoped by portfolio and revision. Premium chat for other accounts, subscriptions and an editing agent are not enabled.

See [AI foundation](features/portfolio-ai-foundation.md) for projections, limits, provider behavior and the remaining rollout.

## Homepage and fictional examples

The platform homepage has separate branding, metadata and theme storage. Its signed-in action resolves the user's editor without creating a workspace during the homepage read. The main example link follows the main profile's readable username; the external published-example fallback does not expose private records.

The layout gallery offers two fictional profiles per layout. Filters, previous/next controls and swipe have no autoplay and respect reduced motion. Illustrative portfolio/CV tabs are keyboard accessible and never save changes.

Examples live at `/p/examples/{slug}`, with matching `/cv.pdf` downloads. They work without database records, identify themselves as fictional and use noindex/nofollow. Keep their identities fictional and contact addresses under example.com. Edit gallery data in `apps/web/features/examples/data.ts` and assets in `apps/web/public/examples`.

## Search and public branding

Set `NEXT_PUBLIC_SITE_URL` to the canonical deployment origin. A profile's external website URL does not control the platform canonical URL.

Published pages derive titles, descriptions, canonical links, sharing cards, locale metadata and Person structured data from public content. The homepage uses platform metadata. Private editors and fictional examples remain noindex.

`/{username}/icon.svg` and `/{username}/share.png` use the published name, initials, role and accent. The sharing image is 1200 by 630 pixels. Private/missing profiles return 404, including for signed-in owners. These assets use no-store and do not fetch remote profile media. Already downloaded copies remain outside application control.

`/sitemap.xml` includes the homepage and published valid usernames, using anonymous reads of username/update columns and deterministic pagination. Without database configuration it lists only the homepage. Database errors fail the request instead of returning a silently incomplete list. Partition the sitemap before reaching 50,000 published portfolios.

`/robots.txt` advertises the sitemap and discourages crawling private/editor/API/auth/legacy/example/PDF routes. Crawler guidance is not authorization and does not guarantee indexing or rankings.

## Known boundaries and verification

Automated coverage includes layout/theme/language combinations, profile saves and publication, sections/templates, generated PDFs/assets, metadata/sitemap exclusions, managed access and AI request contracts. Browser tests use synthetic fixtures; they do not certify live OAuth, production RLS, paid model responses, Safari or Firefox. See [testing](testing.md).

Premium entitlements, bounded usage, sandbox billing, visitor chat and private editing proposals are implemented. Real checkout/webhook and paid model verification remain independent operational checks before launch. External commerce, automatic social feeds and media upload/transcoding need separate integrations. Hosted monitoring remains a setup plan in [observability](observability.md), not an active service.

Stripe sandbox billing is available at `/admin/billing` once its server configuration and migrations are installed. Checkout, customer portal and signed subscription webhooks are implemented; live keys remain disabled and actual sandbox checkout verification is required. See [setup and limitations](features/stripe-billing.md).

Pro owners can opt into a public portfolio assistant at `/admin/billing`. The reusable chat widget supports all portfolio layouts, with public-only context, isolated session history and reserved usage accounting. Existing main portfolio chat keeps its legacy behavior. See [premium portfolio chat](features/premium-portfolio-chat.md) for migration and verification requirements.

## Private AI editing assistant

Pro owners can generate validated changes from the AI assistant editor tab, review before/after values and apply selected fields to their draft. Saving remains explicit. Public visitor chat is independent of private assistant access. See [private AI editor](features/private-ai-editor.md) for supported fields, privacy, accounting and setup.

## Plans and demo testing

The homepage compares Free and Pro with dynamic sandbox pricing and bounded AI allowances. The subscription page exposes the same test price, and the editor links to plan/usage settings. A guarded server-only helper can seed fictional content into a separate verified empty account for private feature testing. See [plans and demo checklist](features/pricing-and-demo.md).

## Premium account status

Subscription settings show plan access, its end date, assignment/publication, separate AI usage and remaining attempts. Readiness explains missing Pro, assignment, service configuration, allowance, publication and visitor opt-in. Refresh status reloads account data without creating Stripe sessions or model requests. Checkout return never grants access. Billing errors use safe codes and next actions instead of raw provider payloads. See [premium status](features/premium-status.md).

## Optional Google profile import

Owners can request selected Google profile categories after normal login, review available name/email, city, phone, birthdate and current job details, then apply chosen fields to their draft. Google consent is separate from basic login and does not read mail or contacts. Birthdate is off by default and can become public profile data if explicitly saved; existing page/PDF layouts do not display it. People API/OAuth setup and verification are required. See [Google profile import](features/google-profile-import.md).
