import { generatePlaywrightConfig } from "@shared/test/playwright";

export default generatePlaywrightConfig("http://localhost:3200", {
  fullyParallel: false,
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
