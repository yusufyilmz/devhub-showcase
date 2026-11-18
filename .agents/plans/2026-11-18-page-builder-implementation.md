# Page Creation and Editing Implementation Plan

> **For agentic workers:** Use Superpowers `executing-plans` to implement this plan task by task. Track each deliverable below. Read the design first and implement milestone A before expanding scope.

**Goal:** Build genuinely different, token-consistent pages from existing shared sections, presets, or assistant proposals through one creation/editing/preview system.

**Architecture:** Keep portable rendering/editor controls in `packages/ui`, JSON metadata in `packages/config`, validation/import/domain logic in `packages/lib`, and assistant proposals in `packages/assistant`. MyDevStudio owns routes, authorization bindings, and application composition. Preserve the existing legacy renderer until a portfolio explicitly adopts the new document.

**Tech stack:** Existing React, Next.js, TypeScript, Tailwind, shared theme tokens, Zod, Storybook, Vitest, and Playwright. Use current root `package.json` for runtime versions, currently Node `>=24.15.0 <25` and `pnpm@12.21.0`; older AGENTS references to pnpm 11 need reconciliation.

**Spec:** [Page Creation and Editing Design](2026-11-18-page-builder-design.md). The spec includes inspected source commits, live Once UI references, layout/spacing rules, limits, and scope decisions. This plan is proposed for review; no implementation tasks are complete.

## Global constraints

- Fetch current GitHub main before implementation, inspect checkout/status, and preserve unrelated work. Planning inspected main `3a5b2c17d922ac518dfed543376b88922096316a`. Do not reset a dirty checkout.
- Use the existing tokens. Do not add a second spacing scale, new density modes, or hardcoded section margins/paddings. Use token-backed Tailwind first; custom CSS needs a concrete purpose.
- Cover all 48 authorable section families, nine view-only examples, nested presentations, and their variants. Preserve public imports, IDs, localized copy, bindings, hidden/private content, and CV output.
- Public routes render published projections only. Manual creation, presets, and AI all edit the same draft contract. Previewing or applying never publishes.
- Keep services/auth/database/Next.js out of `packages/ui`. Use shallow declared exports. Update generated catalogs with the generator, not manual edits.
- Reuse existing draft/recovery/history, responsive preview iframe, section editor/renderer registries, sortable controls, lightbox, and assistant provider. Do not build competing stores or simulated AI.
- Keep the existing homepage featured selector. Do not reintroduce a second section navigator inside a selected section's inspector.
- Limits from the spec apply to parsing, manual edits, AI, import, and save. CV projection removes all page-builder data.

## Review focus

1. Private data referenced from a new page must be pruned from HTML, client payloads, metadata, navigation, exports, and visitor AI context. Tasks 4, 11, 12, 14.
2. Adjacent sections and nested section compositions must have one spacing owner; density changes must not double padding. Tasks 1–3.
3. A split pane or tall sticky block must remain usable at narrow widths, short heights, zoom, keyboard focus, and hash navigation. Task 5.
4. Repeated content and preset/import duplication must generate unique placement/render IDs without rewriting canonical IDs. Tasks 4, 6, 8, 13.
5. A stale AI/preset/import result or revision conflict must not lose newer edits or partially apply dependencies. Tasks 7, 9, 13, 14.

## File map

Paths marked new are proposed. Verify paths on freshly fetched main before coding; update this map if the repository has moved. Colocate tests/stories with their implementation. Keep the current section folders instead of doing another package migration.

