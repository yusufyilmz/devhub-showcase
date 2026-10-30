# Section system: foundation

The section system includes a shared registry, reusable views and validated display settings in the profile editor. Existing documents keep their original layout defaults. No database migration or new dependency is required. Custom sections can be authored, previewed and placed between the built-in sections.

## Architecture decision

Keep MyDevStudio as the application and adapt useful PageForge building blocks incrementally. The PageForge source review covered its PageBuilder, ContentBlock and ContentSection types, SectionSettings, explicit and automatic registries, UniversalPage/UniversalSections, custom section factory and representative section components.

PageForge provides useful composition and settings concepts, but has overlapping rendering paths, inconsistent section names between registries and types, and a Once UI styling dependency. The current app already has portfolio ownership, managed profiles, CV generation, language/theme preferences and browser coverage. Moving those flows into PageForge would expand the migration substantially.

This foundation introduces the composition concepts without copying PageForge implementations or adding its UI/runtime dependencies.

## Shared model and boundaries

The registry and JSON model live in @shared/content. The shared validator is exported from @shared/lib/section. The React renderer dispatcher remains in the portfolio app; shared content does not import React, Next.js, authentication or database clients. Reusable visual renderers can move into @shared/components in the next step.

A normalized section contains:

- id: stable section identity used for ordering.
- kind: semantic purpose, such as experience or projects.
- renderer: an explicit identifier for an existing presentation.
- source: a typed reference to the canonical profile field.
- settings: the normalized visibility setting, derived from the saved visibility preference.

For example, the experience section defaults to the timeline renderer in Engineer and reads the experiences profile field. Its content is not copied into a second document. The schema rejects an experience renderer assigned to About, a mismatched source, unknown kinds, unregistered renderers and extra settings.

## Existing defaults

| Section    | Profile source | Engineer           | Designer        | Consultant / Minimal |
| ---------- | -------------- | ------------------ | --------------- | -------------------- |
| About      | about          | about-card         | prose           | prose                |
| Experience | experiences    | timeline           | experience-list | experience-list      |
| Projects   | projects       | project-cards      | project-gallery | project-list         |
| Skills     | skills         | skill-groups       | skill-list      | skill-list           |
| Education  | education      | education-timeline | education-list  | education-list       |
| Languages  | languages      | language-list      | language-list   | language-list        |

Layout default retains the existing implementation. Explicit selections use the shared content adapter and renderer views across all four layouts.

## Compatibility and rendering

getPortfolioSections derives independent section instances from the saved portfolio type and sectionOrder. Legacy profiles without a type use Engineer defaults. Designer keeps work first; the other layouts keep About first. Explicit saved order takes precedence. The adapter never changes the saved profile or persists normalized instances.

RegisteredSections selects the explicit server-rendered implementation by renderer identifier and retains stable Fragment keys. It adds no DOM wrappers, so existing styling, anchors and layout selectors stay intact. Missing implementations fail visibly during development/testing instead of silently dropping content. The original section components retain their empty-state rules and About summary fallback.

Public project filtering stays in the existing server rendering/resource adapters. The registry contains only static presentation metadata and field references, not personal content. Header/introduction, contact, testimonials, chat and footer retain their current placement. CV generation continues to read the canonical profile through the existing renderer.

## Next steps

The section library and template/import stages are implemented. See [the source migration map](pageforge-section-migration.md) and [private templates](section-templates.md) for the current contracts.

Each step includes compatibility and browser checks before its new options are exposed. Persisted configuration, custom IDs and PDF inclusion choices are deliberately introduced with their corresponding editor features rather than accepted as unused profile fields now.

## Shared view primitives (step two)

The section-views entrypoint in @shared/components provides SectionGrid (cards or gallery), SectionAccordion, SectionTabs and SectionCarousel. Each takes a label and stable, uniquely identified items with a title and React content. The existing @shared/components timeline and cards remain available; they are not duplicated.

Tabs support arrow keys, Home and End. Accordions use native details/summary. Carousels use scroll snap, swipe and manual controls without autoplay; arrow movement respects reduced motion and accepts localized control labels. These primitives contain no authentication, fetching or portfolio data access. Callers must supply only authorized content.

## Saved section settings (step three)

The Section display editor saves optional sectionSettings in the existing profile JSON document. Each built-in section accepts a compatible renderer, visible flag and optional itemIds. The save and import validator rejects unknown keys, incompatible renderers, duplicate item IDs and arbitrary executable settings. Sources remain fixed to the canonical profile fields.

