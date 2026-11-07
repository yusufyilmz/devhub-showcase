# Storybook section and Studio previews

**Scope/status:** Implemented. These checks use fictional Storybook fixtures.

**Prerequisites:** Start `pnpm --filter storybook-app storybook` on port 6006. No account, migration, email app, or AI service is needed.

| Step | Clickable URL | Route path | Action | Expected result | Actual result / evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | [Features](http://127.0.0.1:6006/?path=/story/sections-features--default) | `/?path=/story/sections-features--default` | Open Default in the desktop canvas. | Three Atlas features appear in a grid with no bullets. | Chromium verified the three columns and cards locally. |
| 2 | [FAQ](http://127.0.0.1:6006/?path=/story/sections-faq--default) | `/?path=/story/sections-faq--default` | Expand **How long does a project take?** | The design sprint answer appears. | Chromium verified the answer locally. |
| 3 | [Gallery](http://127.0.0.1:6006/?path=/story/sections-gallerygrid--default) | `/?path=/story/sections-gallerygrid--default` | Open **View Atlas interface**, press Right Arrow, then press Escape. | The lightbox opens, advances to Orbit identity, and closes. | Chromium verified all three actions locally. |
| 4 | [Masonry Default](http://127.0.0.1:6006/?path=/story/sections-masonrygrid--default) and [Masonry Compact](http://127.0.0.1:6006/?path=/story/sections-masonrygrid--compact) | `/?path=/story/sections-masonrygrid--default`, `/?path=/story/sections-masonrygrid--compact` | Open Default at 1150px and 390px, then open Compact at 1150px. Compare Field notes, Color study, and Atlas interface. | Default shows three columns on desktop and one on mobile. Compact shows one column on desktop. Portrait, square, and landscape images keep their natural proportions, with a consistent gap between consecutive cards in each column. | Chromium verified the column counts, rendered image ratios, card gaps, and absence of horizontal overflow. |
| 5 | [Contact Form](http://127.0.0.1:6006/?path=/story/sections-contactform--default) | `/?path=/story/sections-contactform--default` | Inspect the email, subject, message, and **Open email app** controls. | The preview matches the live form layout and all controls are disabled. | Chromium verified disabled controls. The unit suite verifies that the preview has no nested form. |
| 6 | [Assistant tools](http://127.0.0.1:6006/?path=/story/studio-assistant-tools--default) | `/?path=/story/studio-assistant-tools--default` | Select **Improve selected writing**. | Writing fields appear beneath the task legend, above the feedback and source links. | Chromium verified the task change locally. |
| 7 | [Private CV versions](http://127.0.0.1:6006/?path=/story/studio-private-cv-versions--default) | `/?path=/story/studio-private-cv-versions--default` | Click **Create fresh version from profile**, edit **Version name**, and click **Save CV versions**. | The unsaved state clears and the download link appears. | Chromium verified the save against the story fixture. Private storage and download verification are covered in the [CV versions guide](cv-versions.md). |

Local app cross-check with the existing fixture server

- [Public portfolio](http://localhost:3100/library-engineer), route `/library-engineer`. Fill **Your email** at 1150px and 390px. The public contact control accepts input and the page fits the viewport. Chromium passed both widths.
- [Owner editor](http://localhost:3100/desktop-custom-owner/edit), route `/desktop-custom-owner/edit`. With the existing owner fixture session, open the editor and look for **Custom sections**. Chromium verified the editor and its control loaded. The Storybook fixture covers the updated Assistant and CV interactions.

Return to the [manual testing index](index.md).
