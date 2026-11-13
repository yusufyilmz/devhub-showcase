# Local development setup and test login

Scope: development environment setup for PR #93. Local automation is separate from browser verification; no deployed verification is claimed.

## Prerequisites

Use Node and pnpm versions from root package.json and install dependencies. Start Docker and run `pnpm supabase:start` from the repository root for authentication. `pnpm supabase:stop` and `pnpm supabase:restart` control the same stack. `pnpm supabase:status` prints the local URL and keys. `pnpm supabase:studio` opens Studio at <http://127.0.0.1:54323>. Use a confirmed disposable local Studio user and fictional content. Run `pnpm dev:setup --supabase` before the app environment file exists, add its credentials to the ignored app file, enable `LOCAL_TEST_LOGIN`, and start `pnpm --filter my-dev-studio dev`. Never copy hosted credentials. Existing environment files require manual edits; the setup command preserves them.

## Steps

| Step | Clickable URL                          | Route path | Action                                                                                         | Expected result                                               | Actual result / evidence |
| ---- | -------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------ |
| 1    | [Login](http://localhost:3001/login)   | `/login`   | Run setup twice, start the app and open login.                                                 | Second setup preserves file bytes; login loads on port 3001.  | Not run in browser       |
| 2    | [Local Studio](http://127.0.0.1:54323) | `/`        | Create a confirmed disposable Auth user; configure its credentials in the ignored app file.    | Credentials remain local; no service-role key is needed.      | Not run                  |
| 3    | [Login](http://localhost:3001/login)   | `/login`   | Select Continue as local test user, then reload the resulting studio page.                     | Normal private workspace and session persist.                 | Not run                  |
| 4    | [Login](http://localhost:3001/login)   | `/login`   | Sign out, set an incorrect disposable password, restart and retry; restore password and retry. | Failure grants no access; corrected credentials permit login. | Not run                  |
| 5    | [Login](http://localhost:3001/login)   | `/login`   | Set LOCAL_TEST_LOGIN=false and restart; revisit signed out.                                    | Shortcut is hidden.                                           | Not run                  |
| 6    | [Login](http://localhost:3001/login)   | `/login`   | Repeat with a second disposable account and try the first account's editor URL.                | Each user accesses only their own workspace.                  | Not run                  |

See [Google login](/docs/dev-studio/google-login.md) for guard requirements. Setup does not apply pending migrations to an already running database; use the reviewed local migration workflow when needed. Missing CLI/Docker/stack must fail without creating an environment file. No browser or local database verification is claimed until recorded above.
