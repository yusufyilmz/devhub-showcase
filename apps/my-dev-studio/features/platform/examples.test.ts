import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { portfolioTypes } from "@shared/config";
import { profileSchema } from "@shared/lib/profiles";

import { getPagePresentation } from "@/features/platform/page-presentation";
import {
  examplePath,
  exampleViewProfile,
  getExampleForPath,
  portfolioExamples,
} from "@/features/studio";

describe("Examples", () => {
  it("provides two valid, independent fictional profiles for every layout", () => {
    expect(portfolioExamples).toHaveLength(16);
    expect(new Set(portfolioExamples.map((item) => item.slug)).size).toBe(16);
    for (const type of portfolioTypes)
      expect(
        portfolioExamples.filter((item) => item.profile.portfolioType === type.id).length,
      ).toBeGreaterThanOrEqual(2);
    for (const item of portfolioExamples) {
      const parsed = profileSchema.safeParse(item.profile);
      expect(parsed.success, `${item.slug}: ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
      expect(item.profile.email).toMatch(/@example.com$/);
      expect(item.profile.projects.every((project) => project.public)).toBe(true);
      for (const cover of Object.values(item.covers))
        expect(existsSync(resolve(`apps/my-dev-studio/public/examples/${cover}`))).toBe(true);
      expect(exampleViewProfile(item).cvUrl).toBe(`${examplePath(item.slug)}/cv.pdf`);
    }
  });
  it("scopes demos to the reserved legacy namespace without claiming user names", () => {
    expect(getExampleForPath("/p/examples/maya-chen")?.profile.name).toBe("Maya Chen");
    for (const path of [
      "/maya-chen",
      "/examples/maya-chen",
      "/p/examples/missing",
      "/p/examples/maya-chen/edit",
    ])
      expect(getExampleForPath(path)).toBeUndefined();
  });
  it("uses demo language and appearance without a saved profile and isolates theme storage", () => {
    const demo = getPagePresentation("/p/examples/samir-kaya", true, null);
    expect(demo.documentLanguage).toBe("tr");
    expect(demo.portfolioTheme).toBe("graphite");
    expect(demo.storageKey).toBe("mydevstudio-example-theme:samir-kaya");
    const home = getPagePresentation("/", true, null);
    expect(home.profile).toBeUndefined();
    expect(home.portfolioTheme).toBeUndefined();
    expect(home.storageKey).toBe("mydevstudio-theme");
  });
});
