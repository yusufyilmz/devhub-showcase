# Page Creation and Editing Design

Date: 2026-11-18. Status: proposed design for review; implementation has not started.

## Outcome

Give MyDevStudio a page builder whose layouts differ in composition, reading flow, media placement, and navigation. Authors can start from a preset, assemble a page from existing sections, or ask the assistant to propose a page. All three paths produce the same editable document and use the same preview and published renderer.

The first deliverable is a better portfolio homepage builder. Additional About, Work, Blog, Contact, Pricing, Careers, and Shop pages follow on the same foundation. Existing portfolios keep their current renderer until their owner explicitly adopts the builder.

## Research and evidence

Reviewed the live reference pages in the browser and read representative source files, rather than relying on repository descriptions. Repository main snapshots inspected:

| Repository      | Commit                                     | Relevant findings                                                                                                                                                  |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DevHub          | `3a5b2c17d922ac518dfed543376b88922096316a` | Latest GitHub main at review time. Local source inspection used `fb65f90b`, the Studio refactor included by the merged branch. Recheck main before implementation. |
| PageForge AI    | `82ee192f7b9125bf42b899fb3e356c2be4983eb2` | Typed configuration, template factories, a fluent builder, section registry, and preview routes.                                                                   |
| M Squared Home  | `8271de3e2a1f7a19bd7751802f0b22ee5279903f` | Full-height media introduction, a lead product followed by a smaller grid, categories, brand story, studio media, and closing CTA.                                 |
| Yunus portfolio | `2671de84a961eb77f4389bc78e3bb8132d0e4dd6` | Full-height media introduction, work showcase, dedicated work/contact routes, and a short conversion path.                                                         |

### Once UI is the primary visual reference

