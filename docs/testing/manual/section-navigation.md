# Page section rail and hover previews

**Scope/status:** Implemented where the page has navigable sections.

**Prerequisites:** Use a long page on desktop and mobile.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                           | Route path | Action                                                   | Expected result                                                                                         | Actual result / evidence |
| ---- | --------------------------------------- | ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/) | `/`        | Locate Page sections and hover or focus a marker.        | A readable section label/preview appears and can be reached by keyboard.                                | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/) | `/`        | Activate a marker, then scroll through several sections. | Navigation jumps to that section and the active marker follows its location.                            | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/) | `/`        | Repeat with keyboard and reduced motion enabled.         | Focus remains usable, motion preferences are respected and the rail does not cause horizontal overflow. | Not run                  |

## Related evidence and detail

- [e2e/home/section-navigator.spec.ts](../../../e2e/home/section-navigator.spec.ts)

Return to the [manual testing index](index.md).