| Responsibility                 | Files                                                                                                                                                                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing token foundation      | `packages/ui/src/styles/tokens/{primitives,appearance,spacing-utilities,tailwind}.css` — consume; avoid changing scale values                                                                                        |
| Shared section framing         | New `packages/ui/src/sections/section/{section-frame,section-heading}.tsx`, `section-frame.test.tsx`, and `spacing-contract.stories.tsx`; existing `Section.tsx`, `SectionHeader.tsx`, `sections.css` and `index.ts` |
| Section family alignment       | Existing folders under `packages/ui/src/sections`, especially `section-presentation`, `collection-view`, built-in presenters, and their stories                                                                      |
| Page metadata and types        | New `packages/config/src/pages/{types,layouts,presets,legacy,resolve,public-projection}.ts`; existing `src/profile/profile.ts`                                                                                       |
| Page validation and operations | New `packages/lib/src/schemas/page/{document,operations,template}.ts` and `src/services/page/{operations,presets,pageforge-import,templates}.ts`                                                                     |
| Rendering                      | New `packages/ui/src/sections/page-renderer/{page-renderer,page-layout,page-region,placement-renderer}.tsx`, with `types.ts`, tests and stories                                                                      |
| Builder controls               | New `packages/ui/src/sections/page-builder/{page-outline,page-inspector,page-preset-picker,page-section-picker,page-toolbar}.tsx` with colocated tests/stories                                                       |
| Client history                 | New `packages/runtime/src/page-builder/{use-page-builder,history}.ts`; integrate existing recovery and draft update callbacks                                                                                        |
| App composition                | New `apps/my-dev-studio/views/page-builder/page-builder-workspace.tsx`; existing `views/published/{PortfolioLayout,registered-sections}.tsx` and public route                                                        |
| Create/edit integration        | Existing `packages/assistant/src/components/studio/workspace/{profile-editor,portfolio-setup,preview-content}.tsx` and `portfolio-setup/stage-content.tsx`                                                           |
| Assistant                      | Existing `packages/assistant/src/models/{portfolio-edit-model,studio-agent-prompt}.ts`; new `models/page-proposal.ts`; existing task validation and request binding                                                  |
| Guides and inventory           | New `docs/reference/section-layout-inventory.md`, `docs/testing/manual/page-builder.md`; existing `docs/testing/manual/shared-ui-inventory.md`, manual index, section-system and section-template docs               |

## Execution and verification loop

For each task, add the named behavioral tests first, run the focused Vitest file(s) to establish failure, implement, and rerun to pass. Do not write tests that merely duplicate class strings. Verify computed behavior and user outcomes. Pure styling alignment can use visual checks instead of artificial unit tests.

Use `pnpm exec vitest run --project unit <file-or-pattern>` for the named unit tests. Add stories for new controls and every public section variant, inspect their actual rendering, and update the inventory only after review. Commit a focused task/family batch with its result. Push to the implementation PR as authorized; run full checks at the milestone gates, rather than after every spacing edit.

## Milestone A — Token alignment and a working portfolio page builder

### Task 1 — Establish the section spacing contract

**Files:** New `section-frame.tsx`, `section-heading.tsx`, `spacing-contract.stories.tsx`, `section-frame.test.tsx` under `packages/ui/src/sections/section`; existing `sections.css`, `section/index.ts`, `sections/index.ts`; new inventory.

**Interfaces:** `SectionFrame({id, heading, children, context, surface, width})`, where `context` is `standalone | composed`, `surface` is `plain | muted | card`, and `width` is `contained | reading | bleed`. `SectionHeading({id, eyebrow?, title, description?, level})`, with heading level restricted to 1, 2, or 3. Props include the corresponding DOM/React types and retain existing section-specific APIs.

- [x] Inventory every folder and all current renderer/layout IDs from registries and preview examples. List view-only components separately. Record current fixed spacing and CSS purposes; no blanket deletion.
- [x] Build a mixed-section spacing story with Hero, About, project grid, FAQ, Pricing, Contact, and a full-bleed band. Include nested cards, long copy, controls, and three densities.
- [x] Implement the spec's spacing ownership with existing `--spacing-*` values and static Tailwind utilities. Adapt existing Section internally and preserve SectionHeader's interactive behavior. Zero section-owned outer margins in composed mode; let page stacks own gaps. Use scoped text resets. Do not change global token values.
- [x] Add tests `preserves_heading_landmarks`, `standalone_and_composed_keep_content`, and `nested_controls_keep_accessible_names`. Add a browser spacing contract test later in Task 3 for actual computed geometry.
- [x] Review Sand light/dark at 320/1440px and all densities. Commit `refactor(ui): establish shared section spacing contract`.

