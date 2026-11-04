# Public/unlisted discovery — partial task 15

**Scope/status:** Implemented checkpoint in draft PR #86; password protection remains unimplemented.

**Prerequisites:** Apply the unlisted migration in a disposable environment; start with a public published portfolio.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                            | Route path           | Action                                                                 | Expected result                                                                                                | Actual result / evidence |
| ---- | -------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | Choose Unlisted under Portfolio discovery and save without publishing. | Existing sitemap inclusion and live indexing policy are unchanged.                                             | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | Review and confirm publication of the unlisted setting.                | The reviewed discovery choice becomes live; unlisted remains accessible by link.                               | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/sitemap.xml)       | `/sitemap.xml`       | Inspect the sitemap and open the unlisted page directly.               | The username is absent from discovery; direct access works and page robots metadata requests noindex/nofollow. | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/cv.pdf) | `/test-owner/cv.pdf` | Download the unlisted CV signed out and inspect headers.               | 200 PDF with noindex/nofollow and private/no-store. This is not password protection.                           | Not run                  |

## Related evidence and detail

- [e2e/edit/publication.spec.ts](../../../e2e/edit/publication.spec.ts)
- [docs/testing/publishing-policies.md](../../../docs/testing/publishing-policies.md)

Return to the [manual testing index](index.md).
