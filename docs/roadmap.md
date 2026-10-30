# Section system roadmap

| Order      | Status      | Scope                                                                                                                                                                                  |
| ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation | Merged      | AGENTS.md and repository skills for development, product rules and section workflows, with resources and a workspace check script                                                      |
| 1          | Merged      | Stable built-in section registry, fixed content sources, renderer IDs, settings and legacy defaults                                                                                    |
| 2          | Merged      | Shared carousel, timeline, cards, gallery, accordion, tabs and text building blocks                                                                                                    |
| 3          | Merged      | Compatible display choices, item selection, section order, visibility and previews                                                                                                     |
| 4          | Merged      | Custom section creation, naming, duplication, deletion, content editing and mixed ordering                                                                                             |
| 5          | Merged      | Services, testimonials, FAQs, statistics and calls to action as authorable compositions; optional image/video hero backgrounds; curated YouTube, Instagram and Pinterest work sections |
| 6          | Merged      | Versioned private section templates, explicit import review, native JSON export and compatible conversion of all 42 PageForge section families                                         |
| Follow-up  | Implemented | Select existing portfolio elements as custom section sources, beyond the existing built-in item selections                                                                             |

## Step five boundaries

Composition starters choose a meaningful default view without inserting fake testimonials or achievements. Authors supply their own content. They retain normal section naming, duplication, visibility, ordering and save behavior. Testimonials use author titles and quote bodies; FAQs use question titles and answer bodies; statistics use number titles and labels; calls to action use optional links. All remain portfolio content independent of the PDF.

The hero supports a direct image URL or muted looping video URL, an optional poster, object position and overlay. Default portfolios retain their current plain hero. Reduced motion pauses automatic video playback; visitors can explicitly play or pause. Media is loaded in the visitor's browser rather than fetched by the application server.

Social work sections are manually curated from public post/video/pin URLs with optional images and captions. YouTube videos load in a privacy-enhanced player only after a visitor requests them, with an external source link as a fallback. Instagram and Pinterest use visual cards linking to original work. This does not synchronize account feeds or scrape private content. Automatic feeds, Instagram/Pinterest embedded widgets and account authorization are separate integrations requiring their own design and provider access.

No production profiles are published or changed by adding these options. Repository skills are version-controlled project guidance; they are not installed as personal ChatGPT skills.

The full section library and templates/import/export implementation is documented in [the migration map](pageforge-section-migration.md) and [template guide](section-templates.md). Custom sections can now bind compatible existing profile elements as well as author their own items.