Task 1 result: commit `d346b4ce`. `pnpm exec vitest run --project unit packages/ui/src/sections/section/section-frame.test.tsx packages/ui/src/sections/section/section-views.test.tsx` passed, 7 tests. Storybook `UI/Layout/Section/Spacing Contract` was reviewed on Sand. At 1440, comfortable contained sections had a 64px stack gap, 32px heading gap, and 0px section margin. The muted band used 64px block padding and 0px margin. At 320, the same sample used a 48px stack gap, 24px heading gap, and 16px gutter, with no horizontal overflow. Compact and spacious followed their own token values. Contact labels stayed "Your email", "Subject", and "Message". FAQ disclosure opened. Family rows stay not aligned.

### Task 2 — Align every section and editor to existing tokens

**Files:** All inventoried section folders, `section-presentation/{presenter,styles}`, `collection-view`, `studio` editor presentation, and relevant styles/stories. Preserve intentional media aspect ratios, sticky geometry, and animation rules.

**Interface:** Existing section/editor exports remain compatible; internally use Task 1 framing. `SectionProps` gains only optional composition context/heading/render-ID fields where required, with legacy defaults.

- [ ] Migrate in reviewable groups: intros/prose frame applied, with About and Text reviewed; work/history; galleries/media; editorial/navigation; business/pricing; contact/social; studio editors and helpers.
- [ ] Remove fixed section margins/paddings and duplicate heading gaps. Use token gaps for cards and grids. Replace broad descendant selectors with local Tailwind composition. Keep justified custom CSS and note its purpose beside the rule.
- [ ] Make empty and populated sections obey the same frame contract. Ensure hidden sections leave no gap or separator. Parent compositions and children must not each supply page gutters.
- [ ] Review every registered type and every selectable variant in its story. Mark each inventory row `checked` only after inspecting it; list blocked checks separately. Use focused existing section/rendering tests after each family.
- [ ] Commit each family batch. Do not claim all sections are aligned based on one shared container or only the Hero.

### Task 3 — Verify mixed-section rhythm and style cleanup

**Files:** New `apps/my-dev-studio/e2e/portfolio/section-spacing.spec.ts`; Task 1 story; inventory; old section CSS rules touched in Task 2.

**Interfaces:** Test fixture uses the same frame and token imports as production. No production-only test hooks or remote data.

- [ ] Assert computed adjacent contained-section gaps equal the resolved existing spacing token, not a duplicated sum. Assert full-bleed bands have their own internal padding and no accidental external gap.
- [ ] Exercise compact/comfortable/spacious, Sand light/dark, a second palette, 320px, nested cards, and text-size/zoom growth. Assert no horizontal document overflow and no space left by a hidden section.
- [ ] Check standalone gallery/Storybook framing against composition framing. Remove superseded CSS after checking usages, including library paragraph/heading defaults that override nested controls.
- [ ] Add a bounded source audit for forbidden fixed section spacing with an explicit exception list for structural geometry; visual tests remain authoritative. Report remaining justified custom rules.
- [ ] Commit `test(ui): cover token spacing across section compositions`.

### Task 4 — Introduce validated page documents and legacy conversion

**Files:** New config `pages/{types,layouts,legacy}.ts`; lib `schemas/page/document.ts`; existing profile type/schema, `portfolio/public-projection.ts`, and public-projection tests. Add shallow package exports and dependencies only where needed.

**Interfaces:** `PortfolioSiteDocument`, `PageDocument`, `SectionPlacement`, `PageLayoutId`, `PageRegionId`, `PageKind`, and `PlacementPresentation` implement the design. Config owns `createSiteFromLegacy(profile: PortfolioProfile, newId: () => string): PortfolioSiteDocument` and pure `projectBuilderProfile(profile: PortfolioProfile): PortfolioProfile` in `pages/public-projection.ts`. Lib owns `validateSite(profile: PortfolioProfile): PortfolioSiteDocument | undefined` and `validateSitePublication(profile: PortfolioProfile): void`. Config must not import the lib validator.