| Reference                                                   | Observed compositions                                                                                                                | Adaptation in DevHub                                                              |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| [About](https://docs.once-ui.com/blocks/about#About4)       | Simple rounded/sharp pages, media-led introduction, manifesto/founder story, contributor grid, and sticky supporting CTA.            | Distinct profile, visual story, manifesto, and story-with-aside presets.          |
| [Blog](https://docs.once-ui.com/blocks/blog#Blog1)          | Post grid, magazine feature, topic sidebar with article rows, and featured article with supporting panels.                           | Editorial index, magazine, journal with sidebar, and article-detail compositions. |
| [Careers](https://docs.once-ui.com/blocks/careers)          | Role lists, editorial hiring information, job detail layouts, and sticky team/interview information.                                 | Reusable split layouts for portfolios and real careers content.                   |
| [Contact](https://docs.once-ui.com/blocks/contact#Contact1) | Minimal contact, details/form combinations, support routing, and people-led sales contact.                                           | Contact information, inquiry, and booking variants with honest action labels.     |
| [Pricing](https://docs.once-ui.com/blocks/pricing#Pricing1) | Plans with FAQ/testimonial, comparison with callouts, service bundles, and a wide matrix with sticky headings/mobile plan selection. | Services pricing, bundle selection, and comparable plan tables.                   |

The live catalog currently has About1–7, Blog1–4 plus Post1, Careers1–4 plus Role1–3, Contact1–4, and Pricing1–4. Do not invent Careers5–7 or treat every catalog entry as the same kind of page. Use the actual referenced composition. Reference counts can change.

Also inspected [Yunus's live portfolio](https://yunusyilmaz-portfolio.vercel.app/) and [M Squared Home](https://msquared-home.vercel.app/). Some media did not display during inspection. Borrow their composition, with reliable media fallbacks, rather than reproducing broken assets or autoplay assumptions.

Source reading covered PageForge's [PageBuilder](https://github.com/yusufyilmz/pageforge-ai/blob/82ee192f7b9125bf42b899fb3e356c2be4983eb2/src/lib/services/page-builder/PageBuilder.ts), [templates](https://github.com/yusufyilmz/pageforge-ai/blob/82ee192f7b9125bf42b899fb3e356c2be4983eb2/src/lib/services/page-builder/templates.ts), [UniversalPage](https://github.com/yusufyilmz/pageforge-ai/blob/82ee192f7b9125bf42b899fb3e356c2be4983eb2/src/components/universal-page/UniversalPage.tsx), [section dispatcher](https://github.com/yusufyilmz/pageforge-ai/blob/82ee192f7b9125bf42b899fb3e356c2be4983eb2/src/components/universal-section/UniversalSections.tsx), page types, designer/developer previews, and representative About/Careers/Pricing sections. Its AIWebsiteGenerator explicitly simulates responses and completion with timers. Its renderer does not implement all the layout behavior suggested by the configuration. Reuse the composition concepts; DevHub should retain its existing real assistant, validation, and publication boundaries.

For the other projects, read [M Squared's homepage](https://github.com/yusufyilmz/msquared-home/blob/8271de3e2a1f7a19bd7751802f0b22ee5279903f/app/page.tsx), hero and product compositions, and [Yunus's hero](https://github.com/yusufyilmz/yunusyilmaz.portfolio/blob/2671de84a961eb77f4389bc78e3bb8132d0e4dd6/components/sections/hero-section.tsx). Reimplement useful patterns with DevHub components and tokens; do not copy an entire styling/runtime system.

### What DevHub already has

- Six profession-oriented portfolio types and nine curated templates. Templates mainly select section order and existing renderers. Profession and page layout are currently coupled.
- A consultant split/sticky introduction in `apps/my-dev-studio/views/published/PortfolioLayout.tsx`; Engineer has a separate rendering path. Extend deliberately rather than adding a third unrelated renderer.
- Six canonical built-in sections, 48 authorable section types, nine view-only preview examples, source bindings, custom section IDs, mixed ordering, and a shared preview/gallery.
- A versioned private section-template library and PageForge section import. Import currently flattens page regions into a section list, so it cannot preserve a full page composition.
- Some real section variants, but many families still share collection-style presentation. Registry coverage is not proof of visual variety.
- Existing draft recovery, history, revision conflicts, publication snapshots, field visibility, public project filtering, media controls, and structured assistant proposals.
- Existing spacing tokens in `styles/tokens/primitives.css` and `appearance.css`, token-backed utilities in `spacing-utilities.css`, semantic colors/radii/type tokens, and exactly three density choices. Some section CSS still uses fixed padding/margins and broad descendant rules.

## Approach and scope

Three plausible approaches were considered:

1. Add more profession templates to the existing system. Cheap, but preserves the layout limitations the user reported.
2. Build a structured page composer using the migrated sections. Recommended: genuine layout choices, manual editing, useful presets, and assistant-generated configurations all share one contract.
3. Build a free-position canvas or execute generated React/CSS. Much larger editing and compatibility burden, and undermines consistent tokens, accessibility, and predictable publication.

Proceed with approach 2 as the proposed implementation. This recommendation is an engineering decision for review, not a claim that the user already approved every detail below.

### Delivery milestones

- **A — Foundation and portfolio builder:** align all section spacing, introduce layout documents, build real layout shells, preset/blank creation, and the shared editor. Save/reload/publish one homepage end to end.
- **B — Rich pages:** complete meaningful section variants, typed editorial/business/catalog data, additional page routes, navigation, SEO, and reviewed page import/export.
- **C — Assistant:** generate and revise validated page proposals using the same builder operations, with explicit preview/apply/save/publish steps.

The first milestone must stand alone. A full CMS, stock/order management, payments, form delivery service, mailing-list service, and custom-domain product are separate integrations. Link to configured destinations and make unsupported capabilities clear without fake success states.

## Shared design-token and spacing contract

**Use the tokens already in the repository. Do not create a parallel scale or retune the global scale as part of this project.** Align every reusable section, editor, and variant to those tokens. Prefer token-backed Tailwind utilities; keep custom CSS only for a demonstrated layout, motion, or third-party constraint.

| Responsibility                       | Standard mapping to existing tokens                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Page horizontal gutter               | `--spacing-md` in narrow containers; `--spacing-xl` in wide containers                                             |
| Section-to-section rhythm            | One `--spacing-3xl` gap in wide layouts; `--spacing-2xl` in narrow layouts                                         |
| Heading group                        | Eyebrow/title gap `--spacing-s`; title/description gap `--spacing-sm`                                              |
| Heading-to-content                   | `--spacing-lg` narrow; `--spacing-xl` wide                                                                         |
| Collection gaps                      | `--spacing-md` narrow; `--spacing-lg` wide                                                                         |
| Card padding                         | `--spacing-md` narrow; `--spacing-lg` wide                                                                         |
| Body paragraphs and stacked metadata | `--spacing-sm` between paragraphs; `--spacing-s` within metadata                                                   |
| Distinct background bands            | Own internal block padding of `--spacing-2xl` narrow / `--spacing-3xl` wide; adjacent bands have zero external gap |
| Bordered section panels              | Existing radius tokens, one `border` with `border-border`; avoid automatically framing every section               |

Use classes such as `gap-md`, `p-lg`, and `px-md` where emitted. For missing utility combinations use a static Tailwind token reference such as `py-(--spacing-2xl)`; never construct class names at runtime. No new numeric spacing values in individual section implementations.

**One owner per spacing boundary:** the page region stack owns spacing between contained sections, the section frame owns heading/content rhythm, and cards own their inner padding. A section rendered in a page must not retain standalone top/bottom margins that add to the stack gap. Standalone Storybook and gallery previews use the same frame contract, with their outer wrapper supplying the missing page gutter. Full-bleed bands use an explicit stack boundary rule, not negative margins.

Define `SectionFrame` and `SectionHeading` in the existing `sections/section` folder. Adapt the existing `Section` internally to use them while preserving its API, rather than adding another outer wrapper. The existing interactive `SectionHeader` retains its disclosure/control behavior; the new heading handles semantic editorial titles. Reset only the section's own text margins, and use scoped prose rules for authored long-form text. Remove broad rules such as `.library-section p` that alter nested controls. Grouped sections must not multiply padding. Token-driven density must affect sections without enlarging editor chrome or changing the root font size.

Audit all section folders and all registered variants, including editors and nested components. Create a registry-derived checklist in `docs/reference/section-layout-inventory.md` with folder, variants, spacing-aligned status, and reviewed status. A checked label is sufficient; record blockers separately. Also update the existing `docs/testing/manual/shared-ui-inventory.md`. Do not inherit checked status from the older section migration plan.

## Page layout contract

Page purpose, layout, section variant, and theme are separate choices. A consultant can use a gallery; a writer can use a split introduction. Changing layout does not replace facts or change CV settings.

| Layout ID      | Visible structure                                                                    | Scroll and narrow behavior                                                                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flow`         | Normal document, contained sections, optional full-bleed bands.                      | Document scroll; one column in narrow containers.                                                                                                                                                                 |
| `split-sticky` | Introduction or supporting aside remains sticky beside the main story.               | Native document scroll. Sticky block becomes static if too tall or container is narrow.                                                                                                                           |
| `split-scroll` | Viewport-height introduction beside an independently scrollable content pane.        | Explicit opt-in on wide desktop containers only. Accessible labelled scroll region, keyboard access, hash links, and focused element visibility. Falls back to document scroll when narrow, zoomed, or too short. |
| `cover`        | Edge-to-edge media hero and one dominant CTA, optionally followed by story sections. | Use `min-height`, not a clipping fixed height. Can be a one-section landing page. Poster/plain fallback and visible video controls.                                                                               |
| `editorial`    | Featured story, narrower reading column, supporting topic/author/contents rail.      | Aside stacks in reading order when narrow. Article text uses a readable maximum line length.                                                                                                                      |
| `gallery`      | Featured visual project/product plus a responsive supporting collection.             | Images retain aspect ratio; optional masonry stays a section variant. No mandatory carousel.                                                                                                                      |

The renderer receives resolved header/hero/main/aside/footer regions. Layout metadata declares supported regions and allowed sticky placement. Switching layouts retains content assigned to a region unavailable in the new layout by moving it to main in stable order; show that move in the draft change summary. Do not silently drop a region.

Use container queries for an embedded preview and section composition. A 1440px editor with a 390px preview must render the narrow page. Split layouts require at least a 64rem page container and sufficient available height; otherwise use flow. Sticky offset accounts for header height and the existing spacing token. Check overflow/transform ancestors that break sticky behavior. Never add document-level scroll interception.

## Document, bindings, and persistence

Introduce optional `PortfolioProfile.site: PortfolioSiteDocument`. It starts with one homepage, and can later contain up to 12 pages. JSON stays in the existing draft/publication document; no new database table is needed for milestone A. Validate actual database request/RPC constraints before enabling additional pages.

- Site: `schemaVersion: 1`, `homePageId`, `pages`, and navigation entries referencing page IDs.
- Page: stable UUID `id`, title, optional description/social image, `kind`, slug, `published`, layout, and an ordered `placements` array.
- Page kinds: portfolio, landing, about, work, blog, article, contact, pricing, careers, job, shop, and product.
- Placement: stable UUID `id`, region, visible flag, typed content reference, and optional validated presentation override.
- References: one of `profile-intro`, `profile-contact`, `profile-section` with one of the six built-in kinds, or `custom-section` with an existing `custom-*` ID.
- Presentation: a built-in renderer compatible with its kind, or a section layout/renderer compatible with its authorable type; width is `contained`, `reading`, or `bleed`; surface is `plain`, `muted`, or `card`.
- No nested arbitrary layout tree in version 1. Use real section variants for bento, tabs, grids, and media arrangements.

Canonical content remains in profile fields and custom sections. A placement is an instance of that content, not a copied profile. Editing shared content displays where else it is used. Duplicate placement and duplicate section-with-content are separate explicit actions. A renderer gets a placement-scoped render ID so repeated content cannot generate duplicate DOM IDs. Keep stored content/item IDs unchanged.

Global visibility/privacy is an upper bound. A local placement can hide more, but cannot re-enable globally hidden fields or private projects. For builder sites, compute the reachable content graph from visible placements on published pages, including canonical fields used by profile-source bindings. Prune custom sections, typed data, and career arrays reachable only from hidden/unpublished placements, as well as unpublished pages, invalid/pruned references, and navigation to them. Shared identity/chrome fields remain subject to the existing field-visibility rules. Removing only placements is insufficient because the canonical data otherwise remains in serialized profile props and visitor AI context. No-site projection keeps its existing semantics. CV projection strips `site` entirely. Public navigation, metadata, JSON-LD, and assistant visitor context must only see the published projection.

Drafts may temporarily have an unpublished homepage, but publication requires a valid homepage with `published: true` and at least one visible, renderable placement. Reject publication otherwise and preserve the draft. A corrupt published builder snapshot with no valid homepage yields not-found; never fall back to a legacy profile or another page. Hiding a homepage from navigation is a separate concern from unpublishing it.

Old profiles with no `site` retain their exact legacy path. `createSiteFromLegacy(profile, newId)` explicitly creates a draft homepage from the existing order, hidden states, renderer choices, hero, and custom section sequence. For builder documents, the page outline becomes the ordering authority; replace old ordering controls with navigation to it. Content editors remain canonical. Do not maintain two independently editable ordering arrays for one builder page.

Limits: 12 pages/site, 80 placements/page, 200 placements/site, 60 existing custom sections, 30 existing items/section. Enforce a total serialized profile limit of 250,000 UTF-8 bytes at all save/import/assistant application boundaries; reconcile the existing managed-input character limit in the schema task. Reject oversize updates atomically with a readable error and keep the draft. These are bounded authoring documents, not large post/product databases.

## Creation and editing experience

Creation starts with **Choose a preset**, **Start blank**, or **Ask the assistant**. Profession is an optional recommendation filter. Every preset has a real desktop/mobile preview using the production renderer. Browse mode uses fictional content; applying to an existing draft preserves existing content and marks missing content for completion. Demo facts never enter an existing portfolio silently.

The editor has one primary page/section outline. Selecting an item opens content and settings; the display variants are a vertical list with recognisable thumbnails beside the live preview. No duplicate Preview sections picker within an already-selected section editor. Keep the existing featured homepage selector unless a separate change is requested.

```text
Pages and section outline | Selected section controls | Page / section preview
Home                     | Content / Design           | Desktop · Tablet · Mobile
  Introduction           | Vertical variant thumbnails | Rendered draft
  Selected work          | Width / surface             | Insert above / below
  Contact                | Visibility / data source    |
Add section              |                             | Undo · Redo · Save
```

At smaller desktop widths the inspector is a drawer; on mobile use one active surface at a time, with a clear return to preview. Creation is a wide workspace/fullscreen mobile dialog with one intended content scroll region and reachable actions. Do not scale down a desktop page to simulate mobile.

Use the existing sortable-list keyboard controls and move buttons. Adding from the lightbox/gallery inserts only after an explicit Add action. Browsing, selecting a variant, or viewing a fictional example cannot publish or submit the create form. Save draft, apply proposal, and publish remain distinct operations. Undo groups a preset application or assistant proposal into one action. Retain at most 30 history entries and a 5MB serialized history budget. Recovery, offline/error feedback, and revision conflicts preserve user work.

## Presets and meaningful variants

Initial presets: Classic portfolio (`flow`), Consultant dossier (`split-sticky`), Studio split (`split-scroll`), Cinematic portfolio (`cover`), One-screen video CTA (`cover` with only hero), Visual work (`gallery`), Founder story (`flow` with manifesto), Journal (`editorial`), Magazine (`editorial` with lead feature), Services (`flow` with pricing/FAQ), Makers catalog (`gallery`), and Hiring (`split-sticky` with role list).

A variant counts when information structure, media placement, or interaction changes. Color/radius adjustments alone do not count. Prioritize About/story, Hero, Work/gallery, Blog, Careers, Contact, Pricing/Plans, FAQ, Services/Features, Testimonials, and Newsletter. Bring every remaining registered family onto the same section frame; add alternatives only when there is a useful content-supported distinction. Every exposed variant must have a working editor, fixture, story, preview, and round-trip through save/import/export.

For richer pages, add optional typed section data for posts, pricing, careers, and catalog sections. Preserve legacy items as the fallback, and avoid storing structured details as ad hoc prose. Posts need title, slug, excerpt, date, author, cover, topic, and a real destination. Pricing needs currency and explicit billing interval/amounts; never compute or claim an annual discount from missing data. Jobs need role, location, employment type, details, and an application destination. Products need image/alt, price or inquiry label, category, and a real destination. Filters and comparison switches must actually change visible content and keep keyboard focus predictable.

Treat authored articles as structured text, not executable MDX. Product/job/article detail pages use normal page IDs and links. Do not promise stock accuracy, purchases, email delivery, or applications sent when the page only links elsewhere. Empty/error/loading states are designed alongside populated states.

## Assistant and import behavior

Extend DevHub's real assistant task flow. Give it the allowed page layouts, registered variants, the current draft and selected target, and configured capabilities. Ask for typed operations, never arbitrary component code, class names, HTML, CSS, or executable imports.

Supported operations: create page, change layout, insert section, update section content, update placement presentation, move/remove placement, and update page metadata. Resolve temporary IDs within one proposal. Validate compatibility, privacy, size, target ownership, dependencies, revision, and draft fingerprint before applying selected changes atomically. Present the proposed structure and a live preview first. Newly inserted content must be marked as supplied facts or suggested copy needing review; never fabricate biography, clients, testimonials, qualifications, or prices.

Apply is local and undoable, save uses existing revision checks, and publish is explicit. Disable assistant creation cleanly when unconfigured. Timeout, invalid output, cancellation, retry, or stale draft must not partially mutate or publish. Request IDs prevent an applied proposal from inserting duplicates.

Keep existing `mydevstudio.sections` version 1 exports/imports. Add a separate `mydevstudio.pages` version 1 format containing page composition and referenced custom section configurations. Configuration-only export strips authored content/media/contact/source bindings and SEO copy; generic intro/contact/built-in references remain structural slots bound to the destination profile. Include-content exports add authored custom-section data only, never canonical identity, career, contact, or CV facts. Import does not overwrite destination profile facts. Profile-bound selections rebind to compatible destination fields with source item selections cleared and an explicit review warning; no stale source IDs survive. Repeated placements may intentionally share one content reference; only duplicate entity IDs and dangling references are rejected. Preserve PageForge regions in a new page-import adapter while reusing its current section conversion. Unsupported regions/layouts produce reviewable warnings; unknown executable content is rejected. Import creates fresh IDs, shows append/replace impact, and touches only the current draft.

## Quality and completion

Review Sand first in light/dark, then Cyan or another palette. Test all three existing densities. Every registered section and selectable variant needs a story. Test representative compositions at 320, 390, 768, 1024, and 1440px; include long headings, empty data, missing/broken media, mixed sections, repeated content, keyboard-only navigation, reduced motion, 200% zoom, and language expansion.

Layout review must show distinguishable page silhouettes, consistent token spacing between unlike adjacent sections, reachable content in sticky/scroll modes, and parity among gallery, creation, editor, draft preview, and published page. Run focused behavioral tests per task and relevant full checks at milestone boundaries. Record blocked checks honestly. Implementation is ready only when create/edit/save/reload/publish works with fixtures and legacy/privacy/CV behavior remains covered.

No product implementation, production changes, commit, or push is part of this planning document.
