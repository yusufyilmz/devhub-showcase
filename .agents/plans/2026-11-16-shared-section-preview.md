# Shared Section Preview Implementation Plan

> **For agentic workers:** Use Superpowers `executing-plans` to implement this plan task by task. Track progress with the checkboxes.

**Goal** — Move reusable portfolio section components into `packages/ui/src/sections`, polish them using Once UI Blocks, and share a complete live section preview across home, portfolio creation, and portfolio editing.

**Architecture** — `@shared/config` remains the source of section IDs and persisted shapes. `@shared/ui/sections` owns portable renderers, editors, and a registry-driven preview. The app and assistant retain composition, authorization, transport, and persistence. Each consumer owns its selected section and supplies draft or example data to the shared preview.

**Tech stack** — React, Next.js, TypeScript, Tailwind, shared theme tokens, Vitest, Storybook, and Playwright.

**Spec** — The scope and acceptance criteria below capture the requested migration and integrations. The primary visual reference is the [Once UI Blocks dashboard](https://once-ui.com/dashboard/blocks). It redirected to the public home page during planning. Use the [public Blocks catalog](https://docs.once-ui.com/blocks/quickStart) for the matching families and check the dashboard again during visual review.

## Global constraints

- Base implementation on freshly fetched GitHub main. This plan was checked against `88ec8a7c`.
- Move the reusable section implementations and their supporting presentation code to `packages/ui/src/sections`. Keep homepage and CV flows and persistence adapters with their owners. Rewrite callers to the new owner and update the repository's ownership guidance and generated catalogs in the migration commit.
- Preserve section IDs, renderer variants, ordering, visibility, import/export, localization, and existing public portfolio and CV behavior. Keep `@shared/ui` independent of `@shared/assistant`, runtime requests, and app-specific code.
- Preview interactions are local. Use fictional fixtures for browse mode and render provider-backed actions with inert preview equivalents. A preview selection must never submit a form, add a section, or publish a portfolio by itself.
- Prefer Tailwind and shared theme tokens where they express the intent cleanly. Keep custom CSS where it serves a concrete purpose.
- Review each component in Storybook. Verify representative light, dark, narrow viewport, keyboard, and applicable hover, focus, disabled, selected, open, and error states. Run focused tests where behavior could regress and record any check that could not run. Start with Sand and sample a second palette.
- Run focused checks for each task and the full relevant gate before the implementation PR.

## Files and responsibilities

| Area                                  | Current source                                                                                                                                                                                | Target                                                                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Section implementations and rendering | `packages/assistant/src/components/sections/`, including `renderers/`, `section-presentation/`, and the portable editor helpers                                                               | `packages/ui/src/sections/` with shallow `@shared/ui/sections` exports                                                 |
| Available types and metadata          | `packages/config/src/sections/authorable-sections.ts`, `packages/config/src/sections/section-registry.ts`, UI registry                                                                        | Keep metadata ownership. Derive preview coverage from these sources and inventory view-only sections separately.       |
| Homepage                              | `packages/assistant/src/components/sections/home-section/{library,library-picker,section-catalog,section-catalog-preview}.tsx`                                                                | Home owns composition and uses shared previews. UI owns the live preview, examples, and portable catalog UI.           |
| Creation                              | `apps/my-dev-studio/app/admin/portfolios/page.tsx`, `apps/my-dev-studio/features/management/create-portfolio.tsx`, `packages/assistant/src/components/studio/management/create-portfolio.tsx` | The checked baseline uses an inline form. Host it and the preview inside the shared Dialog on this create entry point. |
| Editing                               | `apps/my-dev-studio/app/[username]/edit/page.tsx`, `packages/assistant/src/components/studio/workspace/profile-editor.tsx`, current `sections/studio/custom-sections-editor.tsx`              | Add the shared preview to Content / Custom sections. Keep the existing full draft preview and save flow.               |

## Review focus

- Registry and implementation coverage can drift. Compare fixture keys to all authorable IDs and explicitly cover view-only sections.
- Older drafts may lack optional section fields. Render them using the current defaults and preserve saved IDs and ordering.
- Preview cards for contact, newsletter, maps, and video must render without requests or real visitor data.
- With narrow screens, keyboard access, or a validation error, the creation dialog must keep the form usable and re-focus its trigger on dismissal.
- An editor can browse a starter while a different draft section is selected. Browsing must leave the draft alone, and editing the selected section must update its preview.

## Task 1 — Verify the merged section migration

The package move is present on main at `4a4eb3ff`. Use the migrated implementations in `packages/ui/src/sections` and carry the existing rendering tests forward.

**Files** — Move component folders and portable helpers from `packages/assistant/src/components/sections/` to `packages/ui/src/sections/`. Add `packages/ui/src/sections/index.ts` and update the UI and assistant export maps, affected callers, ownership documentation, and both package catalogs.

**Interface** — Export `RenderSection(props: SectionProps)`, the portable section components and editors, and their existing prop types from `@shared/ui/sections`. Preserve `SectionProps` and the current renderer lookup rules.

- [ ] Build a move checklist from the assistant barrel, renderer map, studio and default portfolio views, stories, and imports. Include view-only components such as About Me, Experience, Education, Summary, and CV-facing presentation where portable. Keep route, personalized home assembly, and PDF rendering with their owners.
- [ ] Pin parity with the existing `section-library.test.tsx` and `portfolio-ui.test.tsx` suites. Add `renders a legacy section without optional fields` with a legacy object missing `sectionType` and `composition`, asserting the same title and fallback view before and after the move.
- [x] Move implementation, stories, and tests together. Replace upward imports with shared config or injected callbacks. Update `@shared/assistant/sections`, `@shared/assistant/sections/studio`, and `@shared/assistant/careers-section` callers where ownership changes. Leave assistant entry points only for retained compositions.
- [ ] Run `pnpm generate:catalogs`, `pnpm check:exports`, `pnpm check:architecture`, and `pnpm exec vitest run --project unit section-library portfolio-ui`. Confirm redirection to the new owner in imports and unchanged portfolio output. Commit the migration.

## Task 2 — Polish every section component

**Primary visual reference** — [Once UI Blocks dashboard](https://once-ui.com/dashboard/blocks). Compare every component under `packages/ui/src/sections` with the closest block. If the dashboard redirects, use the [public Once UI Blocks catalog](https://docs.once-ui.com/blocks/quickStart) and record the fallback.

**Files** — Individual implementations, styles, and stories in `packages/ui/src/sections/`.

**Interface** — Use Task 1 exports and keep all section props and renderer options compatible.

- [ ] Review each checklist entry against the closest Blocks family. Use Hero and About for page intros, Features/Bento for card grids, Plans/Pricing for comparative cards, and FAQ/Newsletter/Testimonial/Contact/Blog for the matching sections. Use the closest About, Careers, Dashboard, or Social example for portfolio, work, and embed sections.
- [ ] Apply a clear type hierarchy, restrained one-pixel token borders, consistent padding, responsive grids, and visible focus. Keep controls and headings readable at 320px and avoid clipping long titles or links. Preserve reduced-motion support and existing interactions.
- [ ] Capture before/after Storybook views by family. Check Sand light/dark, a second palette, 320px and desktop, and keyboard states for tabs, accordions, forms, and media. Confirm distinctive layouts and variants still read clearly. Commit in reviewable family batches.

**Task 2 progress** — Hero, FAQ, Accordion, and Features have had an initial Storybook pass in Sand light, Sand dark at 320px, and Cyan light. The remaining section families and variant review are open.

## Task 3 — Build the shared Live Section Preview and wire home

**Files** — Create `packages/ui/src/sections/live-section-preview/{live-section-preview,preview-examples,live-section-preview.test,live-section-preview.stories}` with `.tsx` for JSX and `.ts` for plain data. Move portable picker and catalog code from the home section. Modify `home-section/library.tsx` to use the shared UI.

**Interface** — Export `LiveSectionPreview({ exampleId, section, language, anchors }: LiveSectionPreviewProps)` from `@shared/ui/sections`. `exampleId` is a registry-derived authorable ID or an explicitly listed view-only example ID. `section?: CustomSection` allows a caller to supply real draft data. `language` and `anchors` use `SectionProps` types. Export the shared example descriptors for the preview selector and catalog.

- [ ] Add `provides a renderable example for each section`. Compare authorable example IDs to `authorableSectionTypes` and assert all inventoried view-only IDs render. Add `uses supplied draft content` and `does not call providers in preview mode`.
- [ ] Give each authorable example a typed fictional fixture via `Record<AuthorableSectionType, CustomSection>` and use `RenderSection` in preview mode. Give view-only examples explicit render adapters. Keep the home library's search and categories and use one metadata source for its counts and filters.
- [ ] Replace the homepage's limited sample list and catalog-only illustrations with the shared preview and selector. Render the selected live example on demand so browsing the list does not mount every section or embed.
- [ ] Run `pnpm exec vitest run --project unit live-section-preview library-picker section-catalog`. Confirm every entry can be selected on home and keyboard and mobile selection work. Commit.

## Task 4 — Integrate portfolio creation

**Files** — Creation entry point and form from the files table, plus a colocated form or dialog test.

**Interface** — Reuse `LiveSectionPreview` with local selection. Keep `CreatePortfolio({ onCreated }: { onCreated: (id: string) => void })` and the current managed-portfolio request contract.

- [ ] Add a test that opens the create dialog, selects a preview, verifies zero create requests, submits valid input once, and verifies the existing success callback. Assert a failed request keeps the dialog, entered values, and error visible.
- [ ] Compose the existing create form and live browser in the shared Dialog. Keep preview buttons out of the submit path. Use a single scroll region with visible form actions on mobile, and verify Escape and focus return after close. Preserve JSON import and the account's existing privacy and save rules.
- [ ] Run the focused creation tests and smoke-test `/admin/portfolios` with a disposable authorized account. Commit.

## Task 5 — Integrate portfolio editing and finish verification

**Files** — `profile-editor.tsx`, the Custom Sections editor and colocated tests, `apps/my-dev-studio/e2e/edit/section-library.spec.ts`, and `docs/testing/manual/` guide and index.

**Interface** — Browsing uses `exampleId`. The existing per-section details preview passes the current section resolved with `resolveSectionSource`, plus language and anchors. Draft mutations stay in the existing editor handlers.

- [ ] Test that browsing a starter leaves the draft and sequence unchanged, adding creates exactly the chosen type, and editing or selecting an existing section updates the live preview. Keep a test for older drafts with missing optional data.
- [ ] Integrate the shared preview in Content / Custom sections for both library browsing and resolved draft rendering. Preserve explicit Add, delete, duplicate, save, the section limit, and the existing full portfolio preview.
- [ ] Run focused unit tests and the editor and public portfolio section-library browser specs. Check home, the create dialog, and `/[username]/edit` in light and dark on desktop and mobile. Verify create/import, add/edit/save/reload, unpublished and published viewing as applicable, and keyboard dismissal. Use disposable fixtures.
- [ ] Update the manual guide and index with exact routes, actions, expected results, and observed evidence. Run `pnpm check`, `pnpm test`, `pnpm --filter storybook-app build-storybook`, and `pnpm --filter my-dev-studio build`. Record blocked checks by name. Commit and open the implementation PR from current main.

## Acceptance criteria

The reusable implementations and preview are owned by the UI package, and the dependency graph stays acyclic. Each inventoried section has a rendered example in the shared live browser, with a Once UI Blocks comparison for each family. Home, create, and edit use the same preview. Existing portfolio operations and rendering remain covered by tests and the three integrations have been checked in a browser.
