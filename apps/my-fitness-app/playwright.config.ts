import { generatePlaywrightConfig } from "@shared/test/playwright";

const fitnessE2eEnv = {
  APP_URL: "http://localhost:3200",
  CRON_SECRET: "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "e2e-public-placeholder",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "e2e-public-placeholder",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:3101",
  NEXT_TELEMETRY_DISABLED: "1",
  NODE_ENV: "production",
  SUPABASE_DB_URL: "postgresql://fixture:fixture@127.0.0.1:3998/fixture",
  WEB_PUSH_PRIVATE_KEY: "",
  WEB_PUSH_PUBLIC_KEY: "",
  WEB_PUSH_SUBJECT: "",
} as const;

export default generatePlaywrightConfig("http://localhost:3200", {
  fullyParallel: false,
  webServer: [
    {
      command: "pnpm --filter my-dev-studio exec tsx e2e/fixture-server.mjs",
      reuseExistingServer: false,
      timeout: 120000,
      url: "http://127.0.0.1:3101/health",
    },
    {
      command: "pnpm build && pnpm exec next start --hostname 127.0.0.1 --port 3200",
      env: fitnessE2eEnv,
      reuseExistingServer: false,
      timeout: 240000,
      url: "http://localhost:3200/preview",
    },
  ],
  workers: 1,
});
