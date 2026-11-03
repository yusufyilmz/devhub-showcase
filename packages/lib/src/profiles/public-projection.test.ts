import { describe, expect, it } from "vitest";

import { profile, projectPublicProfile } from "@shared/config";

import { buildPublicPortfolioKnowledge } from "./portfolio-knowledge";
import { publicProfileSchema } from "./profile";

describe("public output contracts", () => {
  it("accepts intentionally removed contact data and never reintroduces it to visitor knowledge", () => {
    const source = { ...profile, websiteFields: { email: false, location: false, phone: false } };
    const projected = projectPublicProfile(source, "website");
    expect(publicProfileSchema.safeParse(projected).success).toBe(true);
    const knowledge = buildPublicPortfolioKnowledge({
      id: "test",
      isPublic: true,
      profile: source,
      revision: 3,
      updatedAt: "",
      username: "test-owner",
    });
    expect(JSON.stringify(knowledge)).not.toContain(source.email);
    expect(knowledge?.contact.email).toBe("");
    expect(knowledge?.identity.location).toBe("");
  });
});
