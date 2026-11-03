# Fresh Next.js build and CI regression — task 04 support

**Scope/status:** Build fix shipped in PR #84; production verification is separate.

**Prerequisites:** Use the linked PR and a local checkout if reproducing the build.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                                                  | Route path                                             | Action                                                                         | Expected result                                                                                                | Actual result / evidence |
| ---- | ------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://github.com/yusufyilmz/devhub-showcase/actions/runs/41690690659) | `/yusufyilmz/devhub-showcase/actions/runs/41690690659` | Open Verify and inspect code checks, tests, Storybook and workspace build.     | The corrected run succeeds; the profile GET handler uses a required Request parameter.                         | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/api/profile?knowledge=1)                 | `/api/profile?knowledge=1`                             | Open as the disposable owner, then signed out.                                 | The owner receives its own saved/public knowledge view; signed-out access fails.                               | Not run                  |
| 3    | [Open](https://github.com/yusufyilmz/devhub-showcase/actions)                  | `/yusufyilmz/devhub-showcase/actions`                  | Inspect a PR run versus a push to main without triggering a production action. | PR verification does not deploy production; browser CI runs only on main pushes and does not block deployment. | Not run                  |

## Related evidence and detail

- [apps/my-dev-studio/app/api/profile/route.test.ts](../../../apps/my-dev-studio/app/api/profile/route.test.ts)
- [.github/workflows/ci.yml](../../../.github/workflows/ci.yml)

Return to the [manual testing index](index.md).