- [ ] Add tests `legacy_profile_without_site_is_unchanged`, `conversion_preserves_hidden_order_and_renderers`, `rejects_duplicate_or_dangling_ids`, `rejects_incompatible_variants_and_regions`, `rejects_page_and_byte_limits`, `public_projection_prunes_private_sources_and_unpublished_pages`, and `cv_projection_omits_site`. An unpublished article's unique secret string must be absent from the projected profile, HTML/metadata, and visitor AI context; test hidden-only source arrays too.
- [ ] Implement optional site schema version 1. Restrict region/layout/variant values and prototype properties; enforce page/placement/custom-section limits and total UTF-8 byte budget. Resolve links by page ID. Introduce the 12-page schema with UI creation capped to one homepage until Task 11.
- [ ] Keep no-site parsing and rendering unchanged. Preserve existing visibility as the upper bound. Use a single source for canonical content; page placement stores only reference/presentation. Compute public reachability through source bindings and prune unreachable canonical data, not just placements. Test repeated visible references remain valid.
- [ ] Require a published, renderable homepage at publication time. Test that an unpublished/empty homepage blocks publication but can remain a draft. Invalid published builder snapshots return not-found, never the legacy fallback.
- [ ] Reconcile current managed-input character limits and save/import boundaries with the 250,000-byte profile limit. Reject atomically, without truncation. Test existing larger legacy reads separately from new writes so a limit change never silently corrupts a stored profile.
- [ ] Verify published snapshots and the separate CV document shape support the optional JSON field without a schema migration. Commit `feat(pages): add versioned page composition documents`.

### Task 5 — Implement six distinct layout shells

**Files:** New `page-renderer/page-layout.tsx`, `page-region.tsx`, `types.ts`, tests/stories; new `apps/my-dev-studio/e2e/portfolio/page-layouts.spec.ts`; config `pages/layouts.ts`; existing HeroSurface only as needed.

**Interface:** `PageLayout({layout, regions, headerOffset})`, with regions containing resolved React nodes and layout using the design's six IDs. Static class maps implement each layout; no stored Tailwind strings. Layout availability comes from the same metadata used by the picker.

- [ ] Implement `flow`, `split-sticky`, `split-scroll`, `cover`, `editorial`, and `gallery` as different structures. Add one story per shell with identical content so differences are easy to assess.
- [ ] Use container-based responsive changes. At less than 64rem or insufficient height, split modes become document flow. Tall sticky content becomes static; no unreachable bottom content. Set up height measurement/ResizeObserver only if CSS cannot express this reliably.
- [ ] Use one labelled focusable content pane for split-scroll on supported desktop containers. Test Tab, PageDown, Shift+Tab, skip links, anchors, focus visibility, browser back, and footer reachability. No wheel hijacking.
- [ ] Cover `min-height` hero content expansion, poster fallback, reduced motion, pause/play, header readability, and failure to autoplay. Reuse HeroSurface instead of cloning media behavior.
- [ ] Add browser assertions for sticky element position before/after scroll and a narrow iframe inside a wide editor. Commit `feat(pages): implement distinct responsive page layouts`.

### Task 6 — Share the renderer across draft and published pages

**Files:** New `page-renderer/{page-renderer,placement-renderer}.tsx`; existing section props/presenters, `views/published/{PortfolioLayout,registered-sections}.tsx`, `app/[username]/page.tsx`, and `workspace/preview-content.tsx`.

**Interfaces:** `PortfolioPageRenderer({profile, pageId, mode, chrome})`, where `mode` is `public | draft | catalog` and `chrome` supplies portable header/footer slots. Config's `pages/resolve.ts` owns `resolvePagePlacements(profile, pageId)`, returning compatible resolved data without fetching or React imports. Public routing must supply an already authorized/projected snapshot.

- [ ] Add tests `same_document_has_same_composition_in_preview_and_public`, `repeated_source_has_unique_dom_ids`, `empty_or_hidden_content_has_no_blank_region`, `no_site_uses_legacy_renderer`, and `cover_can_contain_only_one_intro_and_cta`.
- [ ] Adapt existing ConfiguredSection/CustomPortfolioSection rendering. Add placement-scoped DOM IDs/anchors without changing canonical IDs. Avoid rendering a second built-in hero/contact outside a builder document.
- [ ] Make public and draft views choose the new renderer only when site exists. Keep special legacy Engineer/referral/chat behavior in app adapters, and verify it remains unchanged for no-site portfolios.
- [ ] Derive nav/TOC from visible resolved placements. Constrain heading levels so one page has a single primary heading; no image-only essential content.
- [ ] Check no upward app imports enter shared renderer code. Commit `feat(pages): share draft and published page rendering`.

