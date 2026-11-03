import { z } from "zod";

import type { PortfolioProfile } from "@shared/config";

import { profileSchema } from "./profile";

export const cvSectionOrder = [
  "experience",
  "projects",
  "education",
  "skills",
  "languages",
] as const;
export const cvVariantSchema = z
  .object({
    id: z.uuid(),
    name: z.string().trim().min(1).max(100),
    order: z
      .array(z.enum(cvSectionOrder))
      .length(5)
      .refine((items) => new Set(items).size === 5, "Include each CV section once"),
    profile: profileSchema,
    sourceRevision: z.number().int().min(0),
  })
  .strict();
export type CvVariant = z.infer<typeof cvVariantSchema>;
export const cvLibrarySchema = z
  .array(cvVariantSchema)
  .max(8)
  .refine(
    (items) => new Set(items.map((item) => item.id)).size === items.length,
    "Unique version IDs required",
  );
export const cvLibraryWriteSchema = z
  .object({ revision: z.number().int().min(0), variants: cvLibrarySchema })
  .strict();
export function createCvVariant(
  profile: PortfolioProfile,
  sourceRevision: number,
  name: string,
): CvVariant {
  return cvVariantSchema.parse({
    id: crypto.randomUUID(),
    name,
    order: [...cvSectionOrder],
    profile: structuredClone(profile),
    sourceRevision,
  });
}
/** Local evidence matching, not a claim that every requirement is met. Job text is data only. */
export function suggestCvEvidence(profile: PortfolioProfile, job: string) {
  const words = new Set(
    (job.toLowerCase().match(/[\p{L}\p{N}+#.]{3,}/gu) ?? []).filter(
      (word) =>
        ![
          "the",
          "and",
          "for",
          "with",
          "that",
          "you",
          "your",
          "our",
          "are",
          "will",
          "from",
          "have",
          "this",
          "work",
          "team",
        ].includes(word),
    ),
  );
  const matching = (text: string) =>
    [...words].filter((word) => text.toLowerCase().includes(word)).slice(0, 12);
  return [
    ...profile.experiences.map((item) => ({
      field: "experiences" as const,
      id: item.id,
      matched: matching([item.position, item.company, ...item.achievements].join(" ")),
      title: `${item.position} · ${item.company}`,
    })),
    ...profile.projects.map((item) => ({
      field: "projects" as const,
      id: item.id,
      matched: matching([item.description, ...item.skills].join(" ")),
      title: item.name,
    })),
  ]
    .filter((item) => item.matched.length)
    .sort((a, b) => b.matched.length - a.matched.length);
}
export function tailorCvVariant(
  source: CvVariant,
  selected: ReturnType<typeof suggestCvEvidence>,
): CvVariant {
  const profile = structuredClone(source.profile);
  profile.experiences = profile.experiences.filter((item) =>
    selected.some((choice) => choice.field === "experiences" && choice.id === item.id),
  );
  profile.projects = profile.projects.filter((item) =>
    selected.some((choice) => choice.field === "projects" && choice.id === item.id),
  );
  return {
    ...source,
    id: crypto.randomUUID(),
    name: `${source.name.slice(0, 80)} · tailored`,
    profile,
  };
}
