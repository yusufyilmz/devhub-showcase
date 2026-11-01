# Components catalog

Portfolio sections, editors, and chat exported from `@shared/components`. Visual rules for the shared section frame live in the root [DESIGN.md](../../DESIGN.md). Primitive controls live in [the UI catalog](../ui/CATALOG.md).

## Entry points

| Export                                 | Path                       | Use                                                          |
| -------------------------------------- | -------------------------- | ------------------------------------------------------------ |
| `@shared/components`                   | `src/index.ts`             | Shell, fields, portfolio surfaces, and every section variant |
| `@shared/components/sections`          | `src/sections/variants`    | Section components and their editors                         |
| `@shared/components/section/renderers` | `src/sections/renderers`   | `RenderSection` and the renderer map                         |
| `@shared/components/section/editors`   | `src/sections/editors`     | `EditSection` and the editor map                             |
| `@shared/components/editor`            | `src/editor`               | Collection, content, options, and source editors             |
| `@shared/components/forms`             | `src/forms`                | `Field`, `LinesField`, `SelectField`, `EmptyState`           |
| `@shared/components/fields`            | `src/forms/fields.tsx`     | The same form fields                                         |
| `@shared/components/layout`            | `src/layout`               | `StudioShell`, `PageShell`, `PortfolioLayout`                |
| `@shared/components/studio`            | `src/studio`               | Home, studio editors, billing views, and example content     |
| `@shared/components/login`             | `src/auth/login-panel.tsx` | `LoginPanel`                                                 |
| `@shared/components/pages`             | `src/pages`                | `ErrorPage`, `NotFoundPage`                                  |
| `@shared/components/portfolio`         | `src/portfolio`            | `HeroSurface`, `WorkMedia`                                   |
| `@shared/components/portfolio-chat`    | `src/portfolio/chat`       | `PortfolioChat`                                              |
| `@shared/components/chat`              | `src/chat`                 | Chat bubbles, input, list, and typing                        |

## Shell and editing

| Component                                               | Folder               | Use                                                  |
| ------------------------------------------------------- | -------------------- | ---------------------------------------------------- |
| `StudioShell`                                           | `layout`             | Owner studio frame                                   |
| Home, editors, billing views, examples                  | `studio`             | Feature UI. App code keeps fetching and navigation   |
| `PageShell`                                             | `layout`             | Root document theme, providers, and metadata scripts |
| `LoginPanel`                                            | `auth`               | Sign-in panel                                        |
| `ErrorPage`, `NotFoundPage`                             | `pages`              | Error and missing-page states                        |
| `CollectionEditor`, `SortableList`                      | `editor`             | Reorderable collections                              |
| `SectionContentEditor`, `OptionsEditor`, `SourceEditor` | `editor`             | Section content, options, and source editing         |
| `Field`, `LinesField`, `SelectField`, `EmptyState`      | `forms`              | Editor fields                                        |
| `RenderSection`                                         | `sections/renderers` | Renders a saved section by type                      |
| `EditSection`                                           | `sections/editors`   | Edits a saved section by type                        |

## Portfolio surfaces

| Component       | Folder           | Use                      |
| --------------- | ---------------- | ------------------------ |
| `HeroSurface`   | `portfolio`      | Hero media surface       |
| `WorkMedia`     | `portfolio`      | Work and profile imagery |
| `PortfolioChat` | `portfolio/chat` | Published portfolio chat |

## Chat

| Component                                                                                   | Folder                           | Use                                |
| ------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------- |
| `ChatPanel`                                                                                 | `chat`                           | Chat panel                         |
| `ChatBubble`, `ChatBubbleGroup`, `ChatBubbleReactions`, `ChatBubbleTimestamp`               | `chat`                           | A message and its meta             |
| `ChatInput`, `ChatInputAction`                                                              | `chat`                           | Composer                           |
| `ChatList`, `ChatListItem`, `ChatListEmpty`, `ChatListSeparator`                            | `chat`                           | Message list                       |
| `ChatAvatar`, `ChatAvatarGroup`                                                             | `chat`                           | Speaker marks                      |
| `ChatTyping`, `ChatTypingText`                                                              | `chat`                           | Typing state                       |
| `ChatMessageActions`, `ChatMessageActionGroup`, `ChatQuickReactions`                        | `chat`                           | Message actions                    |
| `ChatSection`, `ChatMessageBox`, `ChatMessageItem`, `ChatPopupContainer`, `TypingIndicator` | `sections/variants/chat-section` | Chat placed as a portfolio section |

