import { existsSync } from "node:fs";

import { expect, it } from "vitest";

import {
  examplePath,
  exampleViewProfile,
  getExampleForPath,
  portfolioExamples,
} from "../apps/web/features/examples/data";
import { getPagePresentation } from "../apps/web/lib/page-presentation";
import { portfolioTypes } from "../packages/content/src/portfolio-types";
import { profileSchema } from "../packages/lib/src/domain/profile";

it("provides two valid, independent fictional profiles for every layout", () => {
  expect(portfolioExamples).toHaveLength(8);
  expect(new Set(portfolioExamples.map((item) => item.slug)).size).toBe(8);
  for (const type of portfolioTypes)
    expect(portfolioExamples.filter((item) => item.profile.portfolioType === type.id)).toHaveLength(
      2,
    );
  for (const item of portfolioExamples) {
    expect(profileSchema.safeParse(item.profile).success).toBe(true);
    expect(item.profile.email).toMatch(/@example.com$/);
    expect(item.profile.projects.every((project) => project.public)).toBe(true);
    for (const cover of Object.values(item.covers))
      expect(existsSync(new URL(`../apps/web/public/examples/${cover}`, import.meta.url))).toBe(
        true,
      );
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
