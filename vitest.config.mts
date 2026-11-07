import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));
function exportAliases(folder: string, options: { cssOnly?: boolean; packageName?: string } = {}) {
  const { cssOnly = false, packageName = `@shared/${folder}` } = options;
  const exports = JSON.parse(
    readFileSync(new URL(`./packages/${folder}/package.json`, import.meta.url), "utf8"),
  ).exports as Record<string, string>;
  return Object.entries(exports)
    .filter(([key]) => !key.includes("*"))
    .filter(([key]) => (cssOnly ? key.endsWith(".css") : !key.endsWith(".css")))
    .flatMap(([key, target]) => {
      const resolved =
        typeof target === "string"
          ? target
          : typeof (target as { default?: string })?.default === "string"
            ? (target as { default?: string }).default
            : null;

      if (!resolved) return [];
      return [
        {
          find: key === "." ? packageName : `${packageName}/${key.slice(2)}`,
          replacement: fileURLToPath(new URL(`./packages/${folder}/${resolved}`, import.meta.url)),
        },
      ];
    });
}

const servicesRoot = fileURLToPath(new URL("./packages/services/src/", import.meta.url));

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
        if (id.endsWith(".css")) return "";
      },
      name: "cv-handlebars-source",
    },
  ],
  resolve: {
    alias: [
      {
        find: "@fixtures",
        replacement: fileURLToPath(new URL("./tools/test/fixtures", import.meta.url)),
      },
      {
        find: "next/font/google",
        replacement: fileURLToPath(
          new URL("./tools/test/mocks/next-font-google.ts", import.meta.url),
        ),
      },
      {
        find: "next/font/local",
        replacement: fileURLToPath(
          new URL("./tools/test/mocks/next-font-local.ts", import.meta.url),
        ),
      },
      {
        find: "@/app",
        replacement: fileURLToPath(new URL("./apps/my-dev-studio/app", import.meta.url)),
      },
      ...exportAliases("config").sort((a, b) => b.find.length - a.find.length),
      {
        find: "@shared/cache",
        replacement: fileURLToPath(new URL("./packages/cache/src/index.ts", import.meta.url)),
      },
      ...["assistant", "auth", "billing", "notifications", "runtime", "templates", "ui"]
        .flatMap((pkg) => exportAliases(pkg))
        .sort((a, b) => b.find.length - a.find.length),
      ...["ui"]
        .flatMap((pkg) => exportAliases(pkg, { cssOnly: true }))
        .sort((a, b) => b.find.length - a.find.length),
      {
        find: /^@shared\/assistant\/models\/([^/]+)$/,
        replacement: `${fileURLToPath(new URL("./packages/assistant/src/models/", import.meta.url))}$1.ts`,
      },
      {
        find: /^@shared\/assistant\/services\/([^/]+)$/,
        replacement: `${fileURLToPath(new URL("./packages/assistant/src/services/", import.meta.url))}$1/index.ts`,
      },
      {
        find: "@shared/billing-repository",
        replacement: fileURLToPath(
          new URL("./packages/billing/src/server/repository.ts", import.meta.url),
        ),
      },
      {
        find: /^@shared\/services\/db\/(.+)$/,
        replacement: `${servicesRoot}fitness/db/$1.ts`,
      },
      {
        find: "@shared/services/fitness/task",
        replacement: `${servicesRoot}fitness/task/index.ts`,
      },
      ...exportAliases("services").sort((a, b) => b.find.length - a.find.length),
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
        find: "@shared/services/portfolio",
        replacement: fileURLToPath(
          new URL("./packages/services/src/portfolio/index.ts", import.meta.url),
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
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      include: [
        "packages/services/src/portfolio/**",
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
          include: [
            "packages/**/*.test.{ts,tsx}",
            "apps/**/*.test.{ts,tsx}",
            "tools/**/*.test.{ts,tsx}",
          ],
          maxWorkers: 2,
          name: "unit",
          pool: "forks",
          setupFiles: [path.join(dirname, "tools/test/support/vitest-setup.ts")],
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
