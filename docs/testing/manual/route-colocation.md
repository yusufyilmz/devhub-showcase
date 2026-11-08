# App route colocation — manual testing

**Scope/status:** Home, reviews, portfolio, platform and chat feature folders are removed. Single-use bindings are in their pages/route handlers. Root layout/site defaults and bindings shared by a route family use private sibling modules, with tests moved alongside them. Shared domain and UI logic remains in its owning package.

**Prerequisites:** Matching local/preview build, disposable confirmed owner and fictional profiles. Use test provider/database configuration only for signed-in mutations; public example rendering needs no real owner data. Existing authorization, origin checks, revision conflicts, publication/privacy boundaries and caching semantics must remain intact.

**Manual result:** Not run. Automated checks and local smoke evidence are recorded separately.

| Step | Clickable URL                                            | Route path                 | Action                                                                                                        | Expected result                                                                                                     | Actual result / evidence |
| ---- | -------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Homepage](http://localhost:3001/)                       | `/`                        | Open signed out, inspect create/example links, open an example and return.                                    | Homepage composition, profile theme isolation and public links remain available after route colocation.             | Not run                  |
| 2    | [Example](http://localhost:3001/p/examples/avery-morgan) | `/p/examples/avery-morgan` | Open the fictional example and its PDF link.                                                                  | The correct example and CV render; no private owner fallback occurs.                                                | Not run                  |
| 3    | [Editor](http://localhost:3001/test-owner/edit)          | `/test-owner/edit`         | With a disposable owner, save a draft, review pending testimonials and exercise a stale revision in fixtures. | Session/origin checks and revision conflict handling are retained; saves do not publish implicitly.                 | Not run                  |
| 4    | [Reviews](http://localhost:3001/test-owner/review)       | `/test-owner/review`       | Visit as the owner, a different owner and signed out.                                                         | Only the authorized portfolio queue is readable. Unauthorized visitors are rejected before data access.             | Not run                  |
| 5    | [Visitor chat](http://localhost:3001/test-owner/chat)    | `/test-owner/chat`         | Use a published fictional profile and stubbed provider, then try a private/ineligible profile.                | Environment-bound access, publication checks and quotas retain their behavior; private chat context is not exposed. | Not run                  |

Run `pnpm typecheck`, `pnpm test` and `pnpm build:studio`. The moved route/helper tests cover the bindings without live mutations. Browser and deployed verification remain distinct from unit/build results. The root site module is `app/_site.ts`; profile/session helpers are private siblings of username/CV/access routes, and shared publication bindings live beside their API route family.

## Automated evidence

Verified locally on 2026-11-07: 677 unit tests passed across 191 files; all 14 workspace type-check tasks and the Studio production build passed. The review action retains an explicit server-action boundary. After the final public-import cleanup, the five homepage-binding tests also passed.

A Playwright smoke check against the local production build on port 3161 returned HTTP 200 for `/` and `/p/examples/avery-morgan`, with no browser runtime errors or failed local requests. The fictional profile name rendered. Homepage navigation passed at document readiness after an initial network-idle timeout. This does not verify the authenticated mutation checklist or deployed behavior. The temporary server was stopped.
