# Appearance picker, fonts, tokens and stored preferences

**Scope/status:** Implemented.

**Prerequisites:** Test desktop hover, keyboard focus and mobile tap.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                           | Route path | Action                                                                                                | Expected result                                                                                             | Actual result / evidence |
| ---- | --------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/) | `/`        | Hover, focus or tap Appearance controls; activate Theme settings.                                     | One launcher exposes mode/settings actions and opens a visual picker.                                       | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/) | `/`        | Inspect every preference group and selectable tile, including all accents/themes and Page default.    | Options are visible as selectable previews; none are hidden behind More preferences or text-only dropdowns. | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/) | `/`        | Choose serif, then monospace and sans; change spacing, accent, corners and another visual preference. | Page text and controls use the selected font; size/weight hierarchy, contrast and focus remain readable.    | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/) | `/`        | Close, reload, switch light/dark and navigate to another page; reopen settings.                       | All selected preferences remain stored, not only color mode.                                                | Not run                  |
| 5    | [Open](https://mydevstudio.vercel.app/) | `/`        | Select Reset appearance and reload.                                                                   | Defaults return and stale preference overrides are removed.                                                 | Not run                  |

## Admin header regression

**Prerequisite:** Sign in with a disposable platform administrator account. These checks also cover the two reported `/admin/portfolios` screenshots.

| Step | Clickable URL                                                      | Route path          | Action                                                                                                                                                           | Expected result                                                                                                                                                                                                                                                                                                            | Actual result / evidence |
| ---- | ------------------------------------------------------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 6    | [Open management](https://mydevstudio.vercel.app/admin/portfolios) | `/admin/portfolios` | Hover, focus or tap Appearance controls beside Manage portfolios.                                                                                                | Mode and settings actions open below the launcher, without covering the management link. All icons fit their buttons.                                                                                                                                                                                                      | Not run                  |
| 7    | [Open management](https://mydevstudio.vercel.app/admin/portfolios) | `/admin/portfolios` | Open Theme settings; choose Font size 6xl, Spacing spacious and Theme violet. Close and reload. Repeat at a narrow mobile width and with browser zoom increased. | Preferences persist. The largest text setting uses a readable 24px root size rather than 60px. The settings dialog stays on screen. Header controls remain compact in CSS size, reflow when necessary and remain reachable; the page heading is visible. Browser zoom still enlarges the page as requested by the browser. | Not run                  |
| 8    | [Open management](https://mydevstudio.vercel.app/admin/portfolios) | `/admin/portfolios` | Open Theme settings and activate Reset appearance. Close the dialog; use My portfolio and the management link.                                                   | Defaults return and both navigation links still work.                                                                                                                                                                                                                                                                      | Not run                  |

## Related evidence and detail

- [Admin layout browser regression](../../../apps/my-dev-studio/e2e/admin/portfolios/managed-portfolios.spec.ts)
- [e2e/home/theme-preferences.spec.ts](../../../apps/my-dev-studio/e2e/home/theme-preferences.spec.ts)
- [e2e/portfolio/themes.spec.ts](../../../apps/my-dev-studio/e2e/portfolio/themes.spec.ts)

Return to the [manual testing index](index.md).
