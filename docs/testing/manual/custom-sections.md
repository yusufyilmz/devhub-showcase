# Custom section catalog and rich compositions

**Scope/status:** Implemented.

**Prerequisites:** Use a disposable profile and representative gallery, chart/stat, map, carousel, accordion and tab sections.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                          | Route path         | Action                                                                                            | Expected result                                                                                                            | Actual result / evidence |
| ---- | ------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Open Custom sections; choose a Section starter, add a section and add fictional items.            | The selected family exposes appropriate fields and a compatible presentation.                                              | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Duplicate a section, change the copy, bind another to profile content, and hide/remove a section. | Copies have independent identities; source bindings use permitted records; hidden/removed content disappears from preview. | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit` | Test carousel buttons, tab arrows, accordion summaries, map links and long/empty content.         | Interactions are accessible and stable; no invented business numbers or live integrations are implied.                     | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/test-owner)      | `/test-owner`      | Save, review and explicitly publish the disposable profile; compare with preview.                 | Only published allowed content appears, with keyboard/touch behavior and no overflow.                                      | Not run                  |

## Related evidence and detail

The homepage catalog preview uses a lookup for its illustrations. Its unit coverage verifies that every registered section has a nonempty preview, in addition to reveal, category and search behavior. This refactor preserves the rendered controls and layout; browser verification remains Not run.

- [e2e/edit/custom-sections.spec.ts](../../../apps/my-dev-studio/e2e/edit/custom-sections.spec.ts)
- [e2e/portfolio/section-library.spec.ts](../../../apps/my-dev-studio/e2e/portfolio/section-library.spec.ts)

Return to the [manual testing index](index.md).
