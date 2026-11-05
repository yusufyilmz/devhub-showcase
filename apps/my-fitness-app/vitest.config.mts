import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const servicesRoot = fileURLToPath(new URL("../../packages/services/src/", import.meta.url));
export default defineConfig({
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: fileURLToPath(new URL(".", import.meta.url)) },
      {
        find: /^@shared\/services\/db\/(.*)$/,
        replacement: `${servicesRoot}fitness/db/$1`,
      },
      {
        find: "@shared/services/fitness/types",
        replacement: `${servicesRoot}fitness/types/index.ts`,
      },
      {
        find: "@shared/services/fitness/workspace",
        replacement: `${servicesRoot}fitness/workspace/index.ts`,
      },
      {
        find: "@shared/services/fitness/task",
        replacement: `${servicesRoot}fitness/task/index.ts`,
      },
      {
        find: "@shared/services/fitness/schedule",
        replacement: `${servicesRoot}fitness/schedule/index.ts`,
      },
      {
        find: "@shared/services/fitness/meal",
        replacement: `${servicesRoot}fitness/meal/index.ts`,
      },
      {
        find: "@shared/services/fitness",
        replacement: `${servicesRoot}fitness/index.ts`,
      },
    ],
  },
  test: {
    clearMocks: true,
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}", "features/**/*.test.{ts,tsx}"],
    testTimeout: 15000,
  },
});
