# Sign-in, owner workspace and access boundaries

**Scope/status:** Implemented; live OAuth needs provider configuration.

**Prerequisites:** Use two disposable confirmed accounts and a signed-out browser.

Use the [shared setup and result rules](index.md#before-you-start). Replace `test-owner`, `old-owner`, `other-owner` and `PROFILE_ID` with your disposable records. For app links replace `mydevstudio.vercel.app` with the matching preview; keep GitHub and local Storybook URLs as written. Editor tabs share the editor URL; they are not separate routes.

**Manual result:** Not run. Record the preview/commit, tester/date, actual results and evidence when executing this guide. Automated checks are separate evidence.

| Step | Clickable URL                                                  | Route path           | Action                                                                                      | Expected result                                                                                                                           | Actual result / evidence |
| ---- | -------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open](https://mydevstudio.vercel.app/admin)                   | `/admin`             | Open signed out, then follow the sign-in flow.                                              | Private content is not exposed before authentication.                                                                                     | Not run                  |
| 2    | [Open](https://mydevstudio.vercel.app/login)                   | `/login`             | Sign in with the first test account; enter its editor through /admin.                       | The editor belongs to that account; a new workspace does not copy another person's content.                                               | Not run                  |
| 3    | [Open](https://mydevstudio.vercel.app/test-owner/edit)         | `/test-owner/edit`   | Try the first account's editor from the second account and from the signed-out browser.     | Access is denied or redirected safely; no draft or private download is exposed.                                                           | Not run                  |
| 4    | [Open](https://mydevstudio.vercel.app/missing-portfolio)       | `/missing-portfolio` | Open an unknown username and a known private test username.                                 | Both remain unavailable publicly; there is no fallback to the site owner's portfolio.                                                     | Not run                  |
| 5    | [Open MyDevStudio login](https://mydevstudio.vercel.app/login) | `/login`             | Open the signed-out page on desktop, repeat with reduced motion, then use a phone viewport. | The right panel’s glow and lock icon animate once on desktop. Reduced motion shows a static panel. The sign-in form is visible on mobile. | Not run                  |

## Related evidence and detail

- [e2e/admin/login/login.spec.ts](../../../apps/my-dev-studio/e2e/admin/login/login.spec.ts)
- [e2e/portfolio/missing.spec.ts](../../../apps/my-dev-studio/e2e/portfolio/missing.spec.ts)

Return to the [manual testing index](index.md).
