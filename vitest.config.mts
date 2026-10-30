import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    {
      name: "cv-handlebars-source",
      load(id) {
        if (id.endsWith(".hbs"))
          return `export default ${JSON.stringify(readFileSync(id, "utf8"))}`;
      },
    },
  ],
  resolve: {
    alias: [
      ...["auth", "components", "sections"]
        .flatMap((pkg) =>
          Object.entries(
            JSON.parse(
              readFileSync(
                new URL(`./packages/${pkg}/package.json`, import.meta.url),
                "utf8",
              ),
            ).exports as Record<string, string>,
          )
            .filter(([key]) => !key.endsWith(".css"))
            .map(([key, path]) => ({
              find:
                key === "."
                  ? `@shared/${pkg}`
                  : `@shared/${pkg}/${key.slice(2)}`,
              replacement: fileURLToPath(
                new URL(`./packages/${pkg}/${path}`, import.meta.url),
              ),
            })),
        )
        .sort((a, b) => b.find.length - a.find.length),
      ...Object.entries(
        JSON.parse(
          readFileSync(
            new URL("./packages/lib/package.json", import.meta.url),
            "utf8",
          ),
        ).exports as Record<string, string>,
      ).map(([key, path]) => ({
        find: `@shared/lib/${key.slice(2)}`,
        replacement: fileURLToPath(
          new URL(`./packages/lib/${path}`, import.meta.url),
        ),
      })),
      {
        find: "@shared/lib/logger",
        replacement: fileURLToPath(
          new URL("./packages/lib/src/log/index.ts", import.meta.url),
        ),
      },
      {
        find: "@shared/lib/portfolio",
        replacement: fileURLToPath(
          new URL(
            "./packages/lib/src/services/portfolio/index.ts",
            import.meta.url,
          ),
        ),
      },
      {
        find: /^@shared\/content$/,
        replacement: fileURLToPath(
          new URL("./packages/content/src/index.ts", import.meta.url),
        ),
      },
      {
        find: /^@shared\/lib\/(.*)$/,
        replacement: `${fileURLToPath(new URL("./packages/lib/src/", import.meta.url))}$1`,
      },
      {
        find: /^@shared\/ui\/(.*)$/,
        replacement: `${fileURLToPath(new URL("./packages/ui/src/", import.meta.url))}$1`,
      },
    ],
  },
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
    pool: 'vmThreads',
    coverage: {
      provider: "v8",
      include: [
        "packages/lib/src/services/portfolio/**",
        "packages/lib/src/utils/date/**",
        "packages/chat/src/services/formatter/**",
      ],
    },
  },
});
