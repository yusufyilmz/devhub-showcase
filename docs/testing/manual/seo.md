# Published branding, metadata and private/missing responses

**Scope/status:** Implemented.

**Prerequisites:** Set the disposable preview canonical origin correctly.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                                      | Route path                     | Action                                                                                         | Expected result                                                                                             | Actual result / evidence |
| ---- | ------------------------------------------------------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner)                  | `/test-owner`                  | Inspect title, description, canonical link, Open Graph, locale and structured data.            | They derive from permitted published identity and the platform URL, not an external personal website.       | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/icon.svg)         | `/test-owner/icon.svg`         | Open the icon and share.png; check name/initials, role, accent and the share image dimensions. | Branding matches the published profile; share image is 1200×630 and does not fetch arbitrary profile media. | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/missing-portfolio/share.png) | `/missing-portfolio/share.png` | Repeat page/asset requests for private and missing usernames, including while signed in.       | No private content or fallback person appears.                                                              | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/sitemap.xml)                 | `/sitemap.xml`                 | Compare published, withdrawn and unlisted records; inspect robots.txt as well.                 | Only currently discoverable profiles are listed; crawler rules do not replace server authorization.         | Not run                  |

## Related evidence and detail

- [e2e/portfolio/seo.spec.ts](../../../apps/my-dev-studio/e2e/portfolio/seo.spec.ts)
- [e2e/home/seo.spec.ts](../../../apps/my-dev-studio/e2e/home/seo.spec.ts)

Return to the [manual testing index](index.md).
