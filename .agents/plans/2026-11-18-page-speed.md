# Page speed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut Studio page time by loading each signed-in workspace once per request and by keeping unused portfolio sections out of the homepage and editor bundles.

**Architecture:** The root layout, the page, and the proxy each talk to Supabase on their own. Share the workspace lookup with React `cache` for one request, and skip the published-profile read on Studio routes that never render it. Split the homepage and editor off the `@shared/ui/sections` barrel so a route compiles only the modules it renders. Leave production deploys and the webpack dev script alone.

**Tech Stack:** Next.js 16.4 App Router, React `cache`, Vitest unit project, pnpm workspace exports.

**Spec:** Findings in this file. Measured on the local Studio server (`next dev --webpack --port=3001`) on 2026-11-18.

## Findings

Warm and cold timings from the running dev server:

| Request                                                        | Total      | Application code     | Notes                    |
| -------------------------------------------------------------- | ---------- | -------------------- | ------------------------ |
| `GET /` first compile                                          | 3.0s       | 2.2s                 | `proxy.ts` 397ms         |
| `GET /` after the worker crash                                 | 3.7s       | 3.5s                 | `proxy.ts` 111ms         |
| `GET /:username/edit` first compile                            | 5.4s       | included in the 5.4s | `proxy.ts` 143ms         |
| `GET /:username/edit` after the crash                          | 9.0s       | 2.8s                 | `next.js` 6.1s recompile |
| Later `/api/account-preferences` and `/api/companion-progress` | ~220–250ms | ~90–105ms            | Acceptable once compiled |

`proxy.ts` calls `updateSession`, which always calls `supabase.auth.getUser()`.

Homepage (`app/page.tsx`) is a platform route, so the layout skips `getActiveProfile`. It still does this:

1. `getHomeAction`: new server client, `getUser()`, then `readOwnedProfileUsername`.
2. In parallel, `getHomeExample`: `readPublicProfile("main")`.
3. After both finish, `getAccountMenu` calls `requirePortfolioAdmin`: another client, another `getUser()`, then `isPortfolioAdmin`.

`app/page.tsx` imports `HomePage` from `@shared/ui/sections`. That barrel re-exports every portfolio section, so the homepage module graph includes sections the homepage does not render. The same barrel is imported by `packages/assistant/src/components/studio/workspace/profile-editor.tsx`.

Editor (`/[username]/edit`):

- The layout treats `/studio` and `/:username/edit` as workspace routes and calls `requireWorkspace()` plus `repository.read()`.
- The page calls `requireWorkspace()` and `repository.read()` again. `requireWorkspace` is not wrapped in `cache`, so the request does not share the first result.
- One `requireWorkspace` is `getUser`, `ensureUserProfile` (select by owner), `requireOwner` (select by id and owner), then `read()` (select the document). The editor does that twice. `/studio` does it in the layout and again in the page before redirecting to edit, which does it a third time.
- Routes that are not in `isPlatformPath` and are not a single-segment username, including `/studio/jobs`, `/studio/billing`, `/studio/trello`, `/studio/calendar`, and `/reviews`, fall through to `getPublishedProfile()` in the root layout.
- The editor statically imports section editors from `@shared/ui/sections` and studio pieces from `packages/assistant/src/components/portfolio/index.ts`. That portfolio barrel also exports the jobs dashboard, published page, and registered sections. Only `PreviewContent` is loaded with `next/dynamic`. Tab bodies render only the active tab, so the other editors can be dynamic imports.
- `profile-editor.tsx` imports `SectionsSettings` through a relative path into `packages/ui/src`. That crosses the package boundary.

A missing `.next/dev/server/vendor-chunks/lib/worker.js` module crashed the dev worker and forced the 6.1s recompile. That crash is separate from the 2–3.5s of application code. Do not switch the dev script off `--webpack` in this plan. `next.config.mjs` has a webpack Handlebars alias, and the app skill requires `next dev --webpack`.

## Global Constraints

