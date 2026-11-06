import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  fullyParallel: false,
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  reporter: "list",
  testDir: "./e2e-fitness",
  use: {
    baseURL: "http://localhost:3200",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm --filter my-fitness-app start --hostname 127.0.0.1 --port 3200",
    env: {
      APP_URL: "http://localhost:3200",
      CRON_SECRET: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public-key",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:3999",
      SUPABASE_DB_URL: "postgresql://fixture:fixture@127.0.0.1:3998/fixture",
      WEB_PUSH_PRIVATE_KEY: "",
      WEB_PUSH_PUBLIC_KEY: "",
      WEB_PUSH_SUBJECT: "",
    },
    reuseExistingServer: false,
    timeout: 120000,
    url: "http://localhost:3200/preview",
  },
  workers: 1,
});
