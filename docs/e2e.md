# Browser tests

Playwright exercises the production Next.js app in desktop Chrome and an emulated Pixel 7 viewport. Each test has a fresh browser context. Chromium is the only required browser; mobile emulation does not replace a real Safari or iPhone test.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium
pnpm build
pnpm test:e2e
```

For interactive debugging, run `pnpm test:e2e:ui`. After a run, use `pnpm test:e2e:report` to open the HTML report. Failed runs retain screenshots and traces under `test-results/`.

The runner starts its own app on `localhost:3100` and a test Supabase REST fixture on `127.0.0.1:3101`. A second app on `localhost:3102` runs without database configuration to check the published example fallback. Keep all three ports free. It deliberately does not reuse a running development server. Rebuild after source changes.

The fixture supplies the checked in public portfolio through the application's normal server repository. Tests click through to the actual rendered portfolio rather than replacing navigation with browser mocks. Unknown usernames return no row. Public fixture records reject writes; two isolated synthetic accounts can update only their own starter records in memory. No production credentials, database migrations or external Google login are needed. Synthetic fixture sessions exercise the real editor and save endpoint through layout selection, private saving and reload. These tokens are accepted only by the fixture; this does not certify live OAuth, database persistence or Supabase RLS. The app URLs use localhost consistently because Next.js normalizes local request URLs for origin checks.

Coverage includes homepage metadata, the portfolio link regression with and without local storage, keyboard preview tabs, CV preview, accent controls, persistent themes, expandable FAQs, viewport overflow, login navigation, protected editors, unknown username 404s, three alternative portfolio layouts and their PDF downloads, and new owner layout selection with persistence across reload.

GitHub Actions builds the app, installs Chromium and runs the suite in the Verify job. Production deployment depends on this job succeeding. The HTML report and failure traces are uploaded as a `playwright-report` artifact for seven days, including when tests fail.
