import type { NextConfig } from "next";

import { describe, expect, it } from "vitest";

import nextConfig from "./next.config.mjs";

type Webpack = NonNullable<NextConfig["webpack"]>;

describe("next config", () => {
  it("keeps pdfmake external on the server so its font trie stays a real file", () => {
    const configure = nextConfig.webpack;
    if (!configure) throw new Error("Next webpack hook is missing");
    const config = {
      externals: [{ name: "existing" }],
      module: { rules: [] as unknown[] },
      resolve: { alias: {} as Record<string, string> },
    } as Parameters<Webpack>[0];
    const context = {
      buildId: "test",
      config: nextConfig,
      defaultLoaders: { babel: {} },
      dev: false,
      dir: process.cwd(),
      isServer: true,
      totalPages: 1,
      webpack: {},
    } as Parameters<Webpack>[1];

    const result = configure(config, context);
    const externalize = result.externals[0] as (
      data: { request?: string },
      callback: (error: null, result?: string) => void,
    ) => void;
    const decisions: Array<string | undefined> = [];
    for (const request of ["pdfmake", "pdfmake/build/vfs_fonts.js", "react"]) {
      externalize({ request }, (_error, value) => {
        decisions.push(value);
      });
    }

    expect(decisions).toEqual([
      "commonjs pdfmake",
      "commonjs pdfmake/build/vfs_fonts.js",
      undefined,
    ]);
    expect(result.externals[1]).toEqual({ name: "existing" });
  });
});
