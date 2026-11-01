import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  plugins: [
    {
      load(id) {
        if (id.endsWith(".hbs"))
          return `export default ${JSON.stringify(readFileSync(id, "utf8"))}`;
      },
      name: "cv-handlebars-source",
    },
  ],
  resolve: {
    alias: [
      {
        find: "@fixtures",
        replacement: fileURLToPath(new URL("./tools/__fixtures__", import.meta.url)),
      },
      {
        find: "next/font/google",
        replacement: fileURLToPath(
          new URL("./tests/support/mocks/next-font-google.ts", import.meta.url),
        ),
      },
      {
        find: "next/font/local",
        replacement: fileURLToPath(
          new URL("./tests/support/mocks/next-font-local.ts", import.meta.url),
        ),
      },
      {
        find: "@/app",
        replacement: fileURLToPath(new URL("./apps/my-dev-studio/app", import.meta.url)),
      },
      {
        find: "@/features",
        replacement: fileURLToPath(new URL("./apps/my-dev-studio/features", import.meta.url)),
      },
      {
        find: "@fixtures",
        replacement: fileURLToPath(new URL("./tools/__fixtures__", import.meta.url)),
      },
      {
        find: "@shared/config",
        replacement: fileURLToPath(new URL("./packages/config/src/index.ts", import.meta.url)),
      },
      {
        find: "@shared/content",
        replacement: fileURLToPath(new URL("./packages/content/src/index.ts", import.meta.url)),
      },
      {
        find: "@shared/cache",
        replacement: fileURLToPath(new URL("./packages/cache/src/index.ts", import.meta.url)),
      },
      {
        find: "@shared/assistant",
        replacement: fileURLToPath(new URL("./packages/assistant/src/index.ts", import.meta.url)),
      },
      {
        find: /^@shared\/assistant\/models\/([^/]+)$/,
        replacement: `${fileURLToPath(new URL("./packages/assistant/src/models/", import.meta.url))}$1.ts`,
      },
      {
        find: /^@shared\/assistant\/services\/([^/]+)$/,
        replacement: `${fileURLToPath(new URL("./packages/assistant/src/services/", import.meta.url))}$1/index.ts`,
      },
      {
        find: /^@shared\/assistant\/(.*)$/,
        replacement: `${fileURLToPath(new URL("./packages/assistant/src/", import.meta.url))}$1`,
      },
      ...["auth", "components", "ui"]
        .flatMap((pkg) =>
          Object.entries(
            JSON.parse(
              readFileSync(new URL(`./packages/${pkg}/package.json`, import.meta.url), "utf8"),
            ).exports as Record<string, string>,
          )
            .filter(([key]) => !key.endsWith(".css") && !key.includes("*"))
            .map(([key, path]) => ({
              find: key === "." ? `@shared/${pkg}` : `@shared/${pkg}/${key.slice(2)}`,
              replacement: fileURLToPath(new URL(`./packages/${pkg}/${path}`, import.meta.url)),
            })),
        )
        .sort((a, b) => b.find.length - a.find.length),
      ...Object.entries(
        JSON.parse(readFileSync(new URL("./packages/lib/package.json", import.meta.url), "utf8"))
          .exports as Record<string, string>,
      ).map(([key, path]) => ({
        find: `@shared/lib/${key.slice(2)}`,
        replacement: fileURLToPath(new URL(`./packages/lib/${path}`, import.meta.url)),
      })),
      {
        find: "@shared/utils/logger",
        replacement: fileURLToPath(
          new URL("./packages/utils/src/logger/index.ts", import.meta.url),
        ),
      },
      {
        find: "@shared/lib/portfolio",
        replacement: fileURLToPath(
          new URL("./packages/lib/src/services/portfolio/index.ts", import.meta.url),
        ),
      },
      {
        find: /^@shared\/lib\/(.*)$/,
        replacement: `${fileURLToPath(new URL("./packages/lib/src/", import.meta.url))}$1`,
      },
      {
        find: /^@shared\/ui\/([^/]+)$/,
        replacement: `${fileURLToPath(new URL("./packages/ui/src/components/", import.meta.url))}$1/index.ts`,
      },
    ],
  },
  test: {
    coverage: {
      include: [
        "packages/lib/src/services/portfolio/**",
        "packages/lib/src/utils/date/**",
        "packages/assistant/src/services/formatter/**",
      ],
      provider: "v8",
    },
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
          include: ["packages/**/*.test.{ts,tsx}", "apps/**/*.test.{ts,tsx}"],
          maxWorkers: 2,
          name: "unit",
          pool: "forks",
          setupFiles: [path.join(dirname, "tests/support/vitest-setup.ts")],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, "apps/storybook-app/.storybook"),
          }),
        ],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [
              {
                browser: "chromium",
              },
            ],
            provider: playwright({}),
          },
          name: "storybook",
        },
      },
    ],
  },
});
