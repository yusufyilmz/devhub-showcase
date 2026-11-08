# PDF settings and ATS layouts — task 27

**Scope/status:** Implemented; ATS compatibility is not guaranteed.

**Prerequisites:** Use a long fictional career with Unicode names, links and several pages.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                            | Route path           | Action                                                                                                            | Expected result                                                                                             | Actual result / evidence |
| ---- | -------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | Open PDF; choose ATS-friendly, then ATS-friendly compact and inspect page/text/inclusion options.                 | Both ATS layouts are available beside the existing layouts; settings remain independent of website layout.  | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | Save the draft and use Download my saved CV.                                                                      | The PDF uses saved values and selected settings, not unsaved changes.                                       | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/cv.pdf) | `/test-owner/cv.pdf` | After separate publication, download the public CV and copy its text into a text editor.                          | Text is selectable in a sensible one-column reading order with headings, links and expected career entries. | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner/edit)   | `/test-owner/edit`   | Exclude a contact field or content group, save and compare private/public output at the proper publication stage. | Only the intended output choices change; no automatic replacement of the published CV occurs.               | Not run                  |

## Related evidence and detail

- [docs/testing/portfolio-presentation.md](../../../docs/testing/portfolio-presentation.md)
- [e2e/edit/portfolio-types.spec.ts](../../../apps/my-dev-studio/e2e/edit/portfolio-types.spec.ts)

Return to the [manual testing index](index.md).

## Source reorganization checks

PDF preparation and rendering now live in `packages/templates/src/cv/`, with separate data, definition and render modules. ATS content and section-order tests are colocated. Studio CV import/review and settings controls live under `src/studio/import/` and `src/studio/settings/`. Template types live in `src/types/cv-template.d.ts`. The existing public package entry points are retained.

Run `pnpm --filter @shared/templates typecheck`, `pnpm check:exports` and `pnpm exec vitest run --project unit packages/templates apps/my-dev-studio/app/cv.pdf/route.test.ts tools/cli/generators/config.test.ts`. These local checks cover language/layout PDF output, ATS exclusions, section ordering, public consumers and generator behavior. Re-run the manual steps above against the matching preview when verifying rendered PDF appearance and editor interactions; automated success does not establish a manual or deployed pass.
