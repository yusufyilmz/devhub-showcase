# UI catalog

Component styles live beside their owning UI domain. Portfolio skins are in
src/portfolio/portfolio.css; section skins in src/sections/sections.css; navigation
in src/navigation/chrome.css; chat styles in src/display/chat; example styles in
src/sections/home-section; login styles in src/forms/login-form. Existing CSS export
paths remain supported by the global bundles and forwarding imports. Tokens,
themes, layouts and shared foundation rules remain centralized.

HomeChatLauncher in src/sections/home-section/chat-launcher.tsx composes the shared
ChatComposer and opens the authenticated Studio assistant below the capabilities strip.
ChatComposer and StudioChatScreen from @shared/ui/display provide the compact icon
composer and responsive assistant shell. They receive callbacks and do not fetch
or save data. Styles use shared semantic, spacing, elevation and radius tokens.

`GalleryLightbox` from `@shared/ui/dialog` provides a focus-trapped gallery dialog,
previous/next navigation, arrow keys, thumbnails, and optional full-page links.
Gallery Grid sections use it for authored images; homepage examples use the same
viewer with first-party fictional portfolio pages.

Public components exported from `packages/ui/src/components/index.ts`. Import them as `@shared/ui/{folder}`. Visual recipes for the pieces that define the product look live in the root [DESIGN.md](../../DESIGN.md).

## Actions

| Component                                                                             | Folder                                    | Use                                                                     |
| ------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| `Button`                                                                              | `button`                                  | Primary, secondary, outline, ghost, text, link, and destructive actions |
| `IconButton`, `IconButtonWithLink`                                                    | `icon-button`                             | Square icon actions                                                     |
| `AddProjectButton`, `DownloadCVButton`, `GoBackButton`, `HomeButton`, `ProjectButton` | `buttons`                                 | Named portfolio actions                                                 |
| `Toggle`, `ToggleButton`, `ToggleGroup`                                               | `toggle`, `toggle-button`, `toggle-group` | On/off and segmented choices                                            |
| `Switch`                                                                              | `switch`                                  | Binary setting                                                          |
| `SegmentedControl`                                                                    | `segmented-control`                       | A short set of mutually exclusive options                               |

## Forms

| Component                   | Folder                        | Use                               |
| --------------------------- | ----------------------------- | --------------------------------- |
| `Input`                     | `input`                       | Single-line text                  |
| `Textarea`                  | `textarea`                    | Multi-line text                   |
| `TextField`                 | `text-field`                  | Labeled field                     |
| `Label`                     | `label`                       | Field label                       |
| `Checkbox`                  | `checkbox`                    | Multi-select option               |
| `RadioButton`, `RadioGroup` | `radio-button`, `radio-group` | Single-select option              |
| `Select`                    | `select`                      | Option menu                       |
| `Slider`                    | `slider`                      | Numeric range                     |
| `Calendar`                  | `calendar`                    | Date selection                    |
| `InputOTP`                  | `input-otp`                   | One-time code entry               |
| `Form`                      | `form`                        | Form layout and validation wiring |
| `ContactForm`               | `contact-form`                | Portfolio contact form            |

## Feedback

| Component                                  | Folder                             | Use                                |
| ------------------------------------------ | ---------------------------------- | ---------------------------------- |
| `Alert`                                    | `alert`                            | Inline status message              |
| `AlertDialog`                              | `alert-dialog`                     | Confirmation that must be answered |
| `Badge`                                    | `badge`                            | Short status chip                  |
| `Banner`                                   | `banner`                           | Page-level notice                  |
| `Chip`, `Tag`                              | `chip`, `tag`                      | Compact labels                     |
| `Toast`, `Toaster`, `SnackbarNotification` | `toast`, `toaster`, `notification` | Transient messages                 |
| `Spinner`                                  | `spinner`                          | Waiting state                      |
| `Skeleton`                                 | `skeleton`                         | Loading placeholder                |
| `Progress`                                 | `progress`                         | Determinate progress               |
| `StatusIndicator`                          | `status-indicator`                 | Small presence or state mark       |
| `EmptyState`                               | `empty-state`                      | No-data state                      |
| `ErrorPage`                                | `error-page`                       | Full-page error                    |
| `Feedback`                                 | `feedback`                         | Feedback prompt                    |

## Overlays

| Component                   | Folder            | Use                           |
| --------------------------- | ----------------- | ----------------------------- |
| `Dialog`                    | `dialog`          | Modal panel                   |
| `RadixDialog` and its parts | `radix-dialog`    | Lower-level dialog primitives |
| `Drawer`                    | `drawer`          | Edge panel                    |
| `Sheet`                     | `sheet`           | Side sheet                    |
| `Popover`                   | `popover`         | Anchored floating panel       |
| `Tooltip`                   | `tooltip`         | Hover or focus hint           |
| `HoverCard`                 | `hover-card`      | Rich hover preview            |
| `DropdownMenu`              | `dropdown-menu`   | Action menu                   |
| `ContextMenu`               | `context-menu`    | Right-click menu              |
| `Menubar`                   | `menubar`         | Horizontal menu bar           |
| `Command`                   | `command`         | Command palette               |
| `NavigationMenu`            | `navigation-menu` | Disclosure navigation         |

