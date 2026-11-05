import { defineConfig } from "tsdown";

type LibraryConfigOptions = {
  entry?: string | string[];
  platform?: "browser" | "neutral" | "node";
};

const neverBundle = [/^@shared\//, /^next(\/|$)/, "react", "react-dom", "react/jsx-runtime"];

/** Shared defaults for `@shared/*` workspace libraries (dist output; exports stay on source). */
export function defineLibraryConfig(options: LibraryConfigOptions = {}) {
  return defineConfig({
    clean: true,
    deps: { neverBundle },
    // Types stay on TypeScript source (`typecheck`); workspace exports do not point at dist yet.
    dts: false,
    entry: options.entry ?? ["src/index.ts"],
    format: ["esm"],
    platform: options.platform ?? "node",
  });
}
