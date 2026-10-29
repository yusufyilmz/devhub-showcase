# Google sign in for CV workspaces

The admin login now offers **Continue with Google** alongside email/password. It uses Supabase SSR cookies and PKCE. Google authenticates the identity; the server verifies the confirmed user and opens only that user’s CV workspace. First sign in creates a private profile owned by that UUID. The original site moderation guard remains separate. This requests basic identity only, with no Gmail mailbox access.

## Activate the provider

1. In [Google Auth Platform](https://console.cloud.google.com/auth/overview), select your project, configure branding/audience, and create an OAuth client of type **Web application**. Use `openid`, email and profile scopes. If the consent app is in testing mode, add your owner Google account as a test user.
2. Add `https://yusufdevhub.vercel.app` as an authorized JavaScript origin. Add `http://localhost:3000` for local development if needed.
3. Add this **Google authorized redirect URI**:

   ```text
   https://quepwjalwkfzxyqhtyby.supabase.co/auth/v1/callback
   ```

4. Open [DevHub Supabase Google provider](https://supabase.com/dashboard/project/quepwjalwkfzxyqhtyby/auth/providers?provider=Google), enable Google, and enter the client ID and client secret there. Do not put the client secret in source code, browser environment variables or chat. Leave nonce/email verification checks enabled.
5. In [Supabase URL Configuration](https://supabase.com/dashboard/project/quepwjalwkfzxyqhtyby/auth/url-configuration), set the production Site URL and allow these application callback URLs:

   ```text
   https://yusufdevhub.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

   Add exact callback URLs for any other domain you actually use, such as `https://devhub-showcase.vercel.app/auth/callback`. Both the Google application origin and Supabase redirect allow list must cover that domain. Avoid broad production wildcards.

## Workspaces and the original site owner

Every confirmed user receives a separate private CV automatically. Complete [the multiuser migrations](multiuser-cvs.md) first. Only the original site portfolio needs the manual owner assignment described there; new users never claim it through sign in.

No new app dependency, service-role key or Google secret in Vercel is needed. The app continues using the existing public Supabase URL and publishable/anon key.

## Verify after deployment

Sign in with two Google accounts and confirm each reaches its own `/{username}/edit` workspace through `/admin`, can save its own CV and remains signed in after a reload. Each must be unable to edit the other account’s profile or moderate site reviews. Verify cancellation, email/password fallback and sign out. Automated tests cover the route flow and authorization rejection, but cannot replace a real provider round trip after credentials are configured.

References: [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-sign-in/auth-google) and [redirect URL configuration](https://supabase.com/docs/guides/auth/redirect-urls).
