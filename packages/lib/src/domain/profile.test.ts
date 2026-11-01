import { describe, expect, it } from "vitest";

import {
  authorableSectionTypes,
  getPortfolioSectionOrder,
  getPortfolioThemeVariables,
  getSectionRenderers,
  getThemePalette,
  portfolioAccents,
  portfolioSectionIds,
  portfolioThemes,
  profile,
} from "@shared/config";

import demo from "../../../config/src/profile/demo-profile.json";
import { profileSchema, validateProfile } from "./profile";

function luminance(rgb: string) {
  const [r = 0, g = 0, b = 0] = rgb
    .split(" ")
    .map(Number)
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(first: string, second: string) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

describe("Themes", () => {
  it("keeps the original theme for legacy profiles and rejects unknown names", () => {
    expect(profileSchema.parse(profile).appearance?.theme).toBe("studio");
    expect(
      profileSchema.parse({
        ...profile,
        appearance: { accent: "violet", defaultTheme: "system" },
      }).appearance?.theme,
    ).toBe("studio");
    expect(
      profileSchema.safeParse({
        ...profile,
        appearance: { accent: "cyan", defaultTheme: "dark", theme: "unknown" },
      }).success,
    ).toBe(false);
  });
  it.each(portfolioThemes)(
    "$name has complete variables and readable light and dark palettes",
    ({ id }) => {
      const variables = getPortfolioThemeVariables(id);
      expect(variables["--portfolio-radius"]).toBeTruthy();
      for (const mode of ["light", "dark"] as const) {
        const palette = getThemePalette(id, mode);
        expect(variables[`--portfolio-bg-${mode}`]).toBe(palette.bg);
        expect(contrast(palette.text, palette.bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(palette.muted, palette.surface)).toBeGreaterThanOrEqual(4.5);
        for (const accent of Object.values(portfolioAccents))
          expect(contrast(accent[mode], palette.bg)).toBeGreaterThanOrEqual(4.5);
      }
    },
  );
});

describe("PortfolioTypes", () => {
  it("keeps legacy portfolios on the original layout without onboarding", () => {
    const saved = profileSchema.parse(profile);
    expect(saved.portfolioType).toBe("engineer");
    expect(saved.cvLayout).toBe("classic");
    expect(saved.templateChosen).toBe(true);
  });
  it("rejects unknown templates and unsafe project covers", () => {
    expect(profileSchema.safeParse({ ...profile, portfolioType: "unknown" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...profile, cvLayout: "unknown" }).success).toBe(false);
    expect(
      profileSchema.safeParse({
        ...profile,
        projects: [{ ...profile.projects[0], coverImage: "javascript:alert(1)" }],
      }).success,
    ).toBe(false);
  });
});

describe("SectionOrder", () => {
  it("keeps each layout default when existing documents have no saved order", () => {
    for (const portfolioType of ["engineer", "designer", "consultant", "minimal"] as const) {
      const saved = profileSchema.parse({ ...profile, portfolioType });
      expect(saved.sectionOrder).toBeUndefined();
      const order = getPortfolioSectionOrder(saved);
      expect(order[0]).toBe(portfolioType === "designer" ? "projects" : "about");
      expect(new Set(order)).toEqual(new Set(portfolioSectionIds));
    }
  });
  it("preserves custom order through serialization independently of layout and CV format", () => {
    const sectionOrder = [...portfolioSectionIds].reverse();
    const saved = profileSchema.parse(JSON.parse(JSON.stringify({ ...profile, sectionOrder })));
    expect(getPortfolioSectionOrder(saved)).toEqual(sectionOrder);
    expect(getPortfolioSectionOrder({ ...saved, portfolioType: "designer" })).toEqual(sectionOrder);
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
      expect(profileSchema.safeParse({ ...profile, sectionOrder }).success).toBe(false);
  });
});

describe("DemoProfile", () => {
  it("demonstrates every registered section type and every custom layout", () => {
    const saved = validateProfile(demo);
    for (const type of authorableSectionTypes)
      expect(saved.customSections?.some((section) => section.sectionType === type)).toBe(true);
    for (const renderer of getSectionRenderers("custom"))
      expect(
        saved.customSections?.some(
          (section) => section.sectionType === "custom" && section.renderer === renderer,
        ),
      ).toBe(true);
    expect(saved.hero?.kind).toBe("image");
  });
});
