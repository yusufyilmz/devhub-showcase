import { describe, expect, it } from "vitest";

import { profile } from "@shared/config";
import {
  buildOwnerPortfolioKnowledge,
  buildPublicPortfolioKnowledge,
  type PublicPortfolioKnowledge,
  serializePublicKnowledge,
} from "@shared/lib/profiles";

const snapshot = {
  id: "person-a",
  isPublic: true,
  profile: {
    ...profile,
    customSections: [
      {
        id: "custom-hidden" as const,
        items: [
          {
            body: "Hidden section content",
            id: "secret-text",
            title: "Private note",
            url: "",
          },
        ],
        renderer: "text" as const,
        title: "Hidden section",
        visible: false,
      },
    ],
    name: "Alex Example",
    projects: [
      {
        ...profile.projects[0]!,
        id: "secret",
        name: "Hidden client project",
        public: false,
      },
      {
        ...profile.projects[0]!,
        id: "visible",
        name: "Published work",
        public: true,
      },
    ],
    sectionSettings: {
      education: { itemIds: [] },
      experience: { visible: false as const },
    },
  },
  revision: 3,
  updatedAt: "2026-10-30T00:00:00Z",
  username: "person-a",
};
describe("portfolio AI knowledge projections", () => {
  it("builds only currently published, selected and visible facts", () => {
    const knowledge = buildPublicPortfolioKnowledge(snapshot)!;
    const text = serializePublicKnowledge(knowledge);
    expect(text).toContain("Alex Example");
    expect(text).toContain("Published work");
    expect(text).not.toContain("Hidden client project");
    expect(text).not.toContain("Hidden section content");
    expect(knowledge.sections.some((section) => section.id === "experience")).toBe(false);
    expect(knowledge.sections.some((section) => section.id === "education")).toBe(false);
    expect(buildPublicPortfolioKnowledge({ ...snapshot, isPublic: false })).toBeNull();
  });
  it("keeps private knowledge complete and detached, and updates source revisions", () => {
    const owner = buildOwnerPortfolioKnowledge(snapshot);
    expect(owner.profile.projects[0]?.name).toBe("Hidden client project");
    owner.profile.name = "Changed only here";
    expect(snapshot.profile.name).toBe("Alex Example");
    const next = buildPublicPortfolioKnowledge({
      ...snapshot,
      profile: { ...snapshot.profile, name: "Alex Updated" },
      revision: 4,
    })!;
    expect(next.source.revision).toBe(4);
    expect(next.identity.name).toBe("Alex Updated");
    expect(() => buildOwnerPortfolioKnowledge({ ...snapshot, id: undefined })).toThrow("identity");
  });
  it("resolves visible custom sources independently and never exposes private projects", () => {
    const section = {
      id: "custom-portfolio" as const,
      items: [],
      renderer: "cards" as const,
      source: {
        field: "projects" as const,
        itemIds: ["secret", "visible"],
        type: "profile" as const,
      },
      title: "Selected projects",
      visible: true,
    };
    const knowledge = buildPublicPortfolioKnowledge({
      ...snapshot,
      profile: { ...snapshot.profile, customSections: [section] },
    })!;
    expect(
      knowledge.sections.find(({ id }) => id === section.id)?.items.map(({ title }) => title),
    ).toEqual(["Published work"]);
    const serialized = serializePublicKnowledge({
      ...knowledge,
      profile: snapshot.profile,
    } as PublicPortfolioKnowledge);
    expect(serialized).not.toContain("Hidden client project");
  });
});
