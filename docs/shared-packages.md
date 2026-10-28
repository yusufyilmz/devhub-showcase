# Shared packages and future apps

The monorepo keeps reusable infrastructure separate from portfolio features:

| Package              | Responsibility                                                                                           | Must not depend on                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `@shared/auth`       | Supabase browser/server clients, verified identity, session refresh, Google/password/logout handlers     | Portfolio documents, repositories, UI, app routes         |
| `@shared/components` | Cards, reveal cards, buttons, timeline, fields, collection editor, login panel, studio shell, shared CSS | Auth clients, database tables, portfolio content, Next.js |
| `@shared/lib`        | Portfolio schemas, repositories, ownership and provisioning                                              | Application route implementations                         |
| `@shared/ui`         | Existing portfolio sections and MUI theme adapter; compatibility exports for moved components            | Application route implementations                         |
| `apps/web`           | Portfolio routes, page content and auth configuration                                                    | Other apps                                                |

Authentication verifies identity. Application guards and database policies still authorize access. The portfolio's `requireWorkspace` and main-owner review moderation stay in the portfolio app. They are not part of generic sign in and must not be reused to authorize workouts.

## Authentication in another Next.js app

Add `@shared/auth` and `@shared/components` as `workspace:*` dependencies. Keep external versions in the workspace catalog. Add both packages to the app's `transpilePackages`.

Create typed Supabase clients using `@shared/auth/client` in browser code and `@shared/auth/server` on the server. The server factory reads Next.js cookies; `@shared/auth/middleware` exports `updateSession` for `proxy.ts`. These entrypoints remain separate so browser code does not import Next.js server APIs. Each app supplies its own Supabase URL and public key environment variables. No service-role key is used.

For example, a future fitness app could configure handlers as follows:

```ts
import { createClient } from '@shared/auth/server'
import { createAuthHandlers } from '@shared/auth/handlers'

export const auth = createAuthHandlers({
  createClient: () => createClient(), // Provide the fitness Database generic when available.
  loginPath: '/login',
  successPath: '/dashboard',
  callbackPath: '/auth/callback',
  afterSignIn: async (client) => {
    // Optional fitness provisioning, using only the verified account.
    // Keep workout ownership checks and database RLS in the fitness domain.
  }
})
```

Route files export `auth.google` as POST, `auth.callback` as GET, `auth.signIn` as POST and `auth.signOut` as DELETE at the app's chosen paths. Mutating endpoints check the request Origin. Return paths come from server configuration, not query parameters or forwarded host headers. Both password and OAuth completion verify the user before application provisioning; failed verification/provisioning clears the local session.

Use `requireConfirmedUser(client)` from `@shared/auth` for protected server operations. Session-refresh middleware alone is not an authorization guard. Apply app-specific ownership checks and database RLS for every private resource.

Register each app's callback in Supabase and its origin in Google. Sharing auth code does not automatically share cookies across different domains. Whether future apps share one identity database or use separate Supabase projects is an explicit app configuration choice; this refactor does not change account/session scope.

## Components in another app

Import `@shared/components/styles.css` once at the app root and include `packages/components/src/**/*.{js,ts,jsx,tsx}` in the app's Tailwind content paths. Existing portfolio consumers can continue importing `@shared/ui/globals.css`; it includes the shared stylesheet. The CSS supplies the existing design tokens, form and card treatments, responsive behavior and reduced-motion rules. Set `data-theme` and `data-accent` on the root to use the existing themes. Apps can override tokens and provide their own fonts.

Use narrow entrypoints when possible:

```tsx
import { LoginPanel } from '@shared/components/login'
import { RevealCard } from '@shared/components/cards'
import { CollectionEditor } from '@shared/components/collection-editor'
import { Field } from '@shared/components/fields'

;<LoginPanel
  title="Your fitness account"
  description="Keep your training in sync."
  googleAction="/api/auth/google"
  sessionEndpoint="/api/auth/session"
  successPath="/dashboard"
/>
```

The login panel takes copy, form endpoints and destinations as props. It has no portfolio API paths. `CollectionEditor` is controlled, generic over items with an ID, and delegates persistence to the consuming app. Tests exercise it with workout data. Portfolio career/PDF editors remain application features.

Cards, buttons and timeline remain available through the older `@shared/ui/components` imports as compatibility reexports; they have one implementation in `@shared/components`. Existing hover, keyboard, touch and reduced-motion behavior is retained.

## Validation and adding an app

`pnpm check`, `pnpm test`, `pnpm typecheck` and `pnpm build` include the new packages through the workspace/Turbo configuration. Tests cover the auth handlers with a second app's routes, invalid origins, unconfirmed identity, failed provisioning, password errors and session cleanup. Components tests use independent login routes and workout models, alongside the existing portfolio/card and RLS tests.

No Fitness app has been migrated in this change. When adding `apps/fitness`, give it its own Next.js configuration, scripts, deployment/environment scope and fitness data policies. Reuse the shared packages, then verify a complete sign in and private-data flow for that app.
