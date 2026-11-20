import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import type { PageAction } from "./action";

describe("home-section entrypoint", () => {
  it("exposes the existing homepage sections without requiring the portfolio barrel", () => {
    const manifest = JSON.parse(
      readFileSync(new URL("../../../package.json", import.meta.url), "utf8"),
    ) as { exports: Record<string, string> };
    expect(manifest.exports["./home-section"]).toBe("./src/sections/home-section/index.ts");

    const homepage = readFileSync(
      new URL("../../../../../apps/my-dev-studio/views/home/HomePage.tsx", import.meta.url),
      "utf8",
    );
    expect(homepage).toContain('from "@shared/ui/home-section"');
    expect(homepage).not.toContain('from "@shared/ui/sections"');
  });

  it("keeps the home PageAction contract typed", () => {
    const action: PageAction = {
      href: "/login",
      label: "Create your portfolio",
      signedIn: false,
    };
    expect(action.signedIn).toBe(false);
  });
});