- Node 24.15 or newer, below 25. pnpm 11. Install with `pnpm install --frozen-lockfile`.
- Package exports stay at one or two segments. No deep keys such as `@shared/ui/sections/home-page/HomePage`.
- App code imports `@shared/ui/...` and `@shared/assistant/...`. Do not add another relative import from `packages/assistant` into `packages/ui/src`.
- A client-supplied username is not authority. An edit URL for someone else's CV stays a 404. A missing session redirects to `/login`.
- A public homepage visit must not create a portfolio.
- Generated catalogs are not hand-edited. After an export change, run `pnpm generate:catalogs` and `pnpm check:catalogs`.
- Colocate unit tests. Run them with `pnpm exec vitest run --project unit <file>`.

## Review Focus

- A signed-out homepage visitor still gets the guest action and no portfolio insert.
- An owner opening another username's `/edit` still gets a 404, including when that CV is public.
- `/studio/jobs` and `/reviews` do not call `getPublishedProfile` during layout.
- The editor still receives the owner's snapshot, and the reviews tab still loads only when the snapshot id is `main` and `tab=reviews`.
- The first editor paint is the requested tab (`Profile`, `Sections`, or `Reviews`) without waiting for Import, AI, or Appearance modules.
- A portfolio section page that imports `AboutSection` from `@shared/ui/sections` still compiles. The barrel stays for those callers.

---

### Task 1: One workspace read per request

**Implementation status (2026-11-20):** The `fix/studio-workspace-request-cache-20261120` branch adds request-local caching for the workspace and its snapshot, skips unnecessary published-profile reads on Studio and reviews routes, and adds regression tests for owner-only editing, redirects, and route classification. Verification remains pending CI. The existing `/[username]/chat` and `/[username]/access` platform-path behavior is intentionally preserved instead of changing it as suggested in Step 5; changing that behavior requires a separate public-profile route review.

**Files:**

- Modify: `apps/my-dev-studio/services/admin/get-auth.ts`
- Modify: `apps/my-dev-studio/app/layout.tsx`
- Modify: `apps/my-dev-studio/app/[username]/edit/page.tsx`
- Modify: `apps/my-dev-studio/app/studio/page.tsx`
- Modify: `apps/my-dev-studio/services/site/get-site.ts`
- Test: `apps/my-dev-studio/services/admin/get-auth.test.ts`
- Test: `apps/my-dev-studio/services/site/get-site.test.ts`
- Test: `apps/my-dev-studio/app/[username]/edit/page.test.tsx`

**Interfaces:**

- Consumes: existing `requireWorkspace(providedClient?: SupabaseDbClient)` return `{ client, repository, service, user }`.
- Produces: `requireWorkspace` wrapped in `cache` from `react`. Same arguments in one request return the same promise. `readWorkspaceSnapshot()` returns `Promise<ProfileSnapshot | null>` and calls `repository.read()` once per request. `isPlatformPath` returns true for `/studio`, `/studio/*`, and `/reviews` as well as the paths it already accepts. `/:username/edit` stays false so the layout still loads the workspace there.

- [ ] **Step 1: Write the failing auth cache test**

