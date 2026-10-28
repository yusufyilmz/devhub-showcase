# Google sign in for the portfolio studio

The admin login now offers **Continue with Google** alongside email/password. It uses Supabase SSR cookies and PKCE. Google authenticates the identity; `requireAdmin` still verifies a confirmed user and the exact `portfolio_profiles.owner_id`. A Google login never assigns or claims ownership. Unassigned accounts are signed out locally after the callback. This requests basic identity only, with no Gmail mailbox access.

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

## Assign your owner account

Complete [the existing admin database setup](admin-setup.md) first. The portfolio table and owner assignment are still required. If Google creates a new Supabase user on its first sign in, that first attempt will be denied until ownership is assigned. Check the confirmed account in Supabase Authentication, then run the existing `supabase/set-portfolio-owner.sql` for `yilmazyu@gmail.com`. If you already have an email/password user, verify which Supabase user ID the Google identity uses before changing ownership. Public contact email and Google profile metadata cannot grant admin access.

No new app dependency, service-role key or Google secret in Vercel is needed. The app continues using the existing public Supabase URL and publishable/anon key.

## Verify after deployment

Sign in with the owner Google account and confirm you reach `/admin`, can publish, and remain signed in after a reload. Sign out and try a different Google account: it must return to login with an access message, and protected APIs must remain forbidden. Verify cancellation, email/password fallback and sign out. Automated tests cover the route flow and authorization rejection, but cannot replace a real provider round trip after credentials are configured.

References: [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-sign-in/auth-google) and [redirect URL configuration](https://supabase.com/docs/guides/auth/redirect-urls).