## Layout and surfaces

| Component                                            | Folder                           | Use                                    |
| ---------------------------------------------------- | -------------------------------- | -------------------------------------- |
| `Flex` and the row, column, and stack helpers        | `flex`                           | Layout primitive                       |
| `Card` and its header, body, footer, and title parts | `card`                           | Bordered content surface               |
| `RevealCard`                                         | `reveal-card`                    | Card with a reveal treatment           |
| `AppearanceCard`                                     | `cards`                          | Card wrapper with appearance and hover |
| `VariantCard` and section parts                      | `cards`                          | CVA card surface with layout slots     |
| `Section`                                            | `section`                        | Page section frame                     |
| `Divider`                                            | `divider`                        | Horizontal or vertical rule            |
| `Separator`                                          | `seperator`                      | Radix separator                        |
| `AspectRatio`                                        | `aspect-ratio`                   | Fixed media ratio                      |
| `ScrollableContainer`, `ScrollArea`                  | `scrollable-container`           | Overflow region                        |
| `ScrollButton`, `ScrollToTop`                        | `scroll-button`, `scroll-to-top` | Scroll affordances                     |
| `Resizable`                                          | `resizable`                      | Resizable panes                        |
| `Accordion`                                          | `accordion`                      | Collapsible stacked sections           |
| `Collapsible`                                        | `collapsible`                    | Single disclosure                      |
| `Tabs`                                               | `tabs`                           | Tabbed content                         |
| `Background`                                         | `background`                     | Page background treatment              |

## Navigation and chrome

| Component               | Folder                   | Use                |
| ----------------------- | ------------------------ | ------------------ |
| `Brand`                 | `brand`                  | Wordmark home link |
| `Header`                | `header`                 | Top of page        |
| `Navbar`, `MobileMenu`  | `navbar`                 | Primary navigation |
| `Footer`                | `footer`                 | Page footer        |
| `PageHeader`            | `page-header`            | Page title block   |
| `Sidebar`, `AppSidebar` | `sidebar`, `app-sidebar` | Side navigation    |
| `Breadcrumb`            | `breadcrumb`             | Location trail     |
| `Pagination`            | `pagination`             | Paged lists        |
| `TeamSwitcher`          | `team-switcher`          | Workspace switcher |

## Content

| Component                                                        | Folder                   | Use                                   |
| ---------------------------------------------------------------- | ------------------------ | ------------------------------------- |
| `Typography`                                                     | `typography`             | Type styles from `h1` through caption |
| `Code`, `InlineCode`                                             | `code`, `inline-code`    | Code samples                          |
| `Kbd`                                                            | `kbd`                    | Keyboard key                          |
| `List`, `ListItem`                                               | `list`                   | Text list                             |
| `Table`                                                          | `table`                  | Static table                          |
| `DataTable`                                                      | `data-table`             | Sortable data table                   |
| `Chart`                                                          | `chart`                  | Charts                                |
| `Timeline` and its item parts                                    | `timeline`               | Vertical timeline                     |
| `Avatar`, `AvatarGroup`                                          | `avatar`, `avatar-group` | People marks                          |
| `LogoCloud`                                                      | `logo-cloud`             | Logo row                              |
| `Carousel`                                                       | `carousel`               | Horizontal media sequence             |
| `IFramePreview`                                                  | `iframe-preview`         | Embedded preview                      |
| `Map`                                                            | `map`                    | Map embed                             |
| `Chat` and its header, input, and message parts                  | `chat`                   | Portfolio chat                        |
| Icons (`ArrowBackIcon`, `CloseIcon`, `GitHubIcon`, and the rest) | `icons`                  | Shared icons                          |

## Studio tools

| Component                                | Folder                                     | Use                               |
| ---------------------------------------- | ------------------------------------------ | --------------------------------- |
| `ThemeCustomizer`, `ComponentCustomizer` | `theme-customizer`, `component-customizer` | Live theme and component controls |
| `MouseCircle`                            | `mouse-circle`                             | Pointer decoration                |

### Shared product surfaces

`Card` supports `asChild`, `layout="stack|plain"`,
`surface="semantic|portfolio"`, and `interaction="static|lift"` (default `lift`).
Use `asChild` to preserve section/article semantics without an extra wrapper.
Use the portfolio adapter only on existing RGB portfolio/studio surfaces.
`Button` supports native actions, link actions via `href`, and single-child
composition via `asChild`. Links preserve accessibility attributes and disabled
links have no navigation target. Inputs and textareas share the same focus treatment.
See **UI Components / Card / Product Surfaces** in Storybook.

