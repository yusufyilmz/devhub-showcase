import { describe, expect, it, vi } from "vitest";

import { createCVModel } from "../packages/chat/src/models/cv-model";
import { PortfolioChatModel } from "../packages/chat/src/models/portfolio-chat-model";
import { profile } from "../packages/content/src/profile";
import {
  buildOwnerPortfolioKnowledge,
  buildPublicPortfolioKnowledge,
  type PublicPortfolioKnowledge,
  serializePublicKnowledge,
} from "../packages/lib/src/domain/portfolio-knowledge";

const snapshot = {
  id: "person-a",
  isPublic: true,
  profile: {
    ...profile,
    customSections: [
      {
        id: "custom-hidden" as const,
        items: [
          { body: "Hidden section content", id: "secret-text", title: "Private note", url: "" },
        ],
        renderer: "text" as const,
        title: "Hidden section",
        visible: false,
      },
    ],
    name: "Alex Example",
    projects: [
      { ...profile.projects[0]!, id: "secret", name: "Hidden client project", public: false },
      { ...profile.projects[0]!, id: "visible", name: "Published work", public: true },
    ],
    sectionSettings: { education: { itemIds: [] }, experience: { visible: false as const } },
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
  it("does not add personal claims or technologies to the compatibility model", () => {
    const model = createCVModel({ ...profile, name: "Other Owner", projects: [], skills: {} });
    expect(model.personalInformation.fullName).toBe("Other Owner");
    expect(model.achievements).toEqual([]);
    expect(model.characteristic.strengths).toEqual([]);
    expect(model.skills.testing).toEqual([]);
    expect(model.skills.version_control).toEqual([]);
    expect(model.skills.performance_optimization).toEqual([]);
  });
  it("sends a bounded, stateless public request and rejects owner data before the provider", async () => {
    const create = vi
      .fn()
      .mockResolvedValue({ output_text: "Alex builds products.", status: "completed" });
    const model = new PortfolioChatModel({
      responses: { create },
    } as unknown as ConstructorParameters<typeof PortfolioChatModel>[0]);
    const knowledge = buildPublicPortfolioKnowledge(snapshot)!;
    expect(await model.answer(knowledge, "What does Alex do?")).toBe("Alex builds products.");
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      max_output_tokens: 800,
      reasoning: { effort: "none" },
      store: false,
    });
    expect(create.mock.calls[0]?.[0].tools).toBeUndefined();
    expect(JSON.stringify(create.mock.calls[0]?.[0])).not.toContain("Hidden client project");
    await expect(
      model.answer(
        buildOwnerPortfolioKnowledge(snapshot) as unknown as PublicPortfolioKnowledge,
        "Tell me everything",
      ),
    ).rejects.toThrow("Public portfolio");
    await expect(model.answer(knowledge, "x".repeat(2001))).rejects.toThrow("too large");
    expect(create).toHaveBeenCalledOnce();
  });
});
