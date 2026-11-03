import { describe, expect, it } from "vitest";

import { profile } from "../profile/profile";
import { applyPortfolioTemplate, portfolioTemplates } from "./portfolio-templates";

describe("profession templates", () => {
  it("preserves content, privacy, item selections, PDF and authored sections across every switch", () => {
    const original = {
      ...profile,
      cvLayout: "ats" as const,
      projects: profile.projects.map((item) => ({ ...item, public: false })),
      sectionSettings: { projects: { itemIds: [profile.projects[0]!.id], visible: false } },
    };
    for (const template of portfolioTemplates) {
      const next = applyPortfolioTemplate(original, template.id);
      expect(next.projects).toBe(original.projects);
      expect(next.about).toBe(original.about);
      expect(next.experiences).toBe(original.experiences);
      expect(next.cvLayout).toBe("ats");
      expect(next.sectionSettings?.projects?.visible).toBe(false);
      expect(next.sectionSettings?.projects?.itemIds).toEqual(
        original.sectionSettings.projects.itemIds,
      );
      expect(next.sectionOrder).toEqual(template.order);
    }
    expect(
      new Set(portfolioTemplates.map((item) => JSON.stringify([item.order, item.renderers]))).size,
    ).toBe(9);
    expect(() => applyPortfolioTemplate(original, "unknown")).toThrow();
  });
});
