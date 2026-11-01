# UI catalog

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

`ThemeProvider` consumes `useUserConfigStore` from `@shared/runtime/stores`.
The existing runtime store owns the persisted mode and display-only user cache.
There is no separate UI storage store. Its pre-paint script and provider share
migration precedence and system-mode behavior.

`IconButton` supports `surface="portfolio"` for controls inside published
portfolios. Use it for menu, chat and scroll controls so their foreground,
surface, border and focus ring all resolve from the same portfolio palette.
Icons inherit `currentColor`; use a 24px icon inside the 44px large control.
`IconButtonWithLink` renders one link rather than nesting a button inside it.
