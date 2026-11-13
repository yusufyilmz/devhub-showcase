# Shared UI styles

**Scope/status** — Shared borders, controls, and editor spacing in the Storybook build. The stories use fictional data.

**Prerequisites** — Run Storybook from the branch under review on port 6006. Use Sand with base corners and comfortable spacing.

| Step | Story                                                                                                                    | Route path                                            | Action                                                       | Expected result                                                                                | Actual result                                             |
| ---- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1    | [Card Spotlight](http://127.0.0.1:6006/?path=/story/ui-cards-card-spotlight--default&globals=brand:sand)                 | `/?path=/story/ui-cards-card-spotlight--default`      | Move the pointer over the card.                              | A subtle one-pixel border frames the card and the glow follows the pointer.                    | Story rendered in light, dark, and at 390px.              |
| 2    | [Collection Editor](http://127.0.0.1:6006/?path=/story/ui-editors-collection-editor--default&globals=brand:sand)         | `/?path=/story/ui-editors-collection-editor--default` | Click **Move Introduction down**.                            | **Selected work** moves to the first row. Headers, actions, and fields have space around them. | Reorder and layout verified in Chromium.                  |
| 3    | [Select](http://127.0.0.1:6006/?path=/story/ui-forms-select--default&globals=brand:sand;mode:dark)                       | `/?path=/story/ui-forms-select--default`              | Tab to **Select a fruit**, press Space, then Down and Enter. | The menu uses the Sand dark palette. Banana is selected and focus returns to the trigger.      | Keyboard selection and focus return verified in Chromium. |
| 4    | [Theme Customizer](http://127.0.0.1:6006/?path=/story/ui-customizers-themecustomizer--demo&globals=brand:sand;mode:dark) | `/?path=/story/ui-customizers-themecustomizer--demo`  | Open the story with Sand dark selected.                      | The preview stays in Sand dark when the color mode has no saved preference.                    | Covered by the Theme Customizer regression test.          |

## Button

| Story                                                                                                        | Route path                                 | Action                                           | Expected result                                                                                | Actual result                                                                            |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [Outline Button](http://127.0.0.1:6006/?path=/story/ui-buttons-button--outline&globals=brand:sand;mode:dark) | `/?path=/story/ui-buttons-button--outline` | Hover over the button, then use Tab to focus it. | The button has a one-pixel border, a muted hover fill, and one visible keyboard focus outline. | Verified the one-pixel border and two-pixel keyboard focus outline in Chromium at 480px. |
| [Loading Button](http://127.0.0.1:6006/?path=/story/ui-buttons-button--loading&globals=brand:sand)           | `/?path=/story/ui-buttons-button--loading` | Use Tab and try to activate the disabled button. | The muted button is skipped in the keyboard tab order.                                         | Verified the disabled button was skipped in Chromium.                                    |

## Icon Button

| Story                                                                                                          | Route path                                      | Action           | Expected result                                                           | Actual result         |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------- | ------------------------------------------------------------------------- | --------------------- |
| [Icon Button](http://127.0.0.1:6006/?path=/story/ui-buttons-icon-button--default&globals=brand:sand;mode:dark) | `/?path=/story/ui-buttons-icon-button--default` | Press Tab twice. | Focus skips the disabled middle icon button and outlines the last button. | Verified in Chromium. |

## Segmented Control

| Story                                                                                                            | Route path                                            | Action                         | Expected result                                                   | Actual result                                                                             |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Segmented Control](http://127.0.0.1:6006/?path=/story/ui-buttons-segmented-control--default&globals=brand:sand) | `/?path=/story/ui-buttons-segmented-control--default` | Tab to **CV** and press Space. | **CV** is pressed and has a distinct fill. Focus stays on **CV**. | Keyboard selection and focus verified in Sand light and dark, including the Narrow story. |

## Toggle controls

| Story                                                                                                   | Action                                       | Expected result                                                  | Actual result                                                                  |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [Toggle](http://127.0.0.1:6006/?path=/story/ui-buttons-toggle--with-text&globals=brand:sand)            | Press Space on **Italic**.                   | The toggle becomes pressed and keeps its keyboard focus outline. | Verified in Sand light and dark.                                               |
| [Toggle Button](http://127.0.0.1:6006/?path=/story/ui-buttons-toggle-button--narrow&globals=brand:sand) | Press Space on **CV**.                       | **CV** becomes pressed and **Portfolio** is released.            | Verified in the Narrow story in Sand light and dark.                           |
| [Toggle Group](http://127.0.0.1:6006/?path=/story/ui-buttons-toggle-group--narrow&globals=brand:sand)   | From **Align left**, press Right then Space. | Focus moves to **Align center** and Space selects it.            | Verified in Sand light and dark, including at 480px.                           |
| [Switch](http://127.0.0.1:6006/?path=/story/ui-buttons-switch--with-label&globals=brand:sand)           | Press Space on **Airplane mode**.            | The switch becomes checked and keeps its keyboard focus outline. | Verified in Sand light and dark. The Disabled story exposes a disabled switch. |

Visual references are the [Once UI Toggle Button](https://docs.once-ui.com/once-ui/components/toggleButton) and [Once UI Switch](https://docs.once-ui.com/form-controls/switch).