Create `apps/my-dev-studio/services/admin/get-auth.test.ts`. Mock `@shared/auth` `requireConfirmedUser`, `@shared/lib/supabase` `createServerClient`, `@shared/lib/user-profile` `ensureUserProfile`, and `ProfileService` so `requireOwner` resolves. Call `requireWorkspace()` twice with no argument. Assert `createServerClient` and `ensureUserProfile` each ran once.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run --project unit apps/my-dev-studio/services/admin/get-auth.test.ts`

Expected: FAIL because the second call creates another client.

- [ ] **Step 3: Cache `requireWorkspace` and add `readWorkspaceSnapshot`**

In `services/admin/get-auth.ts`, wrap the existing `requireWorkspace` function in `cache`. Add:

```ts
export const readWorkspaceSnapshot = cache(async () => {
  const { repository } = await requireWorkspace();
  return repository.read();
});
```

`requireAdmin` stays uncached. It is a different authorization check.

- [ ] **Step 4: Run the auth test to verify it passes**

Run: `pnpm exec vitest run --project unit apps/my-dev-studio/services/admin/get-auth.test.ts`

Expected: PASS.

- [ ] **Step 5: Write the failing platform-path test**

Create `apps/my-dev-studio/services/site/get-site.test.ts`. Assert `isPlatformPath` is true for `/`, `/login`, `/studio`, `/studio/jobs`, `/studio/billing`, `/studio/trello`, `/studio/calendar`, `/reviews`, and `/p/examples/maya-chen`. Assert it is false for `/ada/edit`, `/ada`, and `/ada/chat`.

- [ ] **Step 6: Run the platform-path test to verify it fails**

Run: `pnpm exec vitest run --project unit apps/my-dev-studio/services/site/get-site.test.ts`

Expected: FAIL on `/studio/jobs` and `/reviews`.

- [ ] **Step 7: Treat Studio shell routes as platform paths**

In `services/site/get-site.ts`, extend `isPlatformPath` so `path === "/studio"`, `path.startsWith("/studio/")`, and `path === "/reviews"` return true. Keep `/:username/edit` false.

In `layout.tsx`, replace the `/studio` and `/:username/edit` branch of `getActiveProfile` with a call to `readWorkspaceSnapshot()` only when the path matches `/^\/[^/]+\/edit$/`. `/studio` no longer needs that branch because it is a platform path and the page redirects.

In `app/studio/page.tsx` and `app/[username]/edit/page.tsx`, replace the local `requireWorkspace` plus `repository.read()` pair with `readWorkspaceSnapshot()`. The edit page still needs `requireWorkspace()` for `workspace.user` and `workspace.client`. Because both functions share the cached `requireWorkspace`, that must not create a second client. Keep the username mismatch `notFound()`, the login redirect, and the `tab=reviews` review load.

- [ ] **Step 8: Update the edit page test and run the affected unit tests**

The edit page test mocks `requireWorkspace` only. Mock `readWorkspaceSnapshot` from the same module so the snapshot comes from that mock, and keep the existing redirect, 404, and owner assertions.

Run:

```sh
pnpm exec vitest run --project unit apps/my-dev-studio/services/admin/get-auth.test.ts apps/my-dev-studio/services/site/get-site.test.ts apps/my-dev-studio/app/[username]/edit/page.test.tsx apps/my-dev-studio/app/studio/page.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add apps/my-dev-studio/services/admin/get-auth.ts apps/my-dev-studio/services/admin/get-auth.test.ts apps/my-dev-studio/app/layout.tsx apps/my-dev-studio/services/site/get-site.ts apps/my-dev-studio/services/site/get-site.test.ts apps/my-dev-studio/app/studio/page.tsx apps/my-dev-studio/app/[username]/edit/page.tsx apps/my-dev-studio/app/[username]/edit/page.test.tsx
git commit -m "fix: load the studio workspace once per request"
```

### Task 2: One session read on the homepage

**Implementation progress (2026-11-20):** [`fix/home-session-menu-20261120`](https://github.com/yusufyilmz/devhub-showcase/tree/fix/home-session-menu-20261120) extracts a request-cached `getHomeSession`, reuses its verified Supabase client for the menu's administrator check, and adds focused regression tests. The public `PageAction` does not contain the client. Tests and typechecks must still be executed in a workspace checkout or PR CI before the verification steps are checked off. No live account was used.

**Files:**

- Modify: `apps/my-dev-studio/services/home/get-home-links.ts`
- Modify: `apps/my-dev-studio/services/home/get-account-menu.tsx`
- Modify: `apps/my-dev-studio/app/page.tsx`
- Test: `apps/my-dev-studio/services/home/get-home-links.test.ts`
- Test: `apps/my-dev-studio/services/home/get-account-menu.test.tsx`

**Interfaces:**

- Consumes: `getHomeAction` and `getHomeExample` from Task 1's unchanged guest behavior.
- Produces: `getHomeAction` still returns `PageAction & { username?: string }`. It uses one `getUser()` per request. `getAccountMenu({ action })` uses that action and does not call `getUser()` again when `action.signedIn` is false. When `action.signedIn` is true it checks `isPortfolioAdmin` with the server client already created for the action, passed as an optional argument `client` on an internal helper. Do not put the Supabase client on the `PageAction` object that reaches client components.

- [ ] **Step 1: Extend the home-link test**

In `services/home/get-home-links.test.ts`, add a case where `getUser` returns a confirmed user and `readOwnedProfileUsername` returns `{ data: { username: "alice" }, error: null }`. Call `getHomeAction()` twice. Assert `getUser` ran once. Keep the existing visitor test that expects no portfolio lookup.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run --project unit apps/my-dev-studio/services/home/get-home-links.test.ts`