### Task 7 — Add document operations and undoable draft state

**Files:** New lib `schemas/page/operations.ts`, `services/page/operations.ts`; runtime `page-builder/{history,use-page-builder}.ts`; existing recovery integration.

**Interfaces:** `PageOperation` discriminated union; `applyPageOperations(profile, operations, newId): {profile, affectedPageIds, warnings}`; `usePageBuilder({profile, onChange})` with dispatch/undo/redo and selected page/placement state. Operations include create page, set layout, insert section, update content/presentation/meta, move, and remove placement.

- [ ] Test `operations_are_atomic`, `layout_change_preserves_unsupported_region_content`, `duplicate_placement_keeps_binding`, `duplicate_content_allocates_new_section_and_item_ids`, `undo_redo_restores_one_preset_transaction`, and `selected_deleted_placement_moves_focus_predictably`.
- [ ] Validate the complete result before emitting one draft change. Remove content only through an explicit content action; removing a placement must not delete content used elsewhere. Block deleting a source that still has references unless affected placements are reviewed together.
- [ ] Keep selection/viewport mode out of persisted profile data. Reuse existing draft storage, recovery, and history where compatible; avoid a parallel autosave service. Coalesce text edits; retain at most 30 history entries and a 5MB serialized history budget.
- [ ] Add stale-base checks for preset/import/AI apply and preserve recovery after save errors. Commit `feat(pages): add validated draft operations and history`.

### Task 8 — Build real presets and the shared page/section picker

**Files:** New config `pages/presets.ts`, lib `services/page/presets.ts`, UI `page-builder/{page-preset-picker,page-section-picker}.tsx`; existing live preview/gallery integration.

**Interfaces:** `PagePresetDefinition` contains stable ID, purpose, layout, required variants, section starters and version. `applyPagePreset(profile, presetId, mode, newId)` returns a validated draft plus warnings; mode is `preserve-content | new-page`. A preset is available only when all required renderers exist.

- [ ] Start with Classic, Consultant, Studio split, Cinematic, One-screen CTA, and Visual work. Add the richer presets in Task 10. The preset preview must use PortfolioPageRenderer and fictional fixtures.
- [ ] Test `presets_produce_distinct_layouts`, `preserve_content_mode_keeps_facts_privacy_and_cv`, `blank_has_no_demo_facts`, `browse_does_not_change_draft`, and `add_from_gallery_inserts_exactly_once_at_requested_position`.
- [ ] Use the current section metadata to expose all available families; keep view-only preview adapters explicit. Inline variant controls are vertical and show real structural differences.
- [ ] Reuse the shared lightbox for focused previews; mount only the active large preview. Disable external form/video/provider actions in catalog mode. A real Add action includes insertion position and does not submit the surrounding create form.
- [ ] Commit `feat(pages): add real layout presets and section selection`.

### Task 9 — Integrate creation, editing, saving, and publication

**Files:** New app `views/page-builder/page-builder-workspace.tsx`; UI outline/inspector/toolbar; existing setup/profile editor/preview compositions; new `apps/my-dev-studio/e2e/edit/page-builder.spec.ts` and manual guide.

**Interfaces:** `PageBuilderWorkspace({profile, onChange, preview, assistant, busy, error})` composes portable UI and app bindings. Keep existing create/save callbacks and repository revision contract. Do not move transport into UI components.

