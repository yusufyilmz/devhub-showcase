# Publishing policies — work in progress

This draft group covers roadmap tasks 14 (username redirects), 15 (visibility) and 16 (scheduled publishing). It builds on PR #84. Only the redirect portion is implemented at this checkpoint. Password/unlisted visibility and scheduling are not implemented or ready to deploy. Keep the group in draft until all acceptance criteria are verified.

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

- Public/unlisted/password-protected policy, including discovery, metadata, downloads, alternate routes, access verification expiry and revocation.
- Explicitly reviewed immutable scheduled snapshots, timezone display/conversion, cancellation/replacement, idempotent execution, retry/failure recovery and authorization-change handling.
- Complete group regression and configuration/rollout instructions.

## Redirect checkpoint verification

`pnpm check`, 480 unit tests (447 shared/app and 33 fitness), the app production build, and eight focused desktop/mobile browser tests passed. The focused browser cases cover repeated renames across page/CV/icon/share-image routes, withdrawal, missing destinations and canonical branding/metadata. Local PGlite tests execute alias guards, retention, collision denial and account cleanup. This is checkpoint evidence for redirects; it does not verify the remaining visibility or scheduling work.
