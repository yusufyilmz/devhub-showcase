import type { PortfolioProfile } from "@shared/content";
import { z } from "zod";

import { profileSchema, validateProfile } from "./profile";

export const aiEditFields = [
  "name",
  "title",
  "summary",
  "about",
  "location",
  "experiences",
  "education",
  "projects",
  "skills",
  "languages",
  "portfolioType",
  "portfolioLanguage",
  "cvLanguage",
  "cvLayout",
  "cvSettings",
  "appearance",
  "hero",
  "sectionOrder",
  "sectionSequence",
  "sectionSettings",
  "customSections",
] as const;
export const aiEditProposalSchema = z
  .object({
    changes: z
      .array(
        z
          .object({
            field: z.enum(aiEditFields),
            reason: z.string().min(1).max(1000),
            value: z.string().max(120000),
          })
          .strict(),
      )
      .max(12),
    summary: z.string().min(1).max(3000),
  })
  .strict()
  .refine(
    (value) => new Set(value.changes.map((change) => change.field)).size === value.changes.length,
    "Each field may appear once",
  );
export const aiEditProfileContract = z.toJSONSchema(profileSchema, { unrepresentable: "any" });
export type AiEditProposal = z.infer<typeof aiEditProposalSchema>;
export const aiEditRequestSchema = z
  .object({
    draft: profileSchema,
    message: z.string().trim().min(1).max(4000),
    profileId: z.string().min(1).max(100),
    requestId: z.uuid(),
    revision: z.number().int().min(1),
  })
  .strict();
export const aiEditJsonSchema = {
  additionalProperties: false,
  properties: {
    changes: {
      items: {
        additionalProperties: false,
        properties: {
          field: { enum: [...aiEditFields], type: "string" },
          reason: { type: "string" },
          value: {
            description:
              "The complete replacement field value encoded as a JSON string. Preserve unaffected entries.",
            type: "string",
          },
        },
        required: ["field", "value", "reason"],
        type: "object",
      },
      type: "array",
    },
    summary: { type: "string" },
  },
  required: ["summary", "changes"],
  type: "object",
};
/** Revalidate selected changes and the complete result. No database writes. */
export function applyAiEdit(
  profile: PortfolioProfile,
  proposal: AiEditProposal,
  selected: readonly string[] = proposal.changes.map((change) => change.field),
): PortfolioProfile {
  const valid = aiEditProposalSchema.parse(proposal);
  const fields = new Set(valid.changes.map((change) => change.field));
  if (selected.some((field) => !fields.has(field as (typeof aiEditFields)[number])))
    throw new Error("Unknown proposal selection.");
  const next: Record<string, unknown> = { ...structuredClone(profile) };
  for (const change of valid.changes)
    if (selected.includes(change.field)) next[change.field] = JSON.parse(change.value);
  const result = validateProfile(next);
  const existing = new Map(profile.projects.map((project) => [project.id, project.public]));
  if (
    result.projects.some((project) =>
      existing.has(project.id) ? project.public !== existing.get(project.id) : project.public,
    )
  )
    throw new Error("Change project publication manually.");
  return result;
}
export function validateAiEdit(profile: PortfolioProfile, value: unknown): AiEditProposal {
  const proposal = aiEditProposalSchema.parse(value);
  applyAiEdit(profile, proposal);
  return proposal;
}

export function serializeAiEditContext(profile: PortfolioProfile) {
  const context = JSON.stringify({ fieldContract: aiEditProfileContract, profile });
  if (context.length > 180000) throw new RangeError("Draft is too large for the assistant.");
  return context;
}
