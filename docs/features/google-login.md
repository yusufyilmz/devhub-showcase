# Google sign in for CV workspaces

The admin login now offers **Continue with Google** alongside email/password. It uses Supabase SSR cookies and PKCE. Google authenticates the identity; the server verifies the confirmed user and opens only that user’s CV workspace. First sign in creates a private profile owned by that UUID. The original site moderation guard remains separate. This requests basic identity only, with no Gmail mailbox access.

## Activate the provider

Replace `https://your-app.example` and `YOUR_PROJECT_REF` with the actual deployment origin and Supabase project reference. These are placeholders, not values to paste into production.

1. In [Google Auth Platform](https://console.cloud.google.com/auth/overview), select your project, configure branding/audience, and create an OAuth client of type **Web application**. Use `openid`, email and profile scopes. If the consent app is in testing mode, add your owner Google account as a test user.
2. Add `https://your-app.example` as an authorized JavaScript origin. Add `http://localhost:3000` for local development if needed.
3. Add this **Google authorized redirect URI**:

   ```text
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```

4. Open your Supabase project's Google provider settings, enable Google, and enter the client ID and client secret there. Do not put the client secret in source code, browser environment variables or chat. Leave nonce/email verification checks enabled.
5. In your Supabase project's URL Configuration, set the production Site URL and allow these application callback URLs:

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

## Local testing without Google OAuth

The MyDevStudio login page can show **Continue as local test user** when the app
is running in development against **local Supabase**. This signs in through
Supabase's normal email/password flow and still runs the standard confirmed-user
workspace provisioning and ownership checks. It does not forge a session or
make any existing portfolio accessible.

1. Start the local Supabase stack (`supabase start`) and run the local
   database migrations required by MyDevStudio.
2. In the local Supabase Studio Auth users screen (usually
   `http://127.0.0.1:54323`), create a **confirmed**, disposable test user
   with an email address and password.
3. In `apps/my-dev-studio/.env.local` (or the environment file used by your
   development command), set:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local anon/publishable key from supabase status>
   LOCAL_TEST_LOGIN=true
   LOCAL_TEST_EMAIL=<confirmed local test user's email>
   LOCAL_TEST_PASSWORD=<test user's password>
   ```

4. Restart the Next.js development server, navigate to
   `http://localhost:3000/login`, and select **Continue as local test user**.
   It opens the normal studio with a disposable local user's workspace.
5. Sign out normally when finished. Disable the shortcut by changing
   `LOCAL_TEST_LOGIN=false` or stopping the local Supabase stack.

The shortcut is unavailable in production/test builds, when Supabase points
to a hosted or non-loopback URL, or when the request is not from an exact
same-origin loopback HTTP origin. It has no service-role dependency. Never add
these credentials to Vercel, commit them, or copy a real user's credentials
into this local-only setup. If you want to test the full real OAuth flow,
continue using **Continue with Google**.
