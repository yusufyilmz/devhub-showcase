import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

export function generatePlaywrightConfig(baseURL: string, config: PlaywrightTestConfig) {
  return defineConfig(
    {
      projects: [
        { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
      ],
      reporter: [["list"], ["html", { open: "never", outputFolder: "e2e-report" }]],
      testDir: "e2e",
      testMatch: "e2e/**/*.spec.{ts,tsx}",
      use: {
        baseURL: baseURL,
        screenshot: "on",
        trace: "on-first-retry",
        video: "on-first-retry",
      },
    },
    config,
  );
}