Expected: FAIL because the second call hits `getUser` again. `getHomeAction` is already wrapped in `cache`, so if the test fails for another reason, reset modules between calls only in the new test and assert the uncached helper. If `cache` already dedupes inside one test, assert a single `getUser` when `getHomeAction` and a new exported `getHomeSession()` used by the account menu run together. Export `getHomeSession` from `services/home/get-home-links.ts` as the cached function that returns `{ action, client }`. `getHomeAction` returns `session.action` only.

- [ ] **Step 3: Implement `getHomeSession`**

Move the body of `getHomeAction` into `export const getHomeSession = cache(async () => ...)`. Return `{ action, client }` where `client` is `null` for the guest and error paths. `getHomeAction` returns `(await getHomeSession()).action`.

In `getAccountMenu`, when the action is signed out, return `null` without calling `requirePortfolioAdmin`. When it is signed in, call a new `portfolioAdminStatus(client)` in `managed-portfolios.ts` that takes the existing client, uses the confirmed user only to call `isPortfolioAdmin(client)`, and returns `null` on `ProfileAccessError`. Do not call `createServerClient` or `requireConfirmedUser` on this path.

In `app/page.tsx`, keep `getHomeExample` in parallel with `getHomeAction`. The account menu then runs with the action already in hand and must not start another auth request.

- [ ] **Step 4: Update the account-menu test**

In `services/home/get-account-menu.test.tsx`, a signed-out action must not call `requirePortfolioAdmin`. A signed-in action still receives the admin flags from the admin mock.

- [ ] **Step 5: Run the homepage unit tests**

Run:

```sh
pnpm exec vitest run --project unit apps/my-dev-studio/services/home/get-home-links.test.ts apps/my-dev-studio/services/home/get-account-menu.test.tsx apps/my-dev-studio/app/page.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/my-dev-studio/services/home/get-home-links.ts apps/my-dev-studio/services/home/get-home-links.test.ts apps/my-dev-studio/services/home/get-account-menu.tsx apps/my-dev-studio/services/home/get-account-menu.test.tsx apps/my-dev-studio/app/page.tsx apps/my-dev-studio/services/management/get-portfolios.ts
git commit -m "fix: reuse the homepage session for the account menu"
```

### Task 3: Import the homepage without the section barrel

**Files:**

- Modify: `packages/ui/package.json`
- Modify: `apps/my-dev-studio/app/page.tsx`
- Modify: every Studio caller that only needs `HomePage` or `PageAction` from `@shared/ui/sections`
- Test: `packages/ui/src/sections/home-page/HomePage.test.tsx` if a render test already covers the home page; otherwise add an export test beside the package, `packages/ui/src/sections/home-page/entry.test.ts`

**Interfaces:**

- Consumes: `HomePage` in `packages/ui/src/sections/home-page/HomePage.tsx`.
- Produces: package export `@shared/ui/home-page` pointing at `./src/sections/home-page/HomePage.tsx`. `PageAction` stays available from `@shared/ui/sections` and from the home-section module. Callers that need `HomePage` import `@shared/ui/home-page`. The `@shared/ui/sections` barrel still exports `HomePage` for existing section callers.

- [ ] **Step 1: Write the failing export test**

