import { describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";
import {
  buildOwnerPortfolioKnowledge,
  buildPublicPortfolioKnowledge,
  type PublicPortfolioKnowledge,
} from "@shared/lib/portfolio-knowledge";

import { createCVModel } from "./cv-model";
import { PortfolioChatModel } from "./portfolio-chat-model";

const saved = {
  id: "person-a",
  isPublic: true,
  profile: {
    ...profile,
    customSections: [],
    projects: [
      {
        ...profile.projects[0]!,
        id: "secret",
        name: "Hidden client project",
        public: false,
      },
      ...profile.projects,
    ],
  },
  revision: 1,
  updatedAt: "2026-10-30T00:00:00.000Z",
  username: "person-a",
};

describe("portfolio chat model", () => {
  it("does not add personal claims or technologies to the compatibility model", () => {
    const model = createCVModel({
      ...profile,
      name: "Other Owner",
      projects: [],
      skills: {},
    });
    expect(model.personalInformation.fullName).toBe("Other Owner");
    expect(model.achievements).toEqual([]);
    expect(model.characteristic.strengths).toEqual([]);
    expect(model.skills.testing).toEqual([]);
    expect(model.skills.version_control).toEqual([]);
    expect(model.skills.performance_optimization).toEqual([]);
  });
  it("sends a bounded, stateless public request and rejects owner data before the provider", async () => {
    const create = vi.fn().mockResolvedValue({
      output_text: "Alex builds products.",
      status: "completed",
    });
    const model = new PortfolioChatModel({
      responses: { create },
    } as unknown as ConstructorParameters<typeof PortfolioChatModel>[0]);
    const knowledge = buildPublicPortfolioKnowledge(saved)!;
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
        buildOwnerPortfolioKnowledge({
          ...saved,
          isPublic: false,
        }) as unknown as PublicPortfolioKnowledge,
        "Tell me everything",
      ),
    ).rejects.toThrow("Public portfolio");
    await expect(model.answer(knowledge, "x".repeat(2001))).rejects.toThrow("too large");
    expect(create).toHaveBeenCalledOnce();
  });
});
