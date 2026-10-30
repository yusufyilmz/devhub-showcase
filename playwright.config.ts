import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  reporter: [["list"], ["html", { open: "never" }]],
  retries: process.env.CI ? 1 : 0,
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3100",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "node e2e/fixture-server.mjs",
      reuseExistingServer: false,
      url: "http://127.0.0.1:3101/health",
    },
    {
      command: "pnpm --filter web start --hostname 127.0.0.1 --port 3100",
      env: {
        NEXT_PUBLIC_SITE_URL: "http://localhost:3100",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "e2e-public-placeholder",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "e2e-public-placeholder",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:3101",
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: "http://localhost:3100",
    },
    {
      command: "pnpm --filter web start --hostname 127.0.0.1 --port 3102",
      env: {
        NEXT_PUBLIC_SITE_URL: "http://localhost:3102",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
        NEXT_PUBLIC_SUPABASE_URL: "",
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: "http://localhost:3102",
    },
  ],
  workers: process.env.CI ? 1 : 2,
});
