import { describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";
import { buildOwnerPortfolioKnowledge } from "@shared/lib/profiles";

import { PortfolioEditModel } from "./portfolio-edit-model";

const knowledge = buildOwnerPortfolioKnowledge({
  id: "owner",
  profile: {
    ...profile,
    projects: [{ ...profile.projects[0]!, name: "Confidential client", public: false }],
    summary: "Builds accessible interfaces.",
  },
  revision: 1,
  updatedAt: "",
  username: "owner",
});
describe("focused writing provider", () => {
  it("sends only selected text/context and returns an unapplied validated proposal", async () => {
    const create = vi.fn().mockResolvedValue({
      output_text: JSON.stringify({ text: "Creates accessible interfaces." }),
      status: "completed",
    });
    const model = new PortfolioEditModel({
      responses: { create },
    } as unknown as ConstructorParameters<typeof PortfolioEditModel>[0]);
    const result = await model.propose(knowledge, "Rewrite", undefined, {
      field: "summary",
      kind: "writing",
      length: "concise",
      tone: "professional",
    });
    expect(result.changes[0]?.field).toBe("summary");
    expect(JSON.stringify(create.mock.calls[0]?.[0])).not.toContain("Confidential client");
    expect(create.mock.calls[0]?.[0].store).toBe(false);
    expect(create.mock.calls[0]?.[0].text.format.strict).toBe(true);
    expect(knowledge.profile.summary).toBe("Builds accessible interfaces.");
    create.mockResolvedValue({ output_text: "", status: "incomplete" });
    await expect(
      model.propose(knowledge, "Rewrite", undefined, {
        field: "summary",
        kind: "writing",
        length: "standard",
        tone: "direct",
      }),
    ).rejects.toThrow();
  });
  it("returns section-specific feedback while leaving source data unchanged", async () => {
    const feedback = [
      {
        field: "summary",
        issue: "No audience is stated",
        needsInput: true,
        recommendation: "Explain who benefits from your work.",
      },
    ];
    const create = vi.fn().mockResolvedValue({
      output_text: JSON.stringify({ changes: [], feedback, summary: "Review" }),
      status: "completed",
    });
    const model = new PortfolioEditModel({
      responses: { create },
    } as unknown as ConstructorParameters<typeof PortfolioEditModel>[0]);
    expect(
      (await model.propose(knowledge, "Review", undefined, { kind: "feedback" })).feedback,
    ).toEqual(feedback);
    expect(create.mock.calls[0]?.[0].instructions).toContain("section by section");
  });
});
