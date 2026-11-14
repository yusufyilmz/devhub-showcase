# Shared UI review inventory

This checklist starts with the UI package exports, the component catalog, and colocated Storybook files.
Group imports and stylesheet exports are covered through the components that consume them.
A row covers the public component family and its parts. Expand the evidence for each part as it is reviewed.
A folder without a colocated story needs a consuming composition or a dedicated story before its review is complete.

Follow the [review plan](shared-ui-review-plan.md) and see the [manual review notes](shared-ui-styles.md) for interaction steps and results.

## Actions

[Once UI reference](https://docs.once-ui.com/components/button)

| Component family                                                                  | Public import                  | Storybook title               | Review evidence |
| --------------------------------------------------------------------------------- | ------------------------------ | ----------------------------- | --------------- |
| [buttons/action-button](../../../packages/ui/src/buttons/action-button)           | `@shared/ui/action-button`     | UI/Buttons/Action Button      | Pending         |
| [buttons/add-project-button](../../../packages/ui/src/buttons/add-project-button) | See group exports              | UI/Buttons/Add Project Button | Pending         |
| [buttons/button](../../../packages/ui/src/buttons/button)                         | `@shared/ui/button`            | UI/Buttons/Button             | Pending         |
| [buttons/buttons](../../../packages/ui/src/buttons/buttons)                       | `@shared/ui/buttons`           | Find consuming story          | Pending         |
| [buttons/download-cv-button](../../../packages/ui/src/buttons/download-cv-button) | See group exports              | UI/Buttons/Download CV Button | Pending         |
| [buttons/go-back-button](../../../packages/ui/src/buttons/go-back-button)         | See group exports              | UI/Buttons/Go Back Button     | Pending         |
| [buttons/home-button](../../../packages/ui/src/buttons/home-button)               | See group exports              | UI/Buttons/Home Button        | Pending         |
| [buttons/icon-button](../../../packages/ui/src/buttons/icon-button)               | `@shared/ui/icon-button`       | UI/Buttons/Icon Button        | Pending         |
| [buttons/project-button](../../../packages/ui/src/buttons/project-button)         | See group exports              | UI/Buttons/Project Button     | Pending         |
| [buttons/segmented-control](../../../packages/ui/src/buttons/segmented-control)   | `@shared/ui/segmented-control` | UI/Buttons/Segmented Control  | Pending         |
| [buttons/switch](../../../packages/ui/src/buttons/switch)                         | `@shared/ui/switch`            | UI/Buttons/Switch             | Pending         |
| [buttons/toggle](../../../packages/ui/src/buttons/toggle)                         | `@shared/ui/toggle`            | UI/Buttons/Toggle             | Pending         |
| [buttons/toggle-button](../../../packages/ui/src/buttons/toggle-button)           | `@shared/ui/toggle-button`     | UI/Buttons/Toggle Button      | Pending         |
| [buttons/toggle-group](../../../packages/ui/src/buttons/toggle-group)             | `@shared/ui/toggle-group`      | UI/Buttons/Toggle Group       | Pending         |

## Forms

[Once UI reference](https://docs.once-ui.com/form-controls/form)

| Component family                                                                          | Public import                         | Storybook title                                                     | Review evidence                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [forms](../../../packages/ui/src/forms)                                                   | `@shared/ui/forms`                    | Find consuming story                                                | Pending                                                                                                                                                                                                                      |
| [forms/calendar](../../../packages/ui/src/forms/calendar)                                 | `@shared/ui/calendar`                 | UI/Forms/Calendar                                                   | Today, selection, and keyboard focus. Arrow keys moved focus and Space selected a date. [Chrome checks](shared-ui-styles.md). [Reference](https://docs.once-ui.com/form-controls/datePicker)                                 |
| [forms/checkbox](../../../packages/ui/src/forms/checkbox)                                 | `@shared/ui/checkbox`                 | UI/Forms/Checkbox                                                   | Distinct mixed indicator and shared focus ring. [Chrome checks](shared-ui-styles.md#checkbox-and-radio-controls).                                                                                                            |
| [forms/contact-form](../../../packages/ui/src/forms/contact-form)                         | `@shared/ui/contact-form`             | UI/Forms/Contact Form                                               | Pending                                                                                                                                                                                                                      |
| [forms/field](../../../packages/ui/src/forms/field)                                       | See group exports                     | UI/Forms/Field                                                      | Token-based label spacing and linked hint. [Chrome checks](shared-ui-styles.md#labeled-fields).                                                                                                                              |
| [forms/form](../../../packages/ui/src/forms/form)                                         | `@shared/ui/form`                     | UI/Forms/Form                                                       | Pending                                                                                                                                                                                                                      |
| [forms/input](../../../packages/ui/src/forms/input)                                       | `@shared/ui/input`                    | UI/Forms/Input                                                      | Soft shared border and preset padding. [Chrome checks](shared-ui-styles.md#input).                                                                                                                                           |
| [forms/input-otp](../../../packages/ui/src/forms/input-otp)                               | `@shared/ui/input-otp`                | UI/Forms/Input OTP                                                  | Active and invalid cell styles. Six typed digits reached the input. The invalid story rendered with the invalid state. [Chrome checks](shared-ui-styles.md). [Reference](https://docs.once-ui.com/form-controls/otpInput)    |
| [forms/label](../../../packages/ui/src/forms/label)                                       | `@shared/ui/label`                    | UI/Forms/Label                                                      | Pending                                                                                                                                                                                                                      |
| [forms/lines-field](../../../packages/ui/src/forms/lines-field)                           | See group exports                     | UI/Forms/Lines Field                                                | Pending                                                                                                                                                                                                                      |
| [forms/login-form](../../../packages/ui/src/forms/login-form)                             | `@shared/ui/login-form`               | UI/Forms/Login Form                                                 | Pending                                                                                                                                                                                                                      |
| [forms/native-select](../../../packages/ui/src/forms/native-select)                       | `@shared/ui/native-select`            | UI/Forms/Native Select                                              | Shared field states and spacing. Focus measured 2px and the value changed. Invalid, disabled, and grouped stories rendered. [Chrome checks](shared-ui-styles.md). [Reference](https://docs.once-ui.com/form-controls/select) |
| [forms/notification-preferences](../../../packages/ui/src/forms/notification-preferences) | `@shared/ui/notification-preferences` | UI/Forms/Notification Preferences                                   | Pending                                                                                                                                                                                                                      |
| [forms/radio-button](../../../packages/ui/src/forms/radio-button)                         | `@shared/ui/radio-button`             | UI/Forms/Radio Button                                               | Theme accent and visible keyboard outline. [Chrome checks](shared-ui-styles.md#checkbox-and-radio-controls).                                                                                                                 |
| [forms/radio-group](../../../packages/ui/src/forms/radio-group)                           | `@shared/ui/radio-group`              | UI/Forms/Radio Group                                                | Shared border, hover and spacing tokens. [Chrome checks](shared-ui-styles.md#checkbox-and-radio-controls).                                                                                                                   |
| [forms/select](../../../packages/ui/src/forms/select)                                     | `@shared/ui/select`                   | UI/Forms/Select                                                     | Pending                                                                                                                                                                                                                      |
| [forms/select-field](../../../packages/ui/src/forms/select-field)                         | See group exports                     | UI/Forms/Select Field                                               | Token-based label spacing and chevron inset. [Chrome checks](shared-ui-styles.md#labeled-fields).                                                                                                                            |
| [forms/site-login](../../../packages/ui/src/forms/site-login)                             | `@shared/ui/site-login`               | UI/Forms/Site Login/Login Panel<br>UI/Forms/Site Login/Sign In Page | Pending                                                                                                                                                                                                                      |
| [forms/slider](../../../packages/ui/src/forms/slider)                                     | `@shared/ui/slider`                   | UI/Forms/Slider                                                     | Softer track and thumb focus. Arrow keys changed the value and focus measured 2px. Vertical and disabled stories rendered. [Chrome checks](shared-ui-styles.md). [Reference](https://docs.once-ui.com/form-controls/slider)  |
| [forms/text-field](../../../packages/ui/src/forms/text-field)                             | `@shared/ui/text-field`               | UI/Forms/Text Field                                                 | Shared border and state colors, including a one-pixel focused border. [Chrome checks](shared-ui-styles.md#labeled-fields).                                                                                                   |
| [forms/textarea](../../../packages/ui/src/forms/textarea)                                 | `@shared/ui/textarea`                 | UI/Forms/Textarea                                                   | Shared border, spacing and focus styles. [Chrome checks](shared-ui-styles.md#textarea).                                                                                                                                      |

## Feedback

[Once UI reference](https://docs.once-ui.com/components/overview#status-and-feedback)

| Component family                                                                | Public import                 | Storybook title              | Review evidence                                                                                                     |
| ------------------------------------------------------------------------------- | ----------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [feedback/alert](../../../packages/ui/src/feedback/alert)                       | `@shared/ui/alert`            | UI/Feedback/Alert            | Shared inset and severity icon treatment. [Chrome checks](shared-ui-styles.md#alert-severity-and-layout).           |
| [feedback/alert-dialog](../../../packages/ui/src/feedback/alert-dialog)         | `@shared/ui/alert-dialog`     | UI/Feedback/Alert Dialog     | Pending                                                                                                             |
| [feedback/badge](../../../packages/ui/src/feedback/badge)                       | `@shared/ui/badge`            | UI/Feedback/Badge            | Shared pill spacing, visible link focus, and consistent numeric badges. [Chrome checks](shared-ui-styles.md#badge). |
| [feedback/banner](../../../packages/ui/src/feedback/banner)                     | `@shared/ui/banner`           | UI/Feedback/Banner           | Shared spacing and narrow action layout. [Chrome checks](shared-ui-styles.md#banner-spacing-and-action).            |
| [feedback/chip](../../../packages/ui/src/feedback/chip)                         | `@shared/ui/chip`             | UI/Feedback/Chip             | Soft selection border and separate keyboard focus for each action. [Chrome checks](shared-ui-styles.md#chip).       |
| [feedback/empty-state](../../../packages/ui/src/feedback/empty-state)           | `@shared/ui/empty-state`      | UI/Feedback/Empty State      | Compact icon surface, readable message, and wrapping actions. [Chrome checks](shared-ui-styles.md#empty-state).     |
| [feedback/error-boundary](../../../packages/ui/src/feedback/error-boundary)     | `@shared/ui/error-boundary`   | Find consuming story         | Pending                                                                                                             |
| [feedback/error-page](../../../packages/ui/src/feedback/error-page)             | `@shared/ui/error-page`       | UI/Feedback/Error Page       | Pending                                                                                                             |
| [feedback/feedback](../../../packages/ui/src/feedback/feedback)                 | `@shared/ui/feedback`         | UI/Feedback/Feedback         | Pending                                                                                                             |
| [feedback/not-found](../../../packages/ui/src/feedback/not-found)               | `@shared/ui/not-found`        | UI/Feedback/Not Found        | Pending                                                                                                             |
| [feedback/notification](../../../packages/ui/src/feedback/notification)         | `@shared/ui/notification`     | UI/Feedback/Notification     | Pending                                                                                                             |
| [feedback/progress](../../../packages/ui/src/feedback/progress)                 | `@shared/ui/progress`         | UI/Feedback/Progress         | Static pattern for unknown progress. [Chrome checks](shared-ui-styles.md#progress-states).                          |
| [feedback/skeleton](../../../packages/ui/src/feedback/skeleton)                 | `@shared/ui/skeleton`         | UI/Feedback/Skeleton         | Responsive loading styles and reduced-motion support. [Chrome checks](shared-ui-styles.md#loading-feedback).        |
| [feedback/sonner](../../../packages/ui/src/feedback/sonner)                     | `@shared/ui/sonner`           | UI/Feedback/Sonner           | Shared toast spacing and close focus. [Chrome checks](shared-ui-styles.md#toast-and-sonner).                        |
| [feedback/spinner](../../../packages/ui/src/feedback/spinner)                   | `@shared/ui/spinner`          | UI/Feedback/Spinner          | Responsive loading styles and reduced-motion support. [Chrome checks](shared-ui-styles.md#loading-feedback).        |
| [feedback/status-indicator](../../../packages/ui/src/feedback/status-indicator) | `@shared/ui/status-indicator` | UI/Feedback/Status Indicator | Mode-aware colors and fixed dot sizes. [Chrome checks](shared-ui-styles.md#status-indicator).                       |
| [feedback/tag](../../../packages/ui/src/feedback/tag)                           | `@shared/ui/tag`              | UI/Feedback/Tag              | Shared spacing and narrow label wrapping. [Chrome checks](shared-ui-styles.md#tag-spacing-and-tones).               |
| [feedback/toast](../../../packages/ui/src/feedback/toast)                       | `@shared/ui/toast`            | UI/Feedback/Toast            | Shared toast spacing and close focus. [Chrome checks](shared-ui-styles.md#toast-and-sonner).                        |

## Overlays

[Once UI reference](https://docs.once-ui.com/components/overview#overlays)

| Component family                                                                | Public import                | Storybook title              | Review evidence |
| ------------------------------------------------------------------------------- | ---------------------------- | ---------------------------- | --------------- |
| [overlays](../../../packages/ui/src/overlays)                                   | `@shared/ui/overlays`        | Find consuming story         | Pending         |
| [overlays/animated-tooltip](../../../packages/ui/src/overlays/animated-tooltip) | See group exports            | UI/Overlays/Animated Tooltip | Pending         |
| [overlays/command](../../../packages/ui/src/overlays/command)                   | `@shared/ui/command`         | UI/Overlays/Command          | Pending         |
| [overlays/context-menu](../../../packages/ui/src/overlays/context-menu)         | `@shared/ui/context-menu`    | UI/Overlays/Context Menu     | Pending         |
| [overlays/dialog](../../../packages/ui/src/overlays/dialog)                     | `@shared/ui/dialog`          | UI/Overlays/Dialog           | Pending         |
| [overlays/drawer](../../../packages/ui/src/overlays/drawer)                     | `@shared/ui/drawer`          | UI/Overlays/Drawer           | Pending         |
| [overlays/dropdown-menu](../../../packages/ui/src/overlays/dropdown-menu)       | `@shared/ui/dropdown-menu`   | UI/Overlays/Dropdown Menu    | Pending         |
| [overlays/gallery-lightbox](../../../packages/ui/src/overlays/gallery-lightbox) | See group exports            | UI/Overlays/Gallery Lightbox | Pending         |
| [overlays/menubar](../../../packages/ui/src/overlays/menubar)                   | `@shared/ui/menubar`         | UI/Overlays/Menubar          | Pending         |
| [overlays/navigation-menu](../../../packages/ui/src/overlays/navigation-menu)   | `@shared/ui/navigation-menu` | UI/Overlays/Navigation Menu  | Pending         |
| [overlays/popover](../../../packages/ui/src/overlays/popover)                   | `@shared/ui/popover`         | UI/Overlays/Popover          | Pending         |
| [overlays/radix-dialog](../../../packages/ui/src/overlays/radix-dialog)         | `@shared/ui/radix-dialog`    | UI/Overlays/Radix Dialog     | Pending         |
| [overlays/sheet](../../../packages/ui/src/overlays/sheet)                       | `@shared/ui/sheet`           | UI/Overlays/Sheet            | Pending         |
| [overlays/tooltip](../../../packages/ui/src/overlays/tooltip)                   | `@shared/ui/tooltip`         | UI/Overlays/Tooltip          | Pending         |

## Layout

[Once UI reference](https://docs.once-ui.com/blocks/quickStart)

| Component family                                                                    | Public import                     | Storybook title                                                                                                                                                                                        | Review evidence |
| ----------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| [layout](../../../packages/ui/src/layout)                                           | `@shared/ui/layout`               | Find consuming story                                                                                                                                                                                   | Pending         |
| [layout/accordion](../../../packages/ui/src/layout/accordion)                       | `@shared/ui/accordion`            | UI/Layout/Accordion                                                                                                                                                                                    | Pending         |
| [layout/aspect-ratio](../../../packages/ui/src/layout/aspect-ratio)                 | `@shared/ui/aspect-ratio`         | UI/Layout/Aspect Ratio                                                                                                                                                                                 | Pending         |
| [layout/background](../../../packages/ui/src/layout/background)                     | `@shared/ui/background`           | UI/Layout/Background                                                                                                                                                                                   | Pending         |
| [layout/collapsible](../../../packages/ui/src/layout/collapsible)                   | `@shared/ui/collapsible`          | UI/Layout/Collapsible                                                                                                                                                                                  | Pending         |
| [layout/divider](../../../packages/ui/src/layout/divider)                           | `@shared/ui/divider`              | UI/Layout/Divider                                                                                                                                                                                      | Pending         |
| [layout/error-page](../../../packages/ui/src/layout/error-page)                     | See group exports                 | UI/Layout/Error Page                                                                                                                                                                                   | Pending         |
| [layout/flex](../../../packages/ui/src/layout/flex)                                 | `@shared/ui/flex`                 | UI/Layout/Flex                                                                                                                                                                                         | Pending         |
| [layout/hero](../../../packages/ui/src/layout/hero)                                 | See group exports                 | UI/Layout/Hero/Hero Surface                                                                                                                                                                            | Pending         |
| [layout/masonry-grid](../../../packages/ui/src/layout/masonry-grid)                 | See group exports                 | Find consuming story                                                                                                                                                                                   | Pending         |
| [layout/not-found-page](../../../packages/ui/src/layout/not-found-page)             | See group exports                 | UI/Layout/Not Found Page                                                                                                                                                                               | Pending         |
| [layout/page-shell](../../../packages/ui/src/layout/page-shell)                     | `@shared/ui/page-shell`           | UI/Layout/Page Shell                                                                                                                                                                                   | Pending         |
| [layout/page-variants](../../../packages/ui/src/layout/page-variants)               | `@shared/ui/page-variants`        | UI/Layout/Page Variants/Recovery Pages                                                                                                                                                                 | Pending         |
| [layout/paper](../../../packages/ui/src/layout/paper)                               | `@shared/ui/paper`                | UI/Layout/Paper                                                                                                                                                                                        | Pending         |
| [layout/resizable](../../../packages/ui/src/layout/resizable)                       | `@shared/ui/resizable`            | UI/Layout/Resizable                                                                                                                                                                                    | Pending         |
| [layout/reveal-card](../../../packages/ui/src/layout/reveal-card)                   | See group exports                 | Find consuming story                                                                                                                                                                                   | Pending         |
| [layout/scroll-button](../../../packages/ui/src/layout/scroll-button)               | `@shared/ui/scroll-button`        | UI/Layout/Scroll Button                                                                                                                                                                                | Pending         |
| [layout/scroll-to-top](../../../packages/ui/src/layout/scroll-to-top)               | `@shared/ui/scroll-to-top`        | UI/Layout/Scroll To Top                                                                                                                                                                                | Pending         |
| [layout/scrollable-container](../../../packages/ui/src/layout/scrollable-container) | `@shared/ui/scrollable-container` | UI/Layout/Scrollable Container                                                                                                                                                                         | Pending         |
| [layout/section](../../../packages/ui/src/layout/section)                           | `@shared/ui/section`              | UI/Layout/Section<br>UI/Layout/Section/Section Accordion<br>UI/Layout/Section/Section Carousel<br>UI/Layout/Section/Section Grid<br>UI/Layout/Section/Section Header<br>UI/Layout/Section/Section Tabs | Pending         |
| [layout/seperator](../../../packages/ui/src/layout/seperator)                       | `@shared/ui/seperator`            | UI/Layout/Seperator                                                                                                                                                                                    | Pending         |
| [layout/tabs](../../../packages/ui/src/layout/tabs)                                 | `@shared/ui/tabs`                 | UI/Layout/Tabs                                                                                                                                                                                         | Pending         |

## Navigation

[Once UI reference](https://docs.once-ui.com/components/overview#navigation)

| Component family                                                                      | Public import                  | Storybook title                 | Review evidence |
| ------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------- | --------------- |
| [navigation](../../../packages/ui/src/navigation)                                     | `@shared/ui/navigation`        | Find consuming story            | Pending         |
| [navigation/app-sidebar](../../../packages/ui/src/navigation/app-sidebar)             | `@shared/ui/app-sidebar`       | UI/Navigation/App Sidebar       | Pending         |
| [navigation/brand](../../../packages/ui/src/navigation/brand)                         | `@shared/ui/brand`             | UI/Navigation/Brand             | Pending         |
| [navigation/breadcrumb](../../../packages/ui/src/navigation/breadcrumb)               | `@shared/ui/breadcrumb`        | UI/Navigation/Breadcrumb        | Pending         |
| [navigation/footer](../../../packages/ui/src/navigation/footer)                       | `@shared/ui/footer`            | UI/Navigation/Footer            | Pending         |
| [navigation/header](../../../packages/ui/src/navigation/header)                       | `@shared/ui/header`            | UI/Navigation/Header            | Pending         |
| [navigation/nav](../../../packages/ui/src/navigation/nav)                             | `@shared/ui/nav`               | UI/Navigation/Nav/Nav Main      | Pending         |
| [navigation/navbar](../../../packages/ui/src/navigation/navbar)                       | `@shared/ui/navbar`            | UI/Navigation/Navbar            | Pending         |
| [navigation/page-header](../../../packages/ui/src/navigation/page-header)             | `@shared/ui/page-header`       | UI/Navigation/Page Header       | Pending         |
| [navigation/pagination](../../../packages/ui/src/navigation/pagination)               | `@shared/ui/pagination`        | UI/Navigation/Pagination        | Pending         |
| [navigation/section-navigator](../../../packages/ui/src/navigation/section-navigator) | `@shared/ui/section-navigator` | UI/Navigation/Section Navigator | Pending         |
| [navigation/sidebar](../../../packages/ui/src/navigation/sidebar)                     | `@shared/ui/sidebar`           | UI/Navigation/Sidebar           | Pending         |
| [navigation/site-header](../../../packages/ui/src/navigation/site-header)             | `@shared/ui/site-header`       | UI/Navigation/Site Header       | Pending         |
| [navigation/team-switcher](../../../packages/ui/src/navigation/team-switcher)         | `@shared/ui/team-switcher`     | UI/Navigation/Team Switcher     | Pending         |

## Content

[Once UI reference](https://docs.once-ui.com/components/overview#content)

| Component family                                                          | Public import               | Storybook title                         | Review evidence |
| ------------------------------------------------------------------------- | --------------------------- | --------------------------------------- | --------------- |
| [display](../../../packages/ui/src/display)                               | `@shared/ui/display`        | Find consuming story                    | Pending         |
| [display/avatar](../../../packages/ui/src/display/avatar)                 | `@shared/ui/avatar`         | UI/Display/Avatar                       | Pending         |
| [display/avatar-group](../../../packages/ui/src/display/avatar-group)     | `@shared/ui/avatar-group`   | UI/Display/Avatar Group                 | Pending         |
| [display/carousel](../../../packages/ui/src/display/carousel)             | `@shared/ui/carousel`       | UI/Display/Carousel                     | Pending         |
| [display/chart](../../../packages/ui/src/display/chart)                   | `@shared/ui/chart`          | UI/Display/Chart/Chart Area Interactive | Pending         |
| [display/code](../../../packages/ui/src/display/code)                     | `@shared/ui/code`           | UI/Display/Code                         | Pending         |
| [display/data-table](../../../packages/ui/src/display/data-table)         | `@shared/ui/data-table`     | UI/Display/Data Table                   | Pending         |
| [display/icons](../../../packages/ui/src/display/icons)                   | `@shared/ui/icons`          | UI/Display/Icons                        | Pending         |
| [display/iframe-preview](../../../packages/ui/src/display/iframe-preview) | `@shared/ui/iframe-preview` | UI/Display/Iframe Preview               | Pending         |
| [display/inline-code](../../../packages/ui/src/display/inline-code)       | `@shared/ui/inline-code`    | UI/Display/Inline Code                  | Pending         |
| [display/kbd](../../../packages/ui/src/display/kbd)                       | `@shared/ui/kbd`            | UI/Display/Kbd                          | Pending         |
| [display/list](../../../packages/ui/src/display/list)                     | `@shared/ui/list`           | UI/Display/List                         | Pending         |
| [display/logo-cloud](../../../packages/ui/src/display/logo-cloud)         | `@shared/ui/logo-cloud`     | UI/Display/Logo Cloud                   | Pending         |
| [display/map](../../../packages/ui/src/display/map)                       | `@shared/ui/map`            | UI/Display/Map                          | Pending         |
| [display/media](../../../packages/ui/src/display/media)                   | See group exports           | UI/Display/Media/Work Media             | Pending         |
| [display/table](../../../packages/ui/src/display/table)                   | `@shared/ui/table`          | UI/Display/Table                        | Pending         |
| [display/timeline](../../../packages/ui/src/display/timeline)             | `@shared/ui/timeline`       | UI/Display/Timeline                     | Pending         |
| [display/typography](../../../packages/ui/src/display/typography)         | `@shared/ui/typography`     | UI/Display/Typography                   | Pending         |

## Cards

[Once UI reference](https://docs.once-ui.com/components/card)

| Component family                                                                | Public import           | Storybook title              | Review evidence |
| ------------------------------------------------------------------------------- | ----------------------- | ---------------------------- | --------------- |
| [cards](../../../packages/ui/src/cards)                                         | `@shared/ui/cards`      | Find consuming story         | Pending         |
| [cards/animated-tools-card](../../../packages/ui/src/cards/animated-tools-card) | See group exports       | UI/Cards/Animated Tools Card | Pending         |
| [cards/appearance-card](../../../packages/ui/src/cards/appearance-card)         | See group exports       | UI/Cards/Appearance Card     | Pending         |
| [cards/card](../../../packages/ui/src/cards/card)                               | See group exports       | UI/Cards/Card                | Pending         |
| [cards/card-spotlight](../../../packages/ui/src/cards/card-spotlight)           | See group exports       | UI/Cards/Card Spotlight      | Pending         |
| [cards/content-card](../../../packages/ui/src/cards/content-card)               | See group exports       | UI/Cards/Content Card        | Pending         |
| [cards/expandable-cards](../../../packages/ui/src/cards/expandable-cards)       | See group exports       | UI/Cards/Expandable Cards    | Pending         |
| [cards/focus-cards](../../../packages/ui/src/cards/focus-cards)                 | See group exports       | UI/Cards/Focus Cards         | Pending         |
| [cards/hover-card](../../../packages/ui/src/cards/hover-card)                   | `@shared/ui/hover-card` | UI/Cards/Hover Card          | Pending         |
| [cards/hover-overlay-card](../../../packages/ui/src/cards/hover-overlay-card)   | See group exports       | UI/Cards/Hover Overlay Card  | Pending         |
| [cards/project-card](../../../packages/ui/src/cards/project-card)               | See group exports       | UI/Cards/Project Card        | Pending         |
| [cards/reveal-card](../../../packages/ui/src/cards/reveal-card)                 | See group exports       | UI/Cards/Reveal Card         | Pending         |
| [cards/section-cards](../../../packages/ui/src/cards/section-cards)             | See group exports       | UI/Cards/Section Cards       | Pending         |
| [cards/text-reveal-card](../../../packages/ui/src/cards/text-reveal-card)       | See group exports       | UI/Cards/Text Reveal Card    | Pending         |
| [cards/variant-card](../../../packages/ui/src/cards/variant-card)               | See group exports       | UI/Cards/Variant Card        | Pending         |

## Customization

[Once UI reference](https://docs.once-ui.com/components/stylePanel)

| Component family                                                                              | Public import                 | Storybook title                     | Review evidence |
| --------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------- | --------------- |
| [customizers/component-customizer](../../../packages/ui/src/customizers/component-customizer) | See group exports             | UI/Customizers/Component Customizer | Pending         |
| [customizers/customizers](../../../packages/ui/src/customizers/customizers)                   | `@shared/ui/customizers`      | Find consuming story                | Pending         |
| [customizers/mouse-circle](../../../packages/ui/src/customizers/mouse-circle)                 | `@shared/ui/mouse-circle`     | UI/Customizers/Mouse Circle         | Pending         |
| [customizers/theme-customizer](../../../packages/ui/src/customizers/theme-customizer)         | `@shared/ui/theme-customizer` | UI/Customizers/Theme Customizer     | Pending         |

## Theme

[Once UI reference](https://docs.once-ui.com/basics)

| Component family                                      | Public import             | Storybook title      | Review evidence |
| ----------------------------------------------------- | ------------------------- | -------------------- | --------------- |
| [theme](../../../packages/ui/src/theme)               | `@shared/ui/theme`        | Find consuming story | Pending         |
| [theme/studio](../../../packages/ui/src/theme/studio) | `@shared/ui/theme/studio` | Find consuming story | Pending         |

## Providers

[Once UI reference](https://docs.once-ui.com/basics)

| Component family                                | Public import          | Storybook title      | Review evidence |
| ----------------------------------------------- | ---------------------- | -------------------- | --------------- |
| [providers](../../../packages/ui/src/providers) | `@shared/ui/providers` | Find consuming story | Pending         |

## Import

[Once UI reference](https://docs.once-ui.com/modules)

| Component family                                        | Public import              | Storybook title      | Review evidence |
| ------------------------------------------------------- | -------------------------- | -------------------- | --------------- |
| [google-import](../../../packages/ui/src/google-import) | `@shared/ui/google-import` | Find consuming story | Pending         |

## Share previews

[Once UI reference](https://docs.once-ui.com/modules)

| Component family                    | Public import                            | Storybook title      | Review evidence |
| ----------------------------------- | ---------------------------------------- | -------------------- | --------------- |
| [seo](../../../packages/ui/src/seo) | `@shared/ui/seo`, `@shared/ui/seo/image` | Find consuming story | Pending         |
