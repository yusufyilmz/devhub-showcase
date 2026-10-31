import { expect, it } from "vitest";

import {
  authorableSectionTypes,
  getSectionRenderers,
} from "../packages/content/src/authorable-sections";
import demo from "../packages/content/src/demo-profile.json";
import { buildPublicPortfolioKnowledge } from "../packages/lib/src/domain/portfolio-knowledge";
import { validateProfile } from "../packages/lib/src/domain/profile";

it("validates fictional demo content and excludes its private marker from visitor context", () => {
  const profile = validateProfile(demo);
  expect(profile.templateChosen).toBe(true);
  expect(profile.projects.some((item) => !item.public)).toBe(true);
  const knowledge = buildPublicPortfolioKnowledge({
    id: "demo",
    isPublic: true,
    profile,
    revision: 2,
    updatedAt: "",
    username: "demo-owner",
  });
  expect(JSON.stringify(knowledge)).not.toContain("PRIVATE_DEMO_MARKER");
  expect(profile.name).toBe("Alex Morgan");
});

it("demonstrates every registered section type and every custom layout", () => {
  const profile = validateProfile(demo);
  for (const type of authorableSectionTypes)
    expect(profile.customSections?.some((section) => section.sectionType === type)).toBe(true);
  for (const renderer of getSectionRenderers("custom"))
    expect(
      profile.customSections?.some(
        (section) => section.sectionType === "custom" && section.renderer === renderer,
      ),
    ).toBe(true);
  expect(profile.hero?.kind).toBe("image");
});