- [ ] Creation offers preset or blank and preserves/imports canonical CV/profile content. Show assistant entry as unavailable until Task 14 ships, with useful manual creation always available.
- [ ] Replace profession-as-layout selection with a real layout picker. Profession remains an optional content recommendation. For existing portfolios, provide an explicit upgrade preview and local conversion action.
- [ ] Use one outline and one selected-section inspector. Offer content/design tabs and vertical variant choices. Existing content editors update canonical data. Send old builder ordering/display destinations to the relevant page inspector.
- [ ] Use the existing responsive iframe to preview actual page widths. Creation is a wide desktop workspace and fullscreen mobile dialog with reachable actions. Keep browsing selection independent from draft mutation.
- [ ] Test complete preset/blank → add/reorder/edit → save → reload → publish → public view; no-site legacy; cancel/discard/recovery; failed save; conflicting revision; keyboard dialog closure/focus return; and zero create/publish requests while browsing.
- [ ] Run the milestone A gate below and update manual documentation/inventory. Commit `feat(studio): integrate page creation and editing workspace`.

## Milestone B — Rich page content, complete variants, routes, and reuse

### Task 10 — Build meaningful section variants and rich content presets

**Files:** Existing About/Hero/Blog/Careers/Contact/Pricing/Plans/FAQ/Features/Services/Gallery/Testimonial/Newsletter folders, authorable metadata, section schemas; new config `sections/section-data.ts`, matching validation; preset registry.

**Interfaces:** Add optional `CustomSection.data: SectionData`, a discriminated JSON union for posts, pricing, careers, and catalog data. Schema ties data kind to section type. New data is authoritative when present; old items remain the legacy fallback and are not kept as a second editable copy. Variant descriptors stay type-compatible and include default, label, supported content, and fixture/story reference.

- [ ] Add tests for legacy rendering, per-family data compatibility, preservation on variant change, zero-price plans, long/missing content, keyboard filters, comparison switching, and round-trip serialization. Keep existing section limits and total document budget.
- [ ] Implement About's quiet profile/media story/manifesto/sticky-support variants; Blog's index/featured magazine/sidebar/archive and article presentation; Careers' list/filterable roles/details-with-aside; Contact's minimal/details/inquiry/booking; Pricing's cards/comparison/bundles/mobile selector. Use the spec's Once UI references for actual composition checks.
- [ ] Define post/product/job destinations as validated external links or site page references. Article bodies use escaped structured text. Pricing amounts/billing intervals are explicit; do not infer discounts. Contact/newsletter retain current honest link/email behavior unless a delivery adapter is configured.
- [ ] Add Founder story, Journal, Magazine, Services, Makers catalog, and Hiring presets once their variants pass review. Prevent unavailable preset selection.
- [ ] Review every other family for spacing and supported structural variation. Add a useful second variant where content warrants it, and record when the existing single structure is appropriate. Never count a recolor as a new composition.
- [ ] Every exposed variant has editor controls, a real example, colocated story, and import/export coverage. Commit by family; update inventory after review.

### Task 11 — Add multiple pages and working navigation

**Files:** New app `app/[username]/pages/[slug]/page.tsx`, `views/published/site-page.tsx`, `services/portfolio/get-site-page.ts`; page outline/picker and internal link editor; current public root route and snapshot services.

**Interfaces:** `getPublishedSitePage(username, slug)` resolves through existing authorized publication access and returns an already projected profile/page. Homepage stays `/{username}`; other pages use `/{username}/pages/{slug}`. Page references use IDs so renaming a slug updates internal links deterministically.

- [ ] Test duplicate slugs, missing/home-page IDs, unpublished/unknown pages, password/unlisted site access, managed-owner editing, cross-owner requests, and navigation pruning. Reuse publication access checks rather than inventing a public page-document endpoint.
- [ ] Enable up to 12 pages once document-size and storage boundary tests pass. Add/duplicate/rename/remove pages with explicit link-impact review. Home cannot be removed until another page is assigned.
- [ ] A page's `published` flag takes effect only on explicit site publication; saving a draft never exposes it. Site publication is one revision-consistent snapshot. Strip unpublished pages before public validation/rendering, including secondary link destinations.
- [ ] Reconcile storage/RPC/schema allowlists if they constrain profile fields. Any required migration is a separate reviewed deliverable; do not run a production migration during implementation.
- [ ] Commit `feat(pages): support published site pages and navigation`.

### Task 12 — Add editorial, business, and catalog behavior and SEO

