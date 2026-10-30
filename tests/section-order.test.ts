import { expect, it } from "vitest";
import {
  getPortfolioSectionOrder,
  portfolioSectionIds,
} from "../packages/content/src/portfolio-sections";
import { profile } from "../packages/content/src/profile";
import { profileSchema } from "../packages/lib/src/domain/profile";

it("keeps each layout default when existing documents have no saved order", () => {
  for (const portfolioType of [
    "engineer",
    "designer",
    "consultant",
    "minimal",
  ] as const) {
    const saved = profileSchema.parse({ ...profile, portfolioType });
    expect(saved.sectionOrder).toBeUndefined();
    const order = getPortfolioSectionOrder(saved);
    expect(order[0]).toBe(portfolioType === "designer" ? "projects" : "about");
    expect(new Set(order)).toEqual(new Set(portfolioSectionIds));
  }
});
it("preserves custom order through serialization independently of layout and CV format", () => {
  const sectionOrder = [...portfolioSectionIds].reverse();
  const saved = profileSchema.parse(
    JSON.parse(JSON.stringify({ ...profile, sectionOrder })),
  );
  expect(getPortfolioSectionOrder(saved)).toEqual(sectionOrder);
  expect(
    getPortfolioSectionOrder({ ...saved, portfolioType: "designer" }),
  ).toEqual(sectionOrder);
  expect(saved.cvLayout).toBe("classic");
  expect(getPortfolioSectionOrder(profile)[0]).toBe("about");
});
it("rejects duplicates, missing sections and unknown section names", () => {
  for (const sectionOrder of [
    ["about", ...portfolioSectionIds.slice(0, 5)],
    portfolioSectionIds.slice(1),
    [...portfolioSectionIds, "about"],
    [...portfolioSectionIds.slice(0, 5), "script"],
  ])
    expect(profileSchema.safeParse({ ...profile, sectionOrder }).success).toBe(
      false,
    );
});