## Browser preferences

`ThemeProvider` consumes `useUserConfigStore` from `@shared/runtime/user`.
`ThemeContext` exposes the resolved `mode` and `toggle` when an app keeps its own button.
The existing runtime store owns the persisted mode and display-only user cache.
There is no separate UI storage store. Its pre-paint script and provider share
migration precedence and system-mode behavior.

`IconButton` supports `surface="portfolio"` for controls inside published
portfolios. Use it for menu, chat and scroll controls so their foreground,
surface, border and focus ring all resolve from the same portfolio palette.
Icons inherit `currentColor`; use a 24px icon inside the 44px large control.
`IconButtonWithLink` renders one link rather than nesting a button inside it.

`Section`, `Header` and `Footer` accept `asChild` to compose an existing semantic element without adding a second wrapper. Use this variant for page compositions while keeping their content and navigation in the section package. Shared section grids, accordions and carousels default to semantic Card surfaces; existing portfolio consumers pass `surface="portfolio"` explicitly.

Portfolio sections, editors, and chat exported from `@shared/ui`. Visual rules for the shared section frame live in the root [DESIGN.md](../../DESIGN.md).

## Entry points

| Export                         | Path                       | Use                                                          |
| ------------------------------ | -------------------------- | ------------------------------------------------------------ |
| `@shared/ui`                   | `src/index.ts`             | Shell, fields, portfolio surfaces, and every section variant |
| `@shared/ui/sections`          | `src/sections/variants`    | Section components and their editors                         |
| `@shared/ui/section/renderers` | `src/sections/renderers`   | `RenderSection` and the renderer map                         |
| `@shared/ui/section/editors`   | `src/sections/editors`     | `EditSection` and the editor map                             |
| `@shared/ui/editor`            | `src/editor`               | Collection, content, options, and source editors             |
| `@shared/ui/forms`             | `src/forms`                | `Field`, `LinesField`, `SelectField`, `EmptyState`           |
| `@shared/ui/fields`            | `src/forms/fields.tsx`     | The same form fields                                         |
| `@shared/ui/layout`            | `src/layout`               | `StudioShell`, `PageShell`, `PortfolioLayout`                |
| `@/features/studio`            | `src/studio`               | Home, studio editors, billing views, and example content     |
| `@shared/ui/login`             | `src/auth/login-panel.tsx` | `LoginPanel`                                                 |
| `@shared/ui/pages`             | `src/pages`                | `ErrorPage`, `NotFoundPage`                                  |
| `@shared/ui/portfolio`         | `src/portfolio`            | `HeroSurface`, `WorkMedia`                                   |
| `@shared/ui/portfolio-chat`    | `src/portfolio/chat`       | `PortfolioChat`                                              |
| `@shared/ui/chat`              | `src/chat`                 | Chat bubbles, input, list, and typing                        |

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

| Component                                                                     | Folder | Use                    |
| ----------------------------------------------------------------------------- | ------ | ---------------------- |
| `ChatPanel`                                                                   | `chat` | Chat panel             |
| `ChatBubble`, `ChatBubbleGroup`, `ChatBubbleReactions`, `ChatBubbleTimestamp` | `chat` | A message and its meta |
| `ChatInput`, `ChatInputAction`                                                | `chat` | Composer               |
| `ChatList`, `ChatListItem`, `ChatListEmpty`, `ChatListSeparator`              | `chat` | Message list           |
| `ChatAvatar`, `ChatAvatarGroup`                                               | `chat` | Speaker marks          |
| `ChatTyping`, `ChatTypingText`                                                | `chat` | Typing state           |
| `ChatMessageActions`, `ChatMessageActionGroup`, `ChatQuickReactions`          | `chat` | Message actions        |

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

## Homepage sections

Import homepage compositions from `@shared/ui/sections`. They live in `src/sections/variants/home-section` and replace the removed `containers` entry point. `HomeHeroSection`, `HomeFeaturesSection`, `HomeOptionsSection`, `HomePricingSection`, `HomeLibrarySection`, `HomeProcessSection`, `HomeFAQSection`, `HomeCTASection` and `HomeCapabilitiesSection` compose shared controls and surfaces. `HomeHeader`, `HomeFooter`, `PortfolioPreview` and `LibraryPicker` support that composition. Session decisions and navigation remain app props.

All 47 registered authorable sections have colocated Default, Compact and Empty stories using fictional fixtures from `src/sections/__fixtures__/section-story.ts`. `SectionCatalog` provides a searchable name/category browser for the same registry, without copying its list into another data source.
