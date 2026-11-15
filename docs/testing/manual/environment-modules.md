# Application environment modules — manual testing

**Scope/status:** Both apps use their typed env modules for runtime configuration. Shared packages and standalone seed scripts retain their own environment access. Import the app module using a relative path; the Studio alias currently covers only features.

**Prerequisites:** Node 24, pnpm 11 and installed dependencies. Copy each app’s `.env.example` to its own `.env.local`; use disposable credentials. Empty optional settings are treated as absent. Existing feature guards still enforce integration requirements. No production credentials are needed to validate schemas.

**Manual result:** Not run. Modules validate when app consumers import them. No explicit build-configuration import has been added.

| Step | Clickable URL                     | Route path | Action                                                                                                                               | Expected result                                                   | Actual result / evidence |
| ---- | --------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ------------------------ |
| 1    | [Studio](http://localhost:3001/)  | `/`        | Import the Studio env module in a temporary local consumer and read an optional setting with no credentials configured.              | Undefined optional value; no missing-credential validation error. | Not run                  |
| 2    | [Fitness](http://localhost:3002/) | `/`        | Import the Fitness module in a temporary local consumer, set `APP_URL=invalid`, restart and then retry with `http://localhost:3002`. | Invalid URL fails validation; corrected URL passes.               | Not run                  |
| 3    | [Studio](http://localhost:3001/)  | `/`        | In a temporary client consumer, attempt to read a server-only setting. Remove the temporary consumer afterward.                      | Access is rejected; secret value is not returned.                 | Not run                  |

Settings are strings, including flags and numeric limits, to preserve existing comparisons. No defaults replace existing feature-specific fallbacks. The modules do not load `.env.local` themselves; Next.js handles loading for app execution. Standalone scripts must load their environment explicitly.
