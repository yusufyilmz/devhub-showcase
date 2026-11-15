# Shared environment validation

**Scope/status:** Both Next.js apps and shared consumers read settings from `@shared/env`. App entry points validate at load time. MyDevStudio requires Redis on Vercel Preview and Production. Fitness OS can run without Redis when its AI features are unused.

**Prerequisites:** A local workspace or Vercel preview, and disposable provider credentials when testing configured integrations. Keep actual values in ignored environment files or the deployment settings.

| Step | Clickable URL                                  | Route path    | Action                                                                     | Expected result                                              | Actual result / evidence |
| ---- | ---------------------------------------------- | ------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------ |
| 1    | [MyDevStudio home](http://localhost:3001/)     | `/`           | Start MyDevStudio locally with blank Redis values and open Home.           | Home loads with the optional integration unavailable.        | Not run                  |
| 2    | [Job Hunter](http://localhost:3001/admin/jobs) | `/admin/jobs` | Simulate a Preview build with `VERCEL_ENV=preview` and blank Redis values. | The build fails and names the missing Redis settings.        | Not run                  |
| 3    | [Fitness OS](http://localhost:3002/)           | `/`           | Run Fitness OS with optional AI credentials unset.                         | The app loads and AI routes report unavailable when invoked. | Not run                  |

Browser code receives explicitly mapped public settings. Server credentials remain restricted by T3 Env. Storybook retains build-time overrides for its local public URLs. Schema validation checks configuration shape. A provider connection check verifies live access separately.
