# Section layout inventory

Status: Task 1 inventory on main `3a5b2c17`. Rows stay `not aligned` and `not reviewed` until a later task inspects that family. The shared frame is the only new spacing owner. Existing fixed CSS is recorded here and was not deleted.

Spacing owner for new compositions: `SectionFrame` in `packages/ui/src/sections/section/section-frame.tsx`. Composed and standalone frames use `my-0`. The page stack owns the gap between contained sections (`gap-2xl`, `gap-3xl` from 64rem). The frame owns the heading-to-content gap (`gap-lg`, `gap-xl` from 64rem). Bleed bands that are not cards own internal padding (`--spacing-2xl` / `--spacing-3xl`) and the page gutter tokens. Cards own `p-md` / `p-lg`. Reading width uses `max-w-prose`. Prose resets apply only to direct `p` children.

Review surface: Storybook `UI/Layout/Section/Spacing Contract`.

## Shared section folder

| Folder                             | Role                                                                                 | Spacing                                                                    | Reviewed                                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/ui/src/sections/section` | `Section`, `SectionFrame`, `SectionHeading`, header, grid, tabs, carousel, accordion | Frame uses existing spacing tokens. Older `.library-section` rules remain. | Spacing contract story reviewed in Storybook, Sand light and dark, 320 and 1440, all three densities. Other families in this folder are not realigned. |

## Authorable families

Renderer lists come from `getSectionRenderers`. Layout lists come from `getSectionLayouts`. Forty-eight families.

| Type              | View       | Renderers                                                                       | Layouts                   | Spacing       | Reviewed                       |
| ----------------- | ---------- | ------------------------------------------------------------------------------- | ------------------------- | ------------- | ------------------------------ |
| about-hero        | hero       | list                                                                            | —                         | frame applied | story not opened               |
| about             | about      | cards, list, gallery, carousel, accordion, tabs                                 | about-editorial           | aligned       | default and editorial reviewed |
| accordion         | accordion  | accordion, cards, list                                                          | —                         | not aligned   | not reviewed                   |
| awards            | awards     | cards, list, gallery, carousel, accordion, tabs                                 | —                         | aligned       | default reviewed               |
| blog-page         | posts      | cards, list, gallery, carousel, accordion, tabs                                 | blog-featured             | not aligned   | not reviewed                   |
| cta               | cards      | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| calendar-link     | links      | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| careers           | careers    | cards, list, gallery, carousel, accordion, tabs                                 | careers-openings          | aligned       | openings reviewed at 1440      |
| clients           | clients    | gallery, masonry, carousel, cards                                               | —                         | not aligned   | not reviewed                   |
| contact-form      | contact    | list                                                                            | contact-split             | not aligned   | not reviewed                   |
| contact-info      | links      | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| dashboard         | dashboard  | list                                                                            | —                         | not aligned   | not reviewed                   |
| faq               | accordion  | accordion, cards, list                                                          | faq-stacked, faq-reversed | not aligned   | not reviewed                   |
| features          | cards      | cards, list, gallery, carousel, accordion, tabs                                 | features-bento            | not aligned   | not reviewed                   |
| gallery-grid      | gallery    | gallery, masonry, carousel, cards                                               | —                         | not aligned   | not reviewed                   |
| heading           | heading    | list                                                                            | —                         | frame applied | story not opened               |
| hero              | hero       | list                                                                            | hero-centered, hero-cover | not aligned   | not reviewed                   |
| how-to            | steps      | steps, list, cards                                                              | —                         | not aligned   | not reviewed                   |
| legal-text        | text       | text, list                                                                      | —                         | frame applied | story not opened               |
| map               | map        | list                                                                            | —                         | not aligned   | not reviewed                   |
| menu              | menu       | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| newsletter        | newsletter | list                                                                            | —                         | not aligned   | not reviewed                   |
| plans             | pricing    | cards, list, gallery, carousel, accordion, tabs                                 | pricing-comparison        | not aligned   | not reviewed                   |
| posts-grid        | posts      | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| pricing           | pricing    | cards, list, gallery, carousel, accordion, tabs                                 | pricing-comparison        | not aligned   | not reviewed                   |
| profile           | profile    | cards, list, gallery, carousel, accordion, tabs                                 | —                         | frame applied | story not opened               |
| projects          | projects   | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| property          | property   | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| quickstart        | steps      | steps, list, cards                                                              | —                         | not aligned   | not reviewed                   |
| shop-items        | shop       | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| showcase          | gallery    | gallery, masonry, carousel, cards                                               | —                         | not aligned   | not reviewed                   |
| social-links      | links      | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| stats             | statistics | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| studies           | timeline   | timeline, list, cards                                                           | —                         | aligned       | same timeline frame            |
| table-of-contents | toc        | list                                                                            | —                         | not aligned   | not reviewed                   |
| tabs              | tabs       | tabs, accordion, list                                                           | —                         | not aligned   | not reviewed                   |
| team              | team       | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| technical-skills  | skills     | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| testimonials      | quotes     | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| text              | text       | text, list                                                                      | —                         | aligned       | default reviewed at 1440       |
| timeline          | timeline   | timeline, list, cards                                                           | —                         | aligned       | same timeline frame            |
| video             | video      | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| work-experience   | timeline   | timeline, list, cards                                                           | —                         | aligned       | default reviewed               |
| custom            | list       | list, cards, gallery, masonry, carousel, accordion, tabs, timeline, steps, text | —                         | not aligned   | not reviewed                   |
| services          | cards      | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| youtube           | video      | cards, list, gallery, carousel, accordion, tabs                                 | —                         | not aligned   | not reviewed                   |
| instagram         | gallery    | gallery, masonry, carousel, cards                                               | —                         | not aligned   | not reviewed                   |
| pinterest         | gallery    | gallery, masonry, carousel, cards                                               | —                         | not aligned   | not reviewed                   |

Layout IDs: `about-editorial`, `blog-featured`, `careers-openings`, `contact-split`, `faq-stacked`, `faq-reversed`, `features-bento`, `hero-centered`, `hero-cover`, `pricing-comparison`.

## Built-in portfolio renderers

These are separate from the authorable custom-section views. Source: `packages/config/src/sections/section-registry.ts`.

| Kind       | Renderer IDs                                                                                    | Source field | Spacing     | Reviewed                              |
| ---------- | ----------------------------------------------------------------------------------------------- | ------------ | ----------- | ------------------------------------- |
| about      | about-card, prose, about-accordion                                                              | about        | not aligned | not reviewed                          |
| education  | education-timeline, education-list, education-cards, education-accordion                        | education    | aligned     | no story; viewport min-height removed |
| experience | timeline, experience-list, experience-cards, experience-accordion, experience-tabs              | experiences  | aligned     | no story; outer margin removed        |
| languages  | language-list, language-cards                                                                   | languages    | not aligned | not reviewed                          |
| projects   | project-cards, project-gallery, project-list, project-carousel, project-accordion, project-tabs | projects     | not aligned | not reviewed                          |
| skills     | skill-groups, skill-list, skill-cards, skill-accordion                                          | skills       | not aligned | not reviewed                          |

## View-only preview examples

These are preview adapters in `packages/ui/src/sections/live-section-preview/preview-examples.ts`. They are not authorable section types.

| ID                 | Name               | Spacing     | Reviewed     |
| ------------------ | ------------------ | ----------- | ------------ |
| about-me           | About Me           | not aligned | not reviewed |
| cv                 | CV Download        | not aligned | not reviewed |
| education          | Education          | not aligned | not reviewed |
| experience         | Experience         | not aligned | not reviewed |
| languages          | Languages          | not aligned | not reviewed |
| portfolio-projects | Portfolio Projects | not aligned | not reviewed |
| referrals          | Referrals          | not aligned | not reviewed |
| skills             | Skills             | not aligned | not reviewed |
| summary            | Summary            | not aligned | not reviewed |

## Other section folders

Support, editor, and marketing folders. None of these were restyled in Task 1.

| Folder                                                                                                                                                                    | Purpose                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `collection-view`                                                                                                                                                         | Shared item presentation used by authorable sections         |
| `editors`                                                                                                                                                                 | Section content editors and sortable lists                   |
| `home-section`                                                                                                                                                            | Product homepage blocks                                      |
| `item-media`                                                                                                                                                              | Section media                                                |
| `live-section-preview`                                                                                                                                                    | Gallery, catalog, and preview examples                       |
| `renderers`                                                                                                                                                               | Built-in section dispatcher                                  |
| `section-presentation`                                                                                                                                                    | Authorable section frame used before family-specific layouts |
| `studio`                                                                                                                                                                  | Ordering, settings, templates, and configured sections       |
| `about-me-section`, `cv-section`, `education-section`, `experience-section`, `project-section`, `referral-section`, `review-section`, `skills-section`, `summary-section` | View-only or built-in profile sections                       |

## Fixed spacing still in CSS

Kept on purpose until a later task checks each consumer.

| File                                                                | What it still does                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/sections/section/sections.css`                     | `.library-section` block padding `3.5rem`, a top border, heading and paragraph margins, and descendant `p` / `h3` rules. The timeline rail now uses spacing tokens. Step items, template-library controls, and a `100px` scroll margin still use fixed sizes. The descendant paragraph rule can restyle nested controls; it stays until Task 3 checks consumers. |
| `packages/ui/src/sections/section/section-views.css`                | Collection tracks use `minmax(min(100%, 15rem), 1fr)`. Control padding and carousel item width are view geometry, not page rhythm.                                                                                                                                                                                                                               |
| `packages/ui/src/sections/section-presentation/styles.ts`           | Configured sections still use `py-14`, a `600px` compact padding, and mixed pixel type rules. This is the current family frame and is outside Task 1.                                                                                                                                                                                                            |
| `packages/ui/src/sections/summary-section/summary-section.css`      | Hero block padding uses `clamp(3rem, 8vw, 7rem)` for the portfolio introduction, not the shared section stack.                                                                                                                                                                                                                                                   |
| `packages/ui/src/sections/home-section/examples.css`                | Homepage example illustrations use fixed card, type, and padding sizes. They are not portfolio section frames.                                                                                                                                                                                                                                                   |
| `packages/ui/src/sections/live-section-preview/section-catalog.css` | Picker chrome uses pixel margins and padding. It is gallery UI, not published page rhythm.                                                                                                                                                                                                                                                                       |

Token values in `packages/ui/src/styles/tokens/primitives.css` and `appearance.css` were not changed. Density still comes from `data-spacing`: compact, comfortable, and spacious.