## Sections

Each content section lives in `src/sections/variants/{name}`. Most export the section and a matching editor. Item, list, and form parts stay in that folder.

| Section                                                 | Also exports                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `AboutHeroSection`                                      | editor                                                                                                          |
| `AboutMeSection`                                        |                                                                                                                 |
| `AboutSection`, `PortfolioAboutSection`                 | editor                                                                                                          |
| `AccordionSection`                                      | editor                                                                                                          |
| `AwardsSection`                                         | editor                                                                                                          |
| `BlogPageSection`, `JsonBlogPage`, `Post`, `Posts`      | editor                                                                                                          |
| `CalendarLinkSection`                                   | editor                                                                                                          |
| `CareersSection`                                        | editor                                                                                                          |
| `ClientsSection`                                        | editor                                                                                                          |
| `ContactFormSection`                                    | editor                                                                                                          |
| `ContactInfoSection`                                    | editor                                                                                                          |
| `CTASection`                                            | editor                                                                                                          |
| `CustomSection`                                         | editor                                                                                                          |
| `CVSection`                                             |                                                                                                                 |
| `EducationsSection`, `EducationItem`                    |                                                                                                                 |
| `ExperienceSection`, `ExperienceItem`, `ExperienceList` |                                                                                                                 |
| `FAQSection`                                            | editor                                                                                                          |
| `FeaturesSection`                                       | editor                                                                                                          |
| `GalleryGridSection`, `MasonryGrid`                     | editor                                                                                                          |
| `HeadingSection`                                        | editor                                                                                                          |
| `HeroSection`                                           | editor                                                                                                          |
| `HowToSection`                                          | editor                                                                                                          |
| `InstagramSection`                                      | editor                                                                                                          |
| `LegalTextSection`                                      | editor                                                                                                          |
| `MapSection`                                            | editor                                                                                                          |
| `MenuSection`                                           | editor                                                                                                          |
| `NewsletterSection`                                     | editor                                                                                                          |
| `PinterestSection`                                      | editor                                                                                                          |
| `PlansSection`                                          | editor                                                                                                          |
| `PostsGridSection`                                      | editor                                                                                                          |
| `PricingSection`                                        | editor                                                                                                          |
| `ProfileSection`                                        | editor                                                                                                          |
| `ProjectsSection`                                       | editor; `PortfolioProjectsSection`, `ProjectForm`, `ProjectItem`, `ProjectList` are the portfolio project parts |
| `PropertySection`                                       | editor                                                                                                          |
| `QuickstartSection`                                     | editor                                                                                                          |
| `ReferralSection`, `ReferralItem`                       |                                                                                                                 |
| `ReviewSection`, `ReviewButton`                         |                                                                                                                 |
| `ServicesSection`                                       | editor                                                                                                          |
| `ShopItemsSection`                                      | editor                                                                                                          |
| `ShowcaseSection`                                       | editor                                                                                                          |
| `SkillSection`, `SkillItem`, `SkillCategoryItem`        |                                                                                                                 |
| `SocialLinksSection`, `SocialLinks`                     | editor                                                                                                          |
| `StatsSection`                                          | editor                                                                                                          |
| `StudiesSection`                                        | editor                                                                                                          |
| `SummarySection`                                        |                                                                                                                 |
| `TableOfContentsSection`, `TableOfContents`             | editor                                                                                                          |
| `TabsSection`                                           | editor                                                                                                          |
| `TeamSection`                                           | editor                                                                                                          |
| `TechnicalSkillsSection`                                | editor                                                                                                          |
| `TestimonialsSection`                                   | editor                                                                                                          |
| `TextSection`                                           | editor                                                                                                          |
| `TimelineSection`                                       | editor                                                                                                          |
| `VideoSection`                                          | editor                                                                                                          |
| `WorkExperienceSection`                                 | editor                                                                                                          |
| `YouTubeSection`                                        | editor                                                                                                          |
