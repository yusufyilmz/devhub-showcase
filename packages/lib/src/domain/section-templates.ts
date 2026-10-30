import {
  type AuthorableSectionType,
  authorableSections,
  type CustomSection,
  getSectionRenderers,
  MAX_CUSTOM_SECTIONS,
  type PortfolioProfile,
  type SectionTemplateFile,
} from "@shared/content";
import { z } from "zod";

import { customSectionSchema } from "./section";
export const sectionTemplateFileSchema = z
  .object({
    format: z.literal("mydevstudio.sections"),
    includesContent: z.boolean(),
    name: z.string().trim().min(1).max(100),
    sections: z.array(customSectionSchema).max(MAX_CUSTOM_SECTIONS),
    version: z.literal(1),
  })
  .strict()
  .refine((value) => JSON.stringify(value).length <= 160_000, "Template is too large")
  .refine(
    (value) => new Set(value.sections.map(({ id }) => id)).size === value.sections.length,
    "Each section needs a unique ID",
  )
  .refine(
    (value) =>
      value.includesContent ||
      value.sections.every(
        (section) =>
          !section.items.length &&
          !section.source &&
          !section.options?.description &&
          !section.options?.email &&
          !section.options?.actionUrl &&
          section.options?.latitude === undefined &&
          section.options?.longitude === undefined &&
          !section.options?.mediaUrl &&
          !section.options?.posterUrl,
      ),
    "Configuration-only templates must omit authored content and profile bindings",
  );
export const savedSectionTemplateSchema = sectionTemplateFileSchema.safeExtend({
  id: z.uuid(),
});
export function createSectionTemplate(
  profile: PortfolioProfile,
  name: string,
  includeContent = false,
): SectionTemplateFile {
  const sections = (profile.customSections ?? []).map((section) => {
    if (includeContent) return structuredClone(section);
    const type = section.sectionType;
    return {
      composition: section.composition,
      id: section.id,
      items: [],
      options: section.options
        ? {
            alignment: section.options.alignment,
            columns: section.options.columns,
          }
        : undefined,
      renderer: section.renderer,
      sectionType: type,
      title: type ? authorableSections[type].name : "Custom section",
      visible: section.visible,
    };
  });
  return sectionTemplateFileSchema.parse({
    format: "mydevstudio.sections",
    includesContent: includeContent,
    name,
    sections,
    version: 1,
  });
}
export function applySectionTemplate(
  profile: PortfolioProfile,
  document: SectionTemplateFile,
  mode: "append" | "replace",
  newId: () => string,
): PortfolioProfile {
  const validated = sectionTemplateFileSchema.parse(document);
  const sections = validated.sections.map((section) => ({
    ...section,
    id: `custom-${newId()}` as CustomSection["id"],
    items: section.items.map((item) => ({ ...item, id: newId() })),
    source: section.source ? { ...section.source, itemIds: undefined } : undefined,
  }));
  const customSections =
    mode === "append" ? [...(profile.customSections ?? []), ...sections] : sections;
  if (customSections.length > MAX_CUSTOM_SECTIONS)
    throw new Error(`Use at most ${MAX_CUSTOM_SECTIONS} custom sections`);
  const old =
    mode === "append"
      ? (profile.sectionSequence ?? [])
      : (profile.sectionSequence ?? []).filter((id) => !id.startsWith("custom-"));
  return {
    ...profile,
    customSections,
    ...(profile.sectionSequence
      ? { sectionSequence: [...old, ...sections.map(({ id }) => id)] }
      : {}),
  };
}
export function sectionTypeFromPageForge(value: string): AuthorableSectionType | null {
  const normalized = value.replaceAll("_", "-").replace(/-section$/, "");
  const aliases: Record<string, AuthorableSectionType> = {
    experience: "work-experience",
    experiences: "work-experience",
    gallery: "gallery-grid",
    skills: "technical-skills",
    socials: "social-links",
    statistics: "stats",
  };
  const type = aliases[normalized] ?? normalized;
  return Object.hasOwn(authorableSections, type) ? (type as AuthorableSectionType) : null;
}
export function emptySection(type: AuthorableSectionType, newId: () => string): CustomSection {
  return {
    id: `custom-${newId()}`,
    items: [],
    renderer: getSectionRenderers(type)[0],
    sectionType: type,
    title: authorableSections[type].name,
    visible: true,
  };
}
