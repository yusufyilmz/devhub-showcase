# Featured engineer portfolio

**Scope/status:** Featured introduction for the main published engineer
portfolio, with a first-party CV link and up to two visible public projects.

**Prerequisites:** Use the local Playwright fixture for the main portfolio and
the Storybook engineer preview. Use the
[shared setup and result rules](index.md#before-you-start).

| Step | Clickable URL                                                                                     | Route path                                          | Action                                                                              | Expected result                                                                                         | Actual result / evidence                                                                                                 |
| ---- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1    | [Main portfolio](http://localhost:3100/yusufyilmz)                                                | `/yusufyilmz`                                       | Open at desktop and phone widths. Inspect Selected work and follow Explore my work. | The hero and work list sit side by side on desktop and stack on phones. The action scrolls to Projects. | Passed in Chromium at 1440px and 390px. The work link reached Projects and the layout fit the viewport.                  |
| 2    | [CV PDF](http://localhost:3100/yusufyilmz/cv.pdf)                                                 | `/yusufyilmz/cv.pdf`                                | Open Download CV from the hero.                                                     | The linked route serves the published PDF.                                                              | Passed in the local fixture. The hero linked the CV and the route returned HTTP 200 with application/pdf.                |
| 3    | [Featured Storybook page](http://127.0.0.1:6006/?path=/story/pages-engineer-portfolio--spotlight) | `/?path=/story/pages-engineer-portfolio--spotlight` | Compare light and dark. Enable reduced motion and refresh.                          | The wash follows the palette. Reduced motion displays the full backdrop immediately.                    | Passed in the light and dark Storybook previews. The local main portfolio backdrop had no animation with reduced motion. |
| 4    | [Standard Storybook page](http://127.0.0.1:6006/?path=/story/pages-engineer-portfolio--published) | `/?path=/story/pages-engineer-portfolio--published` | Compare the standard Engineer preview.                                              | The standard Engineer layout uses its existing hero.                                                    | Passed in Storybook. The existing orbit was present and the featured work panel was absent.                              |

Return to the [manual testing index](index.md).
