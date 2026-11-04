# Publishing policies — work in progress

This draft group covers roadmap tasks 14 (username redirects), 15 (visibility) and 16 (scheduled publishing). It builds on PR #84. Redirects, public/unlisted discovery and reviewed scheduled snapshots are implemented at this checkpoint. Password-protected access remains unfinished. Scheduled execution requires migration and worker configuration before rollout. Keep the group in draft until all acceptance criteria are verified.

## Retained username rules

Aliases are created from explicitly published usernames when a publication moves to a different username or is withdrawn. Names used only in private drafts do not create aliases. Existing historical names from before this migration are not reconstructed automatically.

An alias belongs to its portfolio for that portfolio's lifetime, including periods of withdrawal and ownership transfer. Another portfolio cannot claim an active public username or retained alias. The same portfolio can reuse its own alias as the canonical name. Account/profile deletion removes its aliases. There is no automatic expiry or public alias-editing endpoint in this version. Existing reserved-name and format rules remain enforced.

Aliases resolve by portfolio ID directly to the current published username, rather than to another alias. Withdrawing publication leaves reservations in place but removes the destination from public resolution. Repeated renames therefore do not create server-side redirect chains. Page, CV, icon and share-image routes preserve the resource suffix when redirecting; canonical metadata uses the current URL. Private documents and account identities are not returned by alias lookup.

`20261103140000_retained_username_aliases.sql` creates the private alias table and namespace guards. A preflight rejects existing collisions between another portfolio's draft username and a published URL rather than silently reassigning ownership. Resolve such collisions explicitly in a disposable environment before rollout. Transactional advisory locks serialize competing namespace claims. The migration has not been applied to production.

The implementation uses the supported [Next.js permanent redirect API](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect). In a streaming render, Next.js can emit a client redirect; route-handler responses use HTTP 308. CV redirect responses explicitly disable caching so future renames do not leave stale intermediate targets.

## Manual redirect verification

Use a disposable migrated account and replace the names/preview hostname. These links identify routes, not a deployed production result.

| Step | Clickable URL                                                         | Route path             | Action                                                               | Expected result                                                                 |
| ---- | --------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1    | [Editor](https://mydevstudio.vercel.app/old-owner/edit)               | `/old-owner/edit`      | Save a new username without publishing.                              | Existing public URL stays unchanged; no alias is created for a draft-only name. |
| 2    | [Editor](https://mydevstudio.vercel.app/new-owner/edit)               | `/new-owner/edit`      | Review and publish the saved rename.                                 | Old public username becomes a retained alias.                                   |
| 3    | [Old page](https://mydevstudio.vercel.app/old-owner)                  | `/old-owner`           | Open the previous name signed out.                                   | Redirects to the current published portfolio; current canonical metadata.       |
| 4    | [Old CV](https://mydevstudio.vercel.app/old-owner/cv.pdf)             | `/old-owner/cv.pdf`    | Request without following redirects.                                 | 308 directly to the current username's CV, with no-store.                       |
| 5    | [Old icon](https://mydevstudio.vercel.app/old-owner/icon.svg)         | `/old-owner/icon.svg`  | Request the prior icon path.                                         | Redirect preserves the icon suffix.                                             |
| 6    | [Old share image](https://mydevstudio.vercel.app/old-owner/share.png) | `/old-owner/share.png` | Request the prior share-image path.                                  | Redirect preserves the share-image suffix.                                      |
| 7    | [Editor](https://mydevstudio.vercel.app/new-owner/edit)               | `/new-owner/edit`      | Rename and publish a second time.                                    | Every retained name resolves directly to the latest published username.         |
| 8    | [Another editor](https://mydevstudio.vercel.app/other-owner/edit)     | `/other-owner/edit`    | Attempt to save an active username, retained alias or reserved name. | Collision/validation failure; no ownership changes.                             |
| 9    | [Editor](https://mydevstudio.vercel.app/new-owner/edit)               | `/new-owner/edit`      | Withdraw the current publication, then retry old links.              | No alias exposes a withdrawn destination; reservations remain.                  |

## Remaining work in this same group

- Password-protected policy across alternate content routes, access verification expiry and revocation.
- Production scheduler configuration and deployed verification of the scheduled-publication checkpoint.
- Complete group regression and configuration/rollout instructions.

## Redirect checkpoint verification

`pnpm check`, 480 unit tests (447 shared/app and 33 fitness), the app production build, and eight focused desktop/mobile browser tests passed. The focused browser cases cover repeated renames across page/CV/icon/share-image routes, withdrawal, missing destinations and canonical branding/metadata. Local PGlite tests execute alias guards, retention, collision denial and account cleanup. This is checkpoint evidence for redirects; it does not verify the remaining visibility or scheduling work.

## Public and unlisted checkpoint

The Field visibility tab now includes Portfolio discovery. Missing values preserve public discovery. Unlisted is still accessible to anyone with its URL; it is not private or password protected. Save and explicitly publish the policy to change live discovery. Saving a later draft does not change the current publication's indexing policy.

`20261103150000_unlisted_publications.sql` derives discovery visibility from each website/CV snapshot. Sitemap reads explicitly select public snapshots only. Unlisted pages use noindex/nofollow metadata, and unlisted CV responses request noindex/nofollow with private/no-store caching. Icon/share-image responses already request no indexing. Search engines and existing downloaded/cached third-party copies are outside application control.

| Step | Clickable URL                                            | Route path           | Action                                                             | Expected result                                               |
| ---- | -------------------------------------------------------- | -------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| 10   | [Editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit`   | Select Unlisted in Field visibility, then save without publishing. | Existing sitemap entry and public policy stay unchanged.      |
| 11   | [Editor](https://mydevstudio.vercel.app/test-owner/edit) | `/test-owner/edit`   | Review and confirm publication of the saved policy.                | The reviewed unlisted snapshot becomes live.                  |
| 12   | [Sitemap](https://mydevstudio.vercel.app/sitemap.xml)    | `/sitemap.xml`       | Inspect after publication.                                         | The unlisted username is absent.                              |
| 13   | [Portfolio](https://mydevstudio.vercel.app/test-owner)   | `/test-owner`        | Open directly while signed out and inspect robots metadata.        | Portfolio remains available by link and requests no indexing. |
| 14   | [CV](https://mydevstudio.vercel.app/test-owner/cv.pdf)   | `/test-owner/cv.pdf` | Download while signed out and inspect response headers.            | 200 PDF with noindex/nofollow and private/no-store.           |

Updated checkpoint verification passed: `pnpm check`, 484 unit tests (451 shared/app and 33 fitness), the app production build, and eight focused desktop/mobile browser cases. The publication browser helper now waits for the current request to finish rather than accepting an earlier visible Published status. At that earlier checkpoint, password protection and scheduling were pending. The scheduling implementation is described below; no production migration has been applied.

## Scheduled publication checkpoint

See the [per-feature scheduled publication guide](manual/scheduled-publication.md) for configuration, ten linked manual test steps and recovery semantics. Schedule creation freezes both projected outputs from the authorized saved revision. Later draft edits do not change the job. Cancel/replacement, immediate publish/withdraw and transfers invalidate pending jobs under a shared lock; execution rechecks authorization and commits both outputs atomically. Dates show the browser timezone and exact UTC instant. Private status exposes only metadata, never frozen documents.

`20261104090000_scheduled_publication.sql` is prepared, not applied to production. Configure server-only `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` and an authenticated recurring worker before relying on due-time publication. No production cron was enabled. Password protection remains unfinished; #86 remains a draft.
