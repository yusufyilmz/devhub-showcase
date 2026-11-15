# MyDevStudio full-page compositions

**Scope/status:** MyDevStudio shared page presentations and full-page
Storybook previews.

**Prerequisites:** Run the local Storybook and use fictional page fixtures.
For protected app routes use a disposable account or the local Playwright
fixture. Use the [shared setup and result rules](index.md#before-you-start).

| Step | Clickable URL                                                                               | Route path                                        | Action                                                                                                  | Expected result                                                                                                          | Actual result / evidence                                                                                     |
| ---- | ------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| 1    | [Home](http://127.0.0.1:6006/?path=/story/pages-home--visitor)                              | `/?path=/story/pages-home--visitor`               | Scroll through the homepage, open a question and select Open sample portfolio.                          | The shared sections run from header through footer and the example link opens the portfolio preview.                     | Chromium verified FAQ expansion and navigation to the sample portfolio.                                      |
| 2    | [Portfolio](http://127.0.0.1:6006/?path=/story/pages-portfolio--designer)                   | `/?path=/story/pages-portfolio--designer`         | Use Work and compare Designer, Minimal, Consultant and Engineer in Pages.                               | The layouts retain their own section styles and anchor navigation.                                                       | Chromium verified all four presentations and the Designer Work anchor.                                       |
| 3    | [Studio](http://127.0.0.1:6006/?path=/story/pages-studio--editor)                           | `/?path=/story/pages-studio--editor`              | Enter a different name and inspect Managed Portfolios and Reviews.                                      | The shell, title hierarchy and footer carry through the studio screens. The editor preview uses an in-memory draft.      | Chromium verified the editor’s in-memory save and rendered all three studio stories.                         |
| 4    | [Billing](http://127.0.0.1:6006/?path=/story/pages-billing--free-plan)                      | `/?path=/story/pages-billing--free-plan`          | Read the test price and account state. Choose Try Pro checkout.                                         | The fixture shows the Free plan. Checkout returns a local error and keeps the preview open.                              | Chromium verified the test price, Free status and the local checkout error.                                  |
| 5    | [Protected portfolio](http://127.0.0.1:6006/?path=/story/pages-protected-portfolio--locked) | `/?path=/story/pages-protected-portfolio--locked` | Enter a fictional password. Check the Sign In, Studio Assistant and Recovery groups on a narrow screen. | The fixtures show access feedback, both chat roles and recovery pages without opening an account or reaching a provider. | Chromium verified access feedback and visitor chat. All 18 stories fit 1280px light and 390px dark canvases. |

Production route checks use [the existing editor](editor-presentation.md),
[homepage](home.md) and [example portfolio](examples.md) guides.

Return to the [manual testing index](index.md).
