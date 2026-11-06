import { defineConfig, devices } from "@playwright/test";

const _baseURL = `http://localhost:${port}${basePath}`;

const config = {
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  outputDir: "e2e-results",
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],

  reporter: [["list"], ["html", { open: "never", outputFolder: "e2e-report" }]],
  retries: process.env.CI ? 1 : 0,
  testDir: "e2e",
  testMatch: "**/*.e2e.{ts,tsx}",
  use: {
    baseURL: "http://localhost:3100",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "pnpm exec tsx e2e/fixture-server.mjs",
      reuseExistingServer: false,
      url: "http://127.0.0.1:3101/health",
    },
    {
      command: "pnpm --filter my-dev-studio start --hostname 127.0.0.1 --port 3100",
      env: {
        CRON_SECRET: "fixture-only-scheduler-secret-32-characters",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3100",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "e2e-public-placeholder",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "e2e-public-placeholder",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:3101",
        OPENAI_API_KEY: "",
        REDIS_TOKEN: "",
        REDIS_URL: "",
        SUPABASE_SERVICE_ROLE_KEY: "fixture-scheduler-service",
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: "http://localhost:3100",
    },
    {
      command: "pnpm --filter my-dev-studio start --hostname 127.0.0.1 --port 3102",
      env: {
        NEXT_PUBLIC_SITE_URL: "http://localhost:3102",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
        NEXT_PUBLIC_SUPABASE_URL: "",
        OPENAI_API_KEY: "",
        REDIS_TOKEN: "",
        REDIS_URL: "",
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: "http://localhost:3102",
    },
  ],
  workers: process.env.CI ? 1 : 2,
};

export default defineConfig(config);