Omitting renderer uses the layout default. Omitting itemIds includes all items, including future additions; an empty array includes none. Project, experience, education and language selections use stable record IDs. Skills use the existing group names, so renaming a selected group requires selecting its new name. About uses its authored paragraphs and summary fallback rather than selectable paragraph indexes. Deleted IDs are ignored and never substituted for other content.

ConfiguredSection adapts profile content to shared cards, gallery, carousel, accordion, tabs, timeline or list views. Headings and dates use the portfolio language. Private projects stay excluded even if their IDs appear in a selection. Empty sections are omitted. Hidden sections are omitted from the section dispatcher and their navigation links.

The editor provides a current-draft preview for explicitly selected views, per-section reset and the existing save/discard controls. Settings use the normal revision-checked save/read path for owned and managed portfolios. PDF rendering reads the complete canonical profile and keeps its own inclusion settings. No production data is modified by this change.

## Custom sections (step four)

The Custom sections editor creates named portfolio sections with list as the default view. Cards, accordion, tabs and carousel reuse @shared/components. Each section has visibility and an ordered collection of titled plain-text items with optional HTTP or HTTPS links. HTML and executable component configuration are not accepted. Text is escaped by React; draft previews also omit unsafe links.

Custom section IDs use a custom- prefix and a UUID. Item IDs are UUIDs. Duplicating creates independent section and item IDs while retaining content and display choices. Removing a section also removes its ordering reference. Normal save, discard, revision checks, portfolio ownership and managed editing apply.

A new optional sectionSequence lists built-in and custom IDs together. The validator requires every existing section exactly once and rejects unknown, missing or duplicate references. The existing sectionOrder field keeps its six-section contract, so old documents and imports retain their defaults. Without a mixed sequence, built-in sections use their existing order and custom sections follow in creation order. Reset restores that ordering.

The existing accessible drag handles, keyboard shortcuts and move buttons now order all sections together. Empty and hidden custom sections are omitted publicly. Section names are authored content and stay as entered when the portfolio language changes. Custom sections are portfolio-only in this step; PDF content retains its established document layout and inclusion settings.

Limits are 60 custom sections, 30 items per section, 160 characters per section name, 200 per item title and 6000 per item body. Validation and storage use the existing profile document; no migration, dependency or production data edit is needed.

## Compositions, hero and social work (step five)

See [the roadmap](roadmap.md) and [repository guidance](../AGENTS.md). sectionCompositions defines authorable starters for services, testimonials, FAQs, statistics, calls to action and curated social work. A starter chooses a title and default view without inventing content. All use the same custom section IDs, collections, visibility, previews, mixed order and profile save boundaries. Legacy sections without composition remain generic custom sections.

YouTube, Instagram and Pinterest sections require public work URLs matching the selected provider. getSocialWork checks exact HTTPS hosts and supported video/post/pin paths. Optional image URLs and captions provide visual work cards. YouTube player URLs are constructed from validated video IDs and use youtube-nocookie.com. WorkMedia mounts the iframe only on a visitor's load action and supports unloading; there are no automatic thumbnails, third-party scripts or server-side social fetches. Instagram and Pinterest cards link to their originals. Automatic feeds and native Instagram/Pinterest embeds are separate future integrations.

The optional profile.hero stores image/video URL, poster, position and overlay. HeroSurface wraps existing introductory content only when configured, preserving legacy markup otherwise. Video is muted and looping, offers play/pause, pauses under reduced motion and falls back to the optional poster when not playing. Public controls use the portfolio language. Appearance contains the editor and preview. Uploaded media storage and automatic transcoding are not part of this step; authors provide direct media URLs.

References for YouTube behavior: [official embed guidance](https://support.google.com/youtube/answer/171780), [player parameters](https://developers.google.com/youtube/player_parameters). No PageForge or original portfolio implementation code/assets are copied by this feature.

## Complete library and templates (step six)

All 42 PageForge section families now have explicit renderer/editor folders in @shared/sections, alongside native custom/services/social sections. New sectionType and compatible options/source fields extend custom sections without changing legacy instances. The source mapping and integration boundaries are listed in docs/pageforge-section-migration.md.

Templates are versioned JSON and are saved separately to an account-private library with owner RLS and optimistic revisions. Export defaults to configuration only. Native and compatible PageForge imports are reviewed before applying fresh section/item IDs to a draft; identity, sharing and CV content remain independent. Profile-source bindings are resolved from the current canonical document and public project filtering applies independently of the built-in project section selection.
