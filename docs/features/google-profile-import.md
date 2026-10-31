# Optional Google profile import

After normal sign-in, users can choose Start from Google profile in onboarding or open Import Google in their editor. Normal Google login keeps its existing scopes. The optional import separately requests only the categories the owner selects through Google Identity Services' token consent dialog. It never reads Gmail messages, contacts, Drive files, calendars or another person's profile.

## Available details

| Choice                   | Google profile fields | Portfolio result                                             |
| ------------------------ | --------------------- | ------------------------------------------------------------ |
| Name and email           | names, emailAddresses | Full name and public email suggestions                       |
| City, region and country | addresses             | Location suggestion; street/postal details are discarded     |
| Phone                    | phoneNumbers          | Primary phone suggestion                                     |
| Birthdate                | birthdays             | Optional birthDate suggestion only for a complete valid date |
| Current job              | organizations         | Current job title suggestion; organization shown for review  |

A Google account is not a CV database. The owner may have no phone, address or job stored. Partial/denied permissions leave those fields unavailable. The mapper prefers primary entries and never invents work dates, proficiency, experience, projects or missing birthdate components. Organizations not marked current do not become a current job title.

Every proposed field is initially unselected. Owners can edit values, compare them with current values and apply only their choices to the current draft. Applying validates the complete profile, does not save and does not change username, ownership, billing, publication or layout. Normal revision-checked Save changes remains required; saving a published portfolio updates its public data. Cancel discards review data and ignores late consent/import responses. Managed portfolio editors cannot import an account's Google data into somebody else's workspace.

Birthdate is optional in the canonical profile and compatible with legacy documents. It is never selected by default, can be cleared in Profile, and must be a valid nonfuture date. Saving it puts it in profile JSON, which may be publicly readable after publication. Current portfolio/PDF layouts and public AI projections do not display/include that new field. There is no claim that an undisplayed birthday is private. An organization is review-only because an experience record requires dates and additional facts.

## Setup

1. In the existing Google Cloud project, enable the People API.
2. Configure the web OAuth client's authorized JavaScript origins for the exact production and development origins. This feature uses Google's popup token model, so it adds no redirect callback. The existing Supabase login callback remains as configured.
3. Set GOOGLE_PROFILE_CLIENT_ID in Vercel/server environment to that OAuth client ID ending in .apps.googleusercontent.com. This ID is public and returned only to the confirmed owner by the setup endpoint. No Google client secret or provider refresh token is needed for this token flow. Redeploy after changing environment configuration.
4. Configure the consent screen's Data Access for userinfo.profile, userinfo.email, user.addresses.read, user.phonenumbers.read, user.birthday.read and user.organization.read. The code uses the corresponding full googleapis.com/auth scope URLs and requests only selected categories. No Gmail or contacts scopes are used. While testing, add intended test users. Complete Google's applicable brand/sensitive-scope verification and required consent/privacy disclosures before broad availability. Existing basic login approval does not automatically approve extra permissions.
5. Sign in normally, open Import Google, choose categories, give consent and complete Google's dialog. Review returned fields, apply selected details and save only when ready. Verify denial, partial permissions, a blocked/closed popup and an account with no extra details. Removing access in Google does not delete values already saved to a portfolio.

Missing configuration leaves manual editing available. A blocked external Google script can be retried; it never loads on the homepage or ordinary login. The script loads only after the owner opts into import. Google's dialog must be triggered by a fresh click once the official library is ready.

## Boundaries and verification

The reusable consent/scopes helpers live in packages/auth; mapping and apply validation in packages/lib; owner transport/review in apps/web. The current Supabase account is independently verified on every import request. Choosing a Google account for source data does not sign into or transfer ownership to that account, and source email never becomes authorization. Imported details are untrusted editable content.

The POST endpoint checks origin, confirmed workspace ownership, strict input/category allowlists and bounded request size before fetching only people/me from the fixed People API origin with READ_SOURCE_TYPE_PROFILE. Only requested fields are mapped. Requests use a short timeout, no-store, no redirects and no automatic retries. Responses are bounded and private/no-store. Neither tokens nor raw Google responses are logged, persisted in profile data or sent to OpenAI. The short-lived access token exists only for consent/transport and there is no background sync or stored refresh token. API tokens are never put in URL parameters. Errors use fixed messages rather than Google payloads.

Unit/API/UI tests cover least-privilege categories, partial/denied consent, fixed upstream URLs, field projection, birthday compatibility, explicit apply, cancellation and isolation. Desktop/mobile Playwright fixtures simulate Google consent and responses; they do not verify real Google OAuth, approved scopes or production People API setup. No production Google permissions, API configuration or user profile records are changed by this code work.

References: [Google token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model), [People get](https://developers.google.com/people/api/rest/v1/people/get), [incremental authorization and granular consent](https://developers.google.com/identity/protocols/oauth2/resources/best-practices), [sensitive scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification).
