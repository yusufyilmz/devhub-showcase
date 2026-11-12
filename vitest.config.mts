import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));
function exportAliases(folder: string) {
  const metadata = JSON.parse(
    readFileSync(new URL(`./packages/${folder}/package.json`, import.meta.url), "utf8"),
  ) as { name: string; exports: Record<string, string | { default?: string; import?: string }> };
  return Object.entries(metadata.exports).flatMap(([key, target]) => {
    const resolved = typeof target === "string" ? target : (target.import ?? target.default);
    if (!resolved) return [];
    const publicPath = key === "." ? metadata.name : `${metadata.name}/${key.slice(2)}`;
    const escaped = publicPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace("\\*", "(.+)");
    return [
      {
        find: new RegExp(`^${escaped}$`),
        replacement: fileURLToPath(
          new URL(`./packages/${folder}/${resolved}`, import.meta.url),
        ).replace("*", "$1"),
      },
    ];
  });
}

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
      ...[
        "assistant",
        "auth",
        "billing",
        "config",
        "env",
        "lib",
        "notifications",
        "runtime",
        "ui",
        "utils",
      ].flatMap(exportAliases),
    ],
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      include: [
        "packages/lib/src/services/portfolio/index.ts",
        "packages/lib/src/services/portfolio/formatter.ts",
        "packages/lib/src/services/portfolio/resource-manager.ts",
        "packages/lib/src/repositories/portfolio/**",
        "packages/utils/src/date/**",
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
