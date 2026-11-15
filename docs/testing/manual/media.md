# Hero media, YouTube and curated social cards — task 30

**Scope/status:** Implemented; remote providers can be blocked.

**Prerequisites:** Use approved public test media and fictional captions.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                             | Expected result                                                                                                                      | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Configure a hero image/video with poster, overlay and playback settings; preview and save.         | The media and readable text fit the chosen composition; failed media retains usable content.                                         | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner)      | `/test-owner`      | After separate publication, enable reduced motion and reload.                                      | Automatic video motion pauses; the poster/text remain usable.                                                                        | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner)      | `/test-owner`      | Open a YouTube section and activate its load control; block playback and follow the original link. | No embedded player loads before activation; the original link remains available during errors.                                       | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner)      | `/test-owner`      | Inspect Instagram/Pinterest cards and change a media source.                                       | Curated links open the original content; no automatic social feed/scripts are added and a new source requires fresh loading consent. | Not run                  |

## Related evidence and detail

- [e2e/edit/media-sections.spec.ts](../../../apps/my-dev-studio/e2e/edit/media-sections.spec.ts)
- [e2e/portfolio/media-sections.spec.ts](../../../apps/my-dev-studio/e2e/portfolio/media-sections.spec.ts)

Return to the [manual testing index](index.md).