**Files:** Rich family editors/renderers; new shared `sections/page-renderer/page-metadata.ts` only for portable metadata descriptions; app metadata binding in `services/portfolio`, public page metadata and sitemap handlers; publication tests.

**Interfaces:** `buildPageMetadata(publishedProfile, page, baseUrl)` returns portable metadata values. The Next.js adapter owns Metadata/response generation. Typed per-family actions consume real URLs/capabilities.

- [ ] Blog filters, featured articles, topic navigation, author/date/readability, related content, and article page links work with authored data. No placeholder article links in published output.
- [ ] Careers filters and application links, contact/email/booking actions, pricing comparison/billing selection, product category filters and detail/inquiry destinations have designed empty/error states. No simulated checkout, subscription, or message delivery.
- [ ] Add canonical URLs, per-page title/description/social image, publication-aware sitemap entries, and appropriate structured data only when facts exist. Escape JSON-LD safely and use published projections only. Never expose passwords/private fields in metadata or thumbnails.
- [ ] Test social metadata and source HTML for private/unpublished content, invalid URLs, missing media, zero prices, and script-like authored text. Add keyboard and reduced-motion checks for interactive variants.
- [ ] Commit `feat(pages): complete content behavior and page metadata`.

### Task 13 — Import/export reusable page compositions

**Files:** New lib page template schema and `services/page/{pageforge-import,templates}.ts`; existing `services/portfolio/pageforge-import.ts` and section template helpers; page builder import/export controls.

**Interfaces:** `PageTemplateFile` has `format: "mydevstudio.pages"`, `version: 1`, `name`, `includesContent`, site composition, and referenced custom sections. `importPageForgePage(input, newId, assetBase?)` returns `{document, warnings}`. `applyPageTemplate(profile, file, mode, newId)` applies append/replace as one validated draft transaction.

- [ ] Test that header/hero/main/aside/footer survive PageForge conversion; section-only imports retain version 1 behavior. Reject unknown formats/types, executable CSS/JS/React, unsafe URLs, duplicate entity IDs, dangling references, and oversized payloads. Allow repeated placements of one source and verify unique render IDs.
- [ ] Reuse current block-to-section conversion. Preserve regions/layout where support exists; show warnings and a preview for adaptations. Do not silently flatten a sidebar into main without disclosing it.
- [ ] Configuration-only export removes authored body/media/contact/source bindings and SEO copy, retaining generic profile-intro/contact/built-in slots. Include-content adds custom-section authored data only; it never exports or overwrites canonical profile/CV facts. Rebind profile-source fields to the destination with item selections cleared and a review warning. Cross-profile round-trip tests must retain destination facts, contain no source contact/career values, preserve shared content references, and use fresh entity IDs. Remap links and prove configuration-only output contains no authored/fixture values.
- [ ] Browse/review has no draft effect; replace shows the affected pages and needs explicit confirmation. Recheck base fingerprint before apply. Existing saved section templates remain separate and usable.
- [ ] Start with local versioned page files, avoiding a new template-storage database in this milestone. Commit `feat(pages): import and export reviewed page compositions`.

## Milestone C — Real assistant page creation and editing

### Task 14 — Extend assistant proposals with validated page operations

**Files:** Existing assistant task/proposal schemas and models/provider integration; new `models/page-proposal.ts`; lib operations and request binding; existing assistant review UI.

**Interfaces:** `PageProposal` contains request ID, base revision, base draft fingerprint, summary, typed PageOperation groups and missing-information notes. `proposePage({draft, targetPageId?, prompt, capabilities}, signal)` returns a proposal without writing. `applyPageProposal(profile, proposal, selectedGroupIds)` validates dependencies and returns one undoable draft result.

