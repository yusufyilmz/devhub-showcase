import { describe, expect, it, vi } from "vitest";

import { createCVModel } from "../packages/chat/src/models/cv-model";
import { formatAllCV } from "../packages/chat/src/services/formatter";
import { profile } from "../packages/content/src/profile";
import { profileSchema } from "../packages/lib/src/domain/profile";
import type { ProfileRepository } from "../packages/lib/src/repositories/profile-repository";
import { getPortfolioResources } from "../packages/lib/src/services/portfolio";
import { ProfileService } from "../packages/lib/src/services/profile-service";

function repository(owner = true): ProfileRepository {
  return {
    isOwner: vi.fn().mockResolvedValue(owner),
    read: vi.fn(),
    save: vi.fn().mockImplementation(async (profile, revision) => ({
      profile,
      revision: revision + 1,
      updatedAt: "2026-10-28",
    })),
  };
}
describe("portfolio publishing", () => {
  it("accepts the existing CV profile with safe appearance defaults", () => {
    expect(profileSchema.parse(profile).appearance).toEqual({
      accent: "cyan",
      defaultTheme: "dark",
      theme: "studio",
    });
  });
  it("rejects unauthenticated visitors and other accounts before writing", async () => {
    const store = repository(false);
    const service = new ProfileService(store);
    await expect(service.save(null, { profile, revision: 1 })).rejects.toThrow(
      "Only the portfolio owner",
    );
    await expect(service.save("stranger", { profile, revision: 1 })).rejects.toThrow(
      "Only the portfolio owner",
    );
    expect(store.save).not.toHaveBeenCalled();
  });
  it("publishes the validated profile as one revision and detects stale edits", async () => {
    const store = repository();
    const service = new ProfileService(store);
    const published = await service.save("owner", {
      profile: { ...profile, name: "Updated name" },
      revision: 3,
    });
    expect(published.revision).toBe(4);
    expect(published.profile.name).toBe("Updated name");
    vi.mocked(store.save).mockResolvedValue(null);
    await expect(service.save("owner", { profile, revision: 3 })).rejects.toThrow("another tab");
  });
  it("rejects executable links, invalid dates, duplicate IDs and detached references", () => {
    expect(profileSchema.safeParse({ ...profile, website: "javascript:alert(1)" }).success).toBe(
      false,
    );
    expect(profileSchema.safeParse({ ...profile, cvUrl: "//evil.example/cv" }).success).toBe(false);
    expect(
      profileSchema.safeParse({
        ...profile,
        experiences: [{ ...profile.experiences[0], start: "2026-02-30" }],
      }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...profile,
        projects: [profile.projects[0], profile.projects[0]],
      }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...profile,
        projects: [{ ...profile.projects[0], experienceId: "missing" }],
      }).success,
    ).toBe(false);
  });
  it("sends edited experience and project details to both the website and AI context", () => {
    const edited = {
      ...profile,
      experiences: profile.experiences.map((item) => ({
        ...item,
        position: "Updated position",
      })),
      title: "My new title",
    };
    const resources = getPortfolioResources(edited);
    const model = createCVModel(edited);
    expect(resources.experiences[0]?.role).toBe("Updated position");
    expect(formatAllCV(model)).toContain("Updated position");
    expect(formatAllCV(model)).toContain("My new title");
    expect(getPortfolioResources({ ...profile, projects: [] } as typeof profile).projects).toEqual(
      [],
    );
  });
});
