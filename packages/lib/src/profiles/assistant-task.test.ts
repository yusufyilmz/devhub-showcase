import { describe, expect, it } from "vitest";

import { profile } from "@shared/config";

import { aiEditProposalSchema, aiEditRequestSchema, applyAiEdit } from "./ai-edit";
import { writingProposal, writingSource } from "./assistant-task";
import { validateProfile } from "./profile";

const draft = validateProfile(profile);
const task = {
  field: "projects" as const,
  itemId: draft.projects[0]?.id,
  kind: "writing" as const,
  length: "concise" as const,
  tone: "direct" as const,
};
describe("focused assistant contracts", () => {
  it("exposes only the selected source and reconstructs one permitted text change", () => {
    const source = writingSource(draft, task);
    expect(Object.keys(source).sort()).toEqual(["context", "text"]);
    const original = {
      ...draft,
      projects: draft.projects.map((p, index) => ({
        ...p,
        description: index === 0 ? "Builds reusable tools." : p.description,
      })),
    };
    const proposal = writingProposal(original, task, "Creates reusable tools.");
    const result = applyAiEdit(original, proposal);
    expect(result.projects[0]?.description).toBe("Creates reusable tools.");
    expect(result.projects.slice(1)).toEqual(original.projects.slice(1));
    expect(result.projects[0]?.public).toBe(original.projects[0]?.public);
    expect(result.projects[0]?.id).toBe(original.projects[0]?.id);
    expect(original.projects[0]?.description).toBe("Builds reusable tools.");
  });
  it("rejects new or omitted protected facts and unknown source IDs", () => {
    const input = { ...draft, summary: "Reduced latency by 20% in 2025." };
    const summary = { ...task, field: "summary" as const };
    expect(() => writingProposal(input, summary, "Reduced latency by 80% in 2025.")).toThrow();
    expect(() => writingProposal(input, summary, "Reduced latency.")).toThrow();
    expect(() => writingSource(draft, { ...task, itemId: "missing" })).toThrow();
  });
  it("validates feedback fields without changing the legacy proposal or request contracts", () => {
    expect(
      aiEditProposalSchema.parse({ changes: [], summary: "No changes" }).feedback,
    ).toBeUndefined();
    expect(
      aiEditProposalSchema.safeParse({
        changes: [],
        feedback: [{ field: "billing", issue: "x", needsInput: true, recommendation: "x" }],
        summary: "Check",
      }).success,
    ).toBe(false);
    expect(
      aiEditRequestSchema.safeParse({
        draft,
        message: "x",
        profileId: "id",
        requestId: "11111111-1111-4111-8111-111111111111",
        revision: 1,
        task: { kind: "publish" },
      }).success,
    ).toBe(false);
  });
});
