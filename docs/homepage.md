# MyDevStudio homepage

`/` introduces the portfolio platform. It lives outside the personal portfolio route group, with its own header, footer, metadata and `WebSite` structured data. `/admin/login` also uses neutral platform branding. Homepage theme preferences use `mydevstudio-theme` separately from personal portfolio appearance settings.

Visitors can create a portfolio or sign in through the existing login page. A confirmed signed in user gets a link to their own editor, resolved from their verified auth UUID. Visiting the homepage does not create a workspace or change any profile. If an account does not yet have a workspace, the action goes through `/admin` to use the existing provisioning flow.

The illustrative preview switches between portfolio and CV views and previews the three existing accent colors. Its sample content is labelled as illustrative and never saves changes. Tabs support keyboard navigation, color controls have accessible pressed states, FAQs use native details controls, and layout styles include mobile and reduced-motion rules.

The real example link follows the original main portfolio's current username when it is publicly readable. If the local profile is private or unavailable, the link opens the published example at `https://mydevstudio.vercel.app/yusufyilmz` instead of jumping to the illustrative preview. This fallback links to a public page and does not read or expose a private document; the homepage and login page continue to work without a readable main document. Metadata does not copy a portfolio owner's personal facts.

Personal portfolios remain at `/{username}`, their editors at `/{username}/edit` and their PDFs at `/{username}/cv.pdf`. The original main portfolio retains its testimonials and chat on its username page. Existing `/p/{id}` redirects and `/cv.pdf` download compatibility remain in place. No database migration or new dependency is needed.

Set `NEXT_PUBLIC_SITE_URL` to the platform's canonical domain. The default is `https://mydevstudio.vercel.app`.

## Layout gallery

The homepage explains all four layouts (Engineer, Designer, Consultant and Minimal), four themes (Studio, Paper, Graphite and Bloom), three CV formats and independent English, Spanish and Turkish language settings. Language settings change labels and dates; they do not translate authored content.

The `/#examples` carousel contains two fictional profiles per layout. Filter by layout, use the previous and next controls, or swipe horizontally. There is no autoplay; arrow movement respects reduced motion. Every card opens a complete demo rendered with the same portfolio components as published profiles. The gallery and original real portfolio link serve separate purposes.

Demo pages live at `/p/examples/{slug}`, within the already reserved `p` namespace, so existing usernames are unaffected. PDFs live at `/p/examples/{slug}/cv.pdf`. These static examples do not read or write profile records and work without database configuration. All pages identify the work as fictional, use platform WebSite structured data and declare noindex/nofollow. Sample PDFs include a fictional example label and the same indexing restriction in response headers. Demo theme preferences use a separate key per example.

To edit the gallery, update `apps/web/features/examples/data.ts`. Keep identities fictional, external contact addresses under example.com, and project assets in `apps/web/public/examples`. No migration, new credential or dependency is required.
