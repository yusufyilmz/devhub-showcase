import { dirname } from "path";
import { fileURLToPath } from "url";

import type { StorybookConfig } from "@storybook/react-vite";

import { getMonorepoAliases } from "./monorepo-aliases";

const storybookDir = fileURLToPath(new URL("./", import.meta.url));
const fixturesDir = fileURLToPath(new URL("../../../tools/test/fixtures", import.meta.url));
const nextFontGoogle = `${storybookDir}next-font-google.ts`;
const nextImage = `${storybookDir}next-image.tsx`;
const nextLink = `${storybookDir}next-link.tsx`;
const nextNavigation = `${storybookDir}next-navigation.ts`;

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
const config: StorybookConfig = {
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  async viteFinal(config) {
    config.resolve ??= {};
    const alias = config.resolve.alias;
    const existing = Array.isArray(alias)
      ? alias
      : Object.entries(alias ?? {}).flatMap(([find, replacement]) =>
          typeof replacement === "string" ? [{ find, replacement }] : [],
        );
    config.resolve.alias = [
      ...existing,
      ...getMonorepoAliases(),
      { find: "@fixtures", replacement: fixturesDir },
      { find: "next/font/google", replacement: nextFontGoogle },
      { find: "next/image", replacement: nextImage },
      { find: "next/link", replacement: nextLink },
      { find: "next/navigation", replacement: nextNavigation },
    ];
    config.define = {
      ...config.define,
      "process.env.NEXT_PUBLIC_API_URL": JSON.stringify("http://localhost:3000"),
    };
    return config;
  },
};
export default config;
