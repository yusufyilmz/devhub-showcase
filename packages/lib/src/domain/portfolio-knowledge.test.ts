import { describe, expect, it } from "vitest";

import demo from "../../../config/src/profile/demo-profile.json";
import { buildPublicPortfolioKnowledge } from "./portfolio-knowledge";
import { validateProfile } from "./profile";

describe("PortfolioKnowledge", () => {
  it("excludes the demo profile's private marker from visitor context", () => {
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
});