- [ ] Feed only supported layout/variant IDs, bounded current content, page purpose, selected target, and configured capabilities. Reuse the current provider/model configuration and existing authorization/rate-limit/cancellation boundaries.
- [ ] Add contract tests for malformed/unknown variants, dependency-safe selected groups, oversized output, invented unsupported actions, stale revision/fingerprint, private project visibility, duplicate request IDs, and cancellation/timeout. No partial mutation or publishing on any failure.
- [ ] Resolve temporary IDs within proposal groups before applying. Removing/changing content displays shared-use impact. Group a proposed page so deselecting its creation cannot leave dangling insert operations.
- [ ] Add a preview/review flow showing layout, section outline, missing facts, and before/after. Apply locally, then allow normal save; publish remains explicit. Unconfigured AI falls back to preset/blank creation without fake generation.
- [ ] Test natural-language creation of a sticky consultant page, a one-CTA video page, and a magazine page; test a targeted existing-page edit preserves unrelated content and CV choices. Use mocked provider contracts and fixture e2e, never production accounts.
- [ ] Commit `feat(assistant): propose and review page compositions`.

## Final release and continuation

### Task 15 — Verify the full page system and document the handoff

**Files:** New/extended page-builder e2e suites, section/layout inventory, manual guide/index, section system/template docs, product feature docs, affected generated catalogs.

- [ ] Test preset, blank, assistant, legacy conversion, and import creation paths. Follow each through section editing, reordering, layout switching, save/reload, conflict handling, publication, and public navigation.
- [ ] Review each registered section and variant in Storybook, and mixed compositions in creation/editor/public views. Primary Sand light/dark; sample Cyan. Cover 320/390/768/1024/1440px, all densities, keyboard states, 200% zoom, reduced motion, long/localized copy, disabled/selected/open/error states, and missing/broken media.
- [ ] Compare the six layout silhouettes side by side using the same facts. Confirm the one-screen CTA has no unwanted résumé sections, the split pane actually scrolls correctly, and token spacing is consistent across unrelated adjacent sections.
- [ ] Check lazy mounting of gallery previews, route/section splitting, no unnecessary remote media/provider loads, and no eager whole-catalog hydration. Fix measured regressions without weakening accessibility.
- [ ] Run the final gate. List real results and blocked checks. Update manual instructions and inventory; regenerate catalogs and verify exports/architecture. Keep implementation PRs unmerged until verified and user review is complete.

### Gates and commands

Run from the selected repository with its pinned Node/pnpm versions. New test filenames above are deliverables, not claims that tests already exist or pass.

```sh
# Focused unit checks after the owning tasks
pnpm exec vitest run --project unit section-frame
pnpm exec vitest run --project unit packages/lib/src/schemas/page
pnpm exec vitest run --project unit packages/lib/src/services/page
pnpm exec vitest run --project unit page-renderer page-builder

# Spacing/layout/browser checks once their fixtures exist
pnpm --filter my-dev-studio exec playwright test e2e/portfolio/section-spacing.spec.ts
pnpm --filter my-dev-studio exec playwright test e2e/edit/page-builder.spec.ts

# Milestone A, B, C and final integration gates
pnpm generate:catalogs
pnpm check:exports
pnpm check:architecture
pnpm check
pnpm test
pnpm --filter storybook-app build-storybook
pnpm --filter my-dev-studio build
pnpm test:e2e:studio
```

Full browser runs can use the repository's existing fixture setup. Inspect current Playwright configuration and startup requirements before running. Do not install a second browser harness or use production services. Run focused checks for intermediate commits; rerun the full gate when integrating milestones or when a shared change invalidates previous results.

### Suggested PR boundaries

1. Token alignment and section framing, Tasks 1–3. Review by section family, with no new page feature required.
2. Portfolio page builder, Tasks 4–9. One complete creation/editing/publication flow.
3. Rich variants, pages, content behavior and imports, Tasks 10–13. Split family batches if the diff becomes difficult to review.
4. Assistant composition, Task 14, followed by Task 15 verification.

The user requested a plan in this turn. Do not open these PRs or start product implementation until the plan is reviewed. When implementation is authorized, refresh main first and keep progress commits in the relevant PR.

### Handoff checklist

- [ ] Plan/design reviewed; execution scope confirmed.
- [ ] Each completed task records its commit and focused check result in this document.
- [ ] Every checked section/variant is marked in the inventory; remaining work is explicit.
- [ ] Outstanding custom CSS has a concrete reason and no parallel token scale was introduced.
- [ ] Each milestone is usable independently; later tasks are not advertised as shipped.
- [ ] Final report includes verification results, unresolved blockers, and PR state.
