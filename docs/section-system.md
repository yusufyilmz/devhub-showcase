# Section system: foundation

This first step establishes a shared section model, a registry of existing renderers and a compatibility adapter. It does not add editor controls, custom sections or new visual variants. Profile documents and the existing save/import APIs retain their current contract. No database migration or new dependency is required.

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
- settings: the normalized visibility setting, currently true for every built-in section.

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

Renderer identifiers describe the existing implementations. They are not yet selectable across every layout. A future choice is exposed only after its implementation and content adapter are available in that context.

## Compatibility and rendering

getPortfolioSections derives independent section instances from the saved portfolio type and sectionOrder. Legacy profiles without a type use Engineer defaults. Designer keeps work first; the other layouts keep About first. Explicit saved order takes precedence. The adapter never changes the saved profile or persists normalized instances.

RegisteredSections selects the explicit server-rendered implementation by renderer identifier and retains stable Fragment keys. It adds no DOM wrappers, so existing styling, anchors and layout selectors stay intact. Missing implementations fail visibly during development/testing instead of silently dropping content. The original section components retain their empty-state rules and About summary fallback.

Public project filtering stays in the existing server rendering/resource adapters. The registry contains only static presentation metadata and field references, not personal content. Header/introduction, contact, testimonials, chat and footer retain their current placement. CV generation continues to read the canonical profile through the existing renderer.

## Next steps

1. Extract reusable renderers and add carousel, cards, gallery, accordion and tabs where they fit the content.
2. Add validated per-section editor choices, element selection and previews.
3. Add stable custom section instances with create, duplicate, remove and reorder controls.
4. Port additional useful compositions, then introduce template/import/export support.

Each step includes compatibility and browser checks before its new options are exposed. Persisted configuration, custom IDs and PDF inclusion choices are deliberately introduced with their corresponding editor features rather than accepted as unused profile fields now.
