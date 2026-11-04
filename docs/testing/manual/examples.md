# Server-rendered fictional portfolios and images

**Scope/status:** Implemented.

**Prerequisites:** No account or database is needed for fictional examples.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                               | Route path              | Action                                                                    | Expected result                                                                                                | Actual result / evidence |
| ---- | ----------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/#examples)            | `/#examples`            | Reload with browser JavaScript disabled, then inspect the example cards.  | Example content and artwork are present in the server response; no client fetch is needed to discover them.    | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/p/examples/lena-park) | `/p/examples/lena-park` | Open the fictional portfolio, follow its sample CV download and return.   | A complete example and PDF load; the page is clearly fictional and requests no indexing.                       | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/#examples)            | `/#examples`            | Try designer, retail, consultant, engineer, trainer and writer audiences. | Examples use different compositions and relevant images; layouts do not all repeat one vertical section stack. | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/p/examples/lena-park) | `/p/examples/lena-park` | Block an example image request and reload.                                | Useful text and navigation remain readable; no unrelated content disappears.                                   | Not run                  |

## Related evidence and detail

- [e2e/examples/examples.spec.ts](../../../e2e/examples/examples.spec.ts)
- [e2e/home/examples.spec.ts](../../../e2e/home/examples.spec.ts)

Return to the [manual testing index](index.md).