Add `packages/ui/src/sections/home-page/entry.test.ts`. Read `packages/ui/package.json` and assert `exports["./home-page"]` equals `"./src/sections/home-page/HomePage.tsx"`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run --project unit packages/ui/src/sections/home-page/entry.test.ts`

Expected: FAIL because the export is missing.

- [ ] **Step 3: Add the export and switch the homepage import**

Add `"./home-page": "./src/sections/home-page/HomePage.tsx"` to `packages/ui/package.json` `exports`. In `apps/my-dev-studio/app/page.tsx`, import `HomePage` from `@shared/ui/home-page`. Leave `PageAction` imports that are type-only on `@shared/ui/sections` until a typecheck error says the barrel is still pulled into the page. If it is, move the `PageAction` type import to `@shared/ui/home-page` and re-export the type from `HomePage.tsx`.

Run `pnpm generate:catalogs` and `pnpm check:catalogs`.

- [ ] **Step 4: Run the unit test and typecheck the app**

Run:

```sh
pnpm exec vitest run --project unit packages/ui/src/sections/home-page/entry.test.ts apps/my-dev-studio/app/page.test.tsx
pnpm --filter my-dev-studio typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/package.json packages/ui/src/sections/home-page/entry.test.ts packages/ui/CATALOG.md apps/my-dev-studio/app/page.tsx
git commit -m "fix: load the homepage without the section barrel"
```

### Task 4: Load editor tabs on demand

**Files:**

- Modify: `packages/assistant/package.json`
- Modify: `packages/ui/package.json`
- Modify: `packages/assistant/src/components/studio/workspace/profile-editor.tsx`
- Modify: `packages/assistant/src/components/portfolio/index.ts` only if a symbol must move to a direct file import
- Test: `packages/assistant/src/components/studio/workspace/profile-editor.test.tsx`

**Interfaces:**

- Consumes: the tab names already in `profile-editor.tsx`: `Profile`, `Sections`, `Reviews`, and the later tabs through `Appearance`.
- Produces: `@shared/ui/section-editors` exporting `CustomSectionsEditor`, `EducationEditor`, `ExperienceEditor`, `LanguagesEditor`, `ProjectsEditor`, `SectionOrderEditor`, `SectionSettingsEditor`, `SectionTemplatesEditor`, `SkillsEditor`, and `SectionsSettings`. `@shared/assistant/studio-editors` is not required. The editor file imports those editors with `next/dynamic` except the modules needed for the initial `Profile` tab: `ProfileFields`, `EditorWorkspace`, `StudioHeading`, and the publication controls that the Profile tab renders. `Sections` and `Reviews` may stay static because the edit page can open them on first paint. Every other tab body is a dynamic import. The relative import of `SectionsSettings` from `packages/ui/src` is removed.

- [ ] **Step 1: Write the failing editor import test**

In the existing profile editor test, or a new colocated test if none asserts the module source, read `profile-editor.tsx` as text and assert it does not contain `@shared/ui/sections` or `packages/ui/src`. Assert it does contain `next/dynamic` for `CvImportEditor`, `AiProfileEditor`, `AiAssistantEditor`, and `AppearanceEditor`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run --project unit packages/assistant/src/components/studio/workspace/profile-editor.test.tsx`

Expected: FAIL on the barrel import.

- [ ] **Step 3: Add `@shared/ui/section-editors` and split the editor imports**

Point the new export at a new file `packages/ui/src/sections/studio/editors.ts` that re-exports only the editor components listed in Interfaces. Those source files may keep importing what they need. `profile-editor.tsx` imports the Profile-tab modules from their direct files under `packages/assistant/src/components/portfolio/`, not from `portfolio/index.ts`. Load the other tab components with `dynamic(() => import("...").then((module) => module.Name))`. Give each dynamic component a `null` loading state so the shell stays visible.

Run `pnpm generate:catalogs` and `pnpm check:catalogs`.

- [ ] **Step 4: Run the editor tests and typecheck**

Run:

```sh
pnpm exec vitest run --project unit packages/assistant/src/components/studio/workspace/profile-editor.test.tsx
pnpm --filter @shared/assistant typecheck
pnpm --filter my-dev-studio typecheck
```

Expected: PASS.

- [ ] **Step 5: Check the dev server timings**

With `pnpm --filter my-dev-studio dev` already running, reload `/` and an owner `/edit` route. Record the `application-code` milliseconds from the terminal. The homepage application code should be below the measured 2.2s, and the editor application code should be below the measured 2.8s. If either is not, stop and report the new line. Do not tune further in this task.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/package.json packages/ui/src/sections/studio/editors.ts packages/ui/CATALOG.md packages/assistant/src/components/studio/workspace/profile-editor.tsx packages/assistant/src/components/studio/workspace/profile-editor.test.tsx packages/assistant/CATALOG.md
git commit -m "fix: load studio editor tabs on demand"
```

## Out of scope

- Removing `supabase.auth.getUser()` from `packages/auth/src/middleware.ts`. The proxy still refreshes the session. It costs about 100–400ms and stays until a later change can prove cookie refresh still works.
- Replacing `next dev --webpack`. The Handlebars webpack alias and the app skill depend on it.
- Hunting `.next/dev/server/vendor-chunks/lib/worker.js` unless it still crashes after Task 4. If it does, find the package that imports `lib/worker.js` and either externalize it or stop importing it from the editor graph. Do not delete `.next` as the fix.
