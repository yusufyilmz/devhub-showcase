# UI catalog

`@shared/ui/notification-preferences` provides a reusable per-device notification
settings panel with install guidance, permission/connection status and explicit
enable/test/disable callbacks. It owns presentation only; applications supply
authorization, configuration and persistence. Stories cover default, iOS, subscribed
and missing-setup states.

PasswordGate (`@shared/ui/portfolio`) is the generic protected-portfolio password form. It accepts an unlock callback; authorization, cookies and navigation stay in the app. Types and token styles live beside it.

RevisionHistory provides explicit inspect/review/restore callbacks with stale-draft protection. FieldVisibilityEditor edits independent website/CV contact choices; types/tests/stories are colocated.

CvVersionsEditor accepts load/save/download callbacks and edits independent private CV snapshots. Version fields and job evidence review live in portfolio/cv-versions; save failures retain local edits while the screen remains open.

TemplatePicker provides nine presentation-only profession presets under @shared/ui/portfolio. WorkMedia supplies consent-based YouTube loading, persistent original links and image-failure context. Styles and types are colocated.

AssistantTools, AssistantFeedback and PublishedSources are exported from @shared/ui/portfolio. They provide task, tone and length selection, section feedback navigation and validated internal public source links. Types live in portfolio/types.ts and token styles in workflow.css.

`@shared/ui/portfolio` includes EditorGuidance and usePortfolioHistory for owner
editors. The advisory checklist derives essential/recommended items from the
draft and routes through a caller-supplied navigation callback. Session history
covers the portfolio document, groups typing within 700 ms in the same field,
and retains up to 100 actions. New edits clear redo; save/discard reset history.
Ctrl/Cmd+Z and Shift+Ctrl/Cmd+Z work outside text controls and dialogs; native
text undo remains available inside inputs. History shortcuts pause while saving.
Username and publication controls are outside document history.

`@shared/ui/section-navigator` provides SectionNavigator, enabled once by
PageProviders. It discovers visible main-content sections with their own h1/h2,
follows document order, and updates after content changes. Mark a non-section
container with `data-page-section` to include it. Optional `sections` supplies
explicit `{ id, title, description }` entries targeting existing DOM ids. The rail
hides with fewer than two sections and offers hover/focus previews and anchor links.

PageShell marks product documents with `data-platform="mydevstudio"` so shared
controls use the same surface and foreground palette as the surrounding studio.
Editor toolbar rows remain plain layout containers rather than elevated Cards.

ThemeToggle shows a single palette icon. Hover, focus, or tap reveals mode and
appearance actions. Theme settings opens a dialog with accent swatches, typeface
samples, and square preview tiles for every supported preference. All mode,
accent, theme color, typography, spacing, border, shadow and motion choices are
visible in the scrolling grid; each group has its own Page default reset tile.
Geist Sans is the consistent product default; serif and monospace choices apply
to body copy, headings and controls through the same persisted font preference.
Appearance choices are validated and persisted in the shared user configuration
alongside mode and display user. ThemeProvider applies them before/after hydration
and synchronizes storage events. ThemeCustomizer uses the same preferences;
themeStore remains a compatibility API without a second persistence key.

Application controls use Button, Input, Textarea and NativeSelect. NativeSelect
is available from @shared/ui/native-select and preserves native option, optgroup,
multiple-selection and form semantics. Login presentation is owned by
@shared/ui/site-login; auth retains session handlers and provider consent.
Existing custom skins can use Button variant="unstyled" or the unstyled prop
on fields; these retain shared behavior without applying a second visual skin.
Unstyled buttons preserve native submit defaults; styled buttons default to button.

Component contracts live in colocated types.ts files. Reusable variants, class
maps and style helpers live in styles.ts; components import them directly.
Existing component entry points continue to re-export their public types and
variants. Type modules use type-only imports, and style modules do not import
component implementations. Card variants share BaseCardProps and compose
CardBase rather than importing the Card dispatcher.

Card accepts a discriminated type prop: omitted or empty preserves the base
surface; reveal, variants, hover, content and appearance use the existing
specialized components and their props. Tilt and animated use the base surface
with reduced-motion-aware effects. Reveal requires title and heading; content
requires title. Hover accepts a trigger element or explicit HoverCardTrigger /
HoverCardContent children. CardProps is exported from @shared/ui/cards. Use `backdrop="accent"` for the shared gradient and leading accent border, as on the Fitness plans card.

Author CSS in `src/styles`. Domain-specific sheets live under
`src/styles/components/` and load with their owning components. Public CSS
exports continue to work. Use shared Tailwind utilities for layouts and controls.
Card and control surfaces load from `src/styles/components/cards/surfaces.css`.

HomeChatLauncher in src/sections/home-section/chat-launcher.tsx composes the shared
ChatComposer and opens the authenticated Studio assistant below the capabilities strip.
ChatComposer also accepts optional controls and a message length limit for Fitness.
ChatComposer and StudioChatScreen from @shared/ui/display provide the compact icon
composer and centered assistant thread with starter prompts. Visitor mode accepts the portfolio name
and back link, with public questions as suggestions. They receive callbacks and do not fetch
or save data. Styles use shared semantic, spacing, elevation and radius tokens.

`GalleryLightbox` from `@shared/ui/dialog` provides a focus-trapped gallery dialog,
previous/next navigation, arrow keys, thumbnails, and optional full-page links.
Gallery Grid sections use it for authored images; homepage examples use the same
viewer with first-party fictional portfolio pages.

