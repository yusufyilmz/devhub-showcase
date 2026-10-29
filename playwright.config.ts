import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } }
  ],
  webServer: [
    {
      command: 'node e2e/fixture-server.mjs',
      url: 'http://127.0.0.1:3101/health',
      reuseExistingServer: false
    },
    {
      command: 'pnpm --filter web start --hostname 127.0.0.1 --port 3100',
      url: 'http://127.0.0.1:3100',
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:3101',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'e2e-public-placeholder',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'e2e-public-placeholder',
        NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3100'
      }
    },
    {
      command: 'pnpm --filter web start --hostname 127.0.0.1 --port 3102',
      url: 'http://127.0.0.1:3102',
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: '',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
        NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3102'
      }
    }
  ]
})
