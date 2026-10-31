# Security policy

## Supported code

Security fixes target the current `main` branch. Older commits, forks and separately deployed copies are not maintained release lines. Operators must apply reviewed code updates and database migrations to their own environments.

## Report a vulnerability privately

Use [GitHub private vulnerability reporting](https://github.com/yusufyilmz/devhub-showcase/security/advisories/new) if the repository offers **Report a vulnerability**. Availability depends on the repository's settings; this document does not enable the feature.

If private reporting is unavailable, contact the maintainer using a contact method listed on [their GitHub profile](https://github.com/yusufyilmz) and ask for a private reporting channel. Do not include exploit details in that initial request. Do not publish vulnerabilities, credentials, private CV content or reproduction data in a public issue or PR.

Include the affected commit/deployment, a concise impact description, minimal reproduction using accounts and data you control, expected versus actual access, and a suggested fix if known. Redact tokens and personal information. There is no guaranteed response SLA or bug bounty.

Avoid disruptive testing, account enumeration, accessing another person's records or running destructive payloads. Coordinate disclosure with the maintainer after a fix and deployment verification.

## Application security boundaries

- Authenticate and authorize on the server for each protected operation. Client visibility and usernames do not prove ownership.
- Keep private profiles and PDFs private unless the owner explicitly publishes them. Publishing a profile exposes its public content; PDF contact-visibility settings do not automatically hide contact details on the public page.
- Enforce isolation in database policies as well as application handlers. User-editable identity metadata must not grant administration privileges.
- Managed-portfolio transfers must retain authorization, revision conflict checks and preservation of the recipient's existing work.
- Validate saved and imported content, including URLs and upload limits. Treat CV text and AI output as untrusted data.
- Keep API keys, cookies, bearer tokens, uploaded documents and private profile content out of logs, error trackers and test artifacts.

Only publishable or legacy anon Supabase keys belong in browser configuration. Never put secret/service-role, Redis, OpenAI or deployment tokens in `NEXT_PUBLIC_` variables.

## Database and dependency changes

Review migrations and policy changes against anonymous, owner, other-user and administrator access. Test both allowed and denied operations, including direct Data API access. Do not apply policy changes to production merely to satisfy a build.

The repository contains a [legacy RLS review](docs/reference/legacy-rls-review.md) documenting earlier findings on legacy tables. Treat these as findings to revalidate, not as proof of current production state or of a completed remediation. New profile isolation does not automatically secure unrelated legacy tables.

Use pinned catalog versions and the committed lockfile. Review dependency updates and license notices, run the required checks, and investigate security advisories rather than silently suppressing them.

## If a secret or private record is exposed

1. Restrict access and revoke or rotate the affected credential at its provider.
2. Establish scope using restricted logs and deployment history; preserve only necessary evidence.
3. Remove the exposure from code, logs and artifacts. Deleting a Git file alone does not invalidate a credential or erase history.
4. Review access policies, test the fix with isolated accounts, and verify the deployed behavior.
5. Coordinate any required notifications privately with the responsible operator.

See [observability](docs/observability.md) for telemetry privacy and incident triage.