Public components exported from `packages/ui/src/components/index.ts`. Import them as `@shared/ui/{folder}`. Visual recipes for the pieces that define the product look live in the root [DESIGN.md](../../DESIGN.md).

The component tables, section descriptions and appearance options come from
[`src/registry/components.json`](src/registry/components.json), also available as
`@shared/ui/registry.json`. Edit the registry for metadata changes and run
`pnpm generate:ui-catalog`. Use `pnpm check:ui-catalog` to catch stale output or
options that no longer match the supported configuration.

## Theme options

<!-- registry:theme-presets -->

<!-- registry:theme-options -->

## Actions

<!-- registry:actions -->

## Forms

<!-- registry:forms -->

## Feedback

<!-- registry:feedback -->

## Overlays

<!-- registry:overlays -->

## Layout and surfaces

<!-- registry:layout-and-surfaces -->

## Navigation and chrome

<!-- registry:navigation-and-chrome -->

## Content

<!-- registry:content -->

`@shared/ui/portfolio` also exports `GuidedOnboarding`, `SetupNavigation`, `DraftRecovery`, `useDraftRecovery` and `ProposalComparison`. These reuse editor controls and the token-based `portfolio-workflow.css` stylesheet; recovery is scoped to the current browser tab.

## Studio tools

<!-- registry:studio-tools -->

Reveal Cards use `--reveal-duration` and `--reveal-fade-duration` for the
details transition. Set them on a card's class to adjust its timing. Reduced
motion removes the transition. Use `pinOnDetailsClick` when detail controls
need to retain focus after opening a dialog.

### Shared product surfaces

`Card` supports `asChild`, `layout="stack|plain"`,
`surface="semantic|portfolio"`, and `interaction="static|lift"` (default `lift`).
Use `asChild` to preserve section/article semantics without an extra wrapper.
Use the portfolio adapter only on existing RGB portfolio/studio surfaces.
`Button` supports native actions, link actions via `href`, and single-child
composition via `asChild`. Links preserve accessibility attributes and disabled
links have no navigation target. Inputs and textareas share the same focus treatment.
See **UI / Cards / Card / Product Surfaces** in Storybook.

Use `Card backdrop="accent"` or the same prop on `RevealCard` for a tinted
surface and leading accent edge. `Background effect="aurora"` adds an accent
wash and dotted texture. The homepage pairs them with a short entrance and
scroll-driven card transitions where supported. Reduced motion keeps the
backdrop and card styles visible without the entrance effects.

<!-- registry:card-families -->

`@shared/ui/tooltip` accepts `<Tooltip title="Hint"><Button>Action</Button></Tooltip>`
or composed `TooltipTrigger` and `TooltipContent` parts. Both use the same
portal, collision handling, keyboard focus, Escape dismissal and appearance
tokens. `AnimatedTooltip` adds optional pointer tracking.

`SectionsSettings` groups section content, ordering, display, and template controls for the owner editor. Import it from `@shared/ui/sections/studio`.

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

Import portfolio sections from `@shared/ui/sections` and chat from `@shared/ui/chat`. Visual rules for the shared section frame live in the root [DESIGN.md](../../DESIGN.md).

## Entry points

<!-- registry:entry-points -->

## Shell and editing

<!-- registry:shell-and-editing -->

## Portfolio surfaces

<!-- registry:portfolio-surfaces -->

## Chat

<!-- registry:chat -->

## Sections

Content sections live in `src/sections/{name}-section`. Most export the section and a matching editor. Item, list, and form parts stay in that folder.

<!-- registry:sections -->

## Full-page compositions

`HomePage` in `@shared/ui/sections` renders the homepage sections. The
app supplies the examples and pricing content. `EngineerPage` and
`PortfolioLayout` in `@shared/ui/portfolio` render published profile
layouts and use the same registered section dispatcher. `StudioShell`
and `StudioHeading` provide the studio navigation, page title and grouped
footer for editor, billing, management and review screens.

Storybook groups full-page fixture previews under **Pages**. Page stories
use the same presentations and keep provider data and actions local to
the fixtures.

## Homepage sections

Import homepage compositions from `@shared/ui/sections`. They live in `src/sections/home-section` and replace the removed `containers` entry point. `HomeHeroSection`, `HomeFeaturesSection`, `HomeOptionsSection`, `HomePricingSection`, `HomeLibrarySection`, `HomeProcessSection`, `HomeFAQSection`, `HomeCTASection` and `HomeCapabilitiesSection` compose shared controls and surfaces. `HomeHeader`, `HomeFooter`, `PortfolioPreview` and `LibraryPicker` support that composition. Home Hero, FAQ and CTA supply landing-page copy to the same blocks used by authored sections. Header and Footer accept brand, links and actions from the page.

All <!-- registry:section-count --> registered authorable sections have colocated Default, Compact and Empty stories using fictional fixtures from `tools/test/fixtures/section-story.ts`. `SectionCatalog` provides a searchable name/category browser for the same registry, using the names, descriptions and categories in the component registry.

`PublicationControls` (`@shared/ui/portfolio`) reviews a saved revision and confirms publication or withdrawal through app-provided callbacks; it never saves the draft. Optional scheduling callbacks enable reviewed snapshot scheduling, visible timezone/UTC time, status refresh and cancellation. The app owns authorization, persistence and worker setup.

AgentCompanion supports idle, listening, thinking, writing, happy and error reactions.
Its composer placement is a noninteractive character beside ChatComposer; Studio and visitor chats select reactions from request and streaming state.
