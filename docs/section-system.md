# Section system: foundation

The section system includes a shared registry, reusable views and validated display settings in the profile editor. Existing documents keep their original layout defaults. No database migration or new dependency is required. Custom sections remain the next step.

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

1. Add stable custom section instances with create, duplicate, remove and reorder controls.
2. Port additional useful compositions, then introduce template/import/export support.

Each step includes compatibility and browser checks before its new options are exposed. Persisted configuration, custom IDs and PDF inclusion choices are deliberately introduced with their corresponding editor features rather than accepted as unused profile fields now.

## Shared view primitives (step two)

The section-views entrypoint in @shared/components provides SectionGrid (cards or gallery), SectionAccordion, SectionTabs and SectionCarousel. Each takes a label and stable, uniquely identified items with a title and React content. The existing @shared/components timeline and cards remain available; they are not duplicated.

Tabs support arrow keys, Home and End. Accordions use native details/summary. Carousels use scroll snap, swipe and manual controls without autoplay; arrow movement respects reduced motion and accepts localized control labels. These primitives contain no authentication, fetching or portfolio data access. Callers must supply only authorized content.

## Saved section settings (step three)

The Section display editor saves optional sectionSettings in the existing profile JSON document. Each built-in section accepts a compatible renderer, visible flag and optional itemIds. The save and import validator rejects unknown keys, incompatible renderers, duplicate item IDs and arbitrary executable settings. Sources remain fixed to the canonical profile fields.

Omitting renderer uses the layout default. Omitting itemIds includes all items, including future additions; an empty array includes none. Project, experience, education and language selections use stable record IDs. Skills use the existing group names, so renaming a selected group requires selecting its new name. About uses its authored paragraphs and summary fallback rather than selectable paragraph indexes. Deleted IDs are ignored and never substituted for other content.

ConfiguredSection adapts profile content to shared cards, gallery, carousel, accordion, tabs, timeline or list views. Headings and dates use the portfolio language. Private projects stay excluded even if their IDs appear in a selection. Empty sections are omitted. Hidden sections are omitted from the section dispatcher and their navigation links.

The editor provides a current-draft preview for explicitly selected views, per-section reset and the existing save/discard controls. Settings use the normal revision-checked save/read path for owned and managed portfolios. PDF rendering reads the complete canonical profile and keeps its own inclusion settings. No production data is modified by this change.
