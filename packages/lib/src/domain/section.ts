import {
  authorableSections,
  authorableSectionTypes,
  customSectionViews,
  getSectionRenderers,
  getSocialWork,
  type PortfolioSectionId,
  sectionCompositionIds,
  sectionRegistry,
} from "@shared/content";
import { z } from "zod";

function definition<Kind extends PortfolioSectionId>(kind: Kind) {
  return z
    .object({
      id: z.literal(kind),
      kind: z.literal(kind),
      renderer: z.enum(sectionRegistry[kind].renderers),
      source: z
        .object({
          type: z.literal("profile"),
          field: z.literal(sectionRegistry[kind].source),
        })
        .strict(),
      settings: z.object({ visible: z.boolean() }).strict(),
    })
    .strict();
}
/** Validates normalized built-in definitions with fixed source bindings. */
export const portfolioSectionSchema = z.discriminatedUnion("kind", [
  definition("about"),
  definition("experience"),
  definition("projects"),
  definition("skills"),
  definition("education"),
  definition("languages"),
]);

function preferences<const Renderers extends readonly [string, ...string[]]>(
  renderers: Renderers,
) {
  return z
    .object({
      renderer: z.enum(renderers).optional(),
      visible: z.boolean().optional(),
      itemIds: z
        .array(z.string().min(1).max(200))
        .max(100)
        .refine(
          (ids) => new Set(ids).size === ids.length,
          "Select each item once",
        )
        .optional(),
    })
    .strict()
    .optional();
}
export const sectionSettingsSchema = z
  .object({
    about: preferences(sectionRegistry.about.renderers),
    experience: preferences(sectionRegistry.experience.renderers),
    projects: preferences(sectionRegistry.projects.renderers),
    skills: preferences(sectionRegistry.skills.renderers),
    education: preferences(sectionRegistry.education.renderers),
    languages: preferences(sectionRegistry.languages.renderers),
  })
  .strict();

const customId = z.templateLiteral(["custom-", z.uuid()]);
export const portfolioEntryIdSchema = z.union([
  z.enum([
    "about",
    "experience",
    "projects",
    "skills",
    "education",
    "languages",
  ]),
  customId,
]);
const optionalSectionUrl = z
  .union([z.url().refine((url) => /^https?:\/\//i.test(url)), z.literal("")])
  .optional();
const customSectionBase = z
  .object({
    id: customId,
    title: z.string().trim().min(1).max(160),
    composition: z.enum(sectionCompositionIds).optional(),
    sectionType: z.enum(authorableSectionTypes).optional(),
    source: z
      .object({
        type: z.literal("profile"),
        field: z.enum([
          "projects",
          "experiences",
          "education",
          "skills",
          "languages",
          "about",
        ]),
        itemIds: z
          .array(z.string().min(1).max(200))
          .max(100)
          .refine((ids) => new Set(ids).size === ids.length)
          .optional(),
      })
      .strict()
      .optional(),
    options: z
      .object({
        description: z.string().max(6000).optional(),
        alignment: z.enum(["left", "center", "right"]).optional(),
        columns: z
          .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
          .optional(),
        email: z.union([z.email(), z.literal("")]).optional(),
        actionUrl: optionalSectionUrl,
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        mediaUrl: optionalSectionUrl,
        posterUrl: optionalSectionUrl,
      })
      .strict()
      .optional(),
    renderer: z.enum(customSectionViews).default("list"),
    visible: z.boolean().default(true),
    items: z
      .array(
        z
          .object({
            id: z.uuid(),
            title: z.string().trim().min(1).max(200),
            body: z.string().trim().max(6000),
            value: z.string().max(200).optional(),
            period: z.string().max(160).optional(),
            code: z.string().max(6000).optional(),
            details: z.array(z.string().max(500)).max(30).optional(),
            captionsUrl: optionalSectionUrl,
            imageUrl: z
              .union([
                z.url().refine((value) => /^https?:\/\//i.test(value)),
                z.literal(""),
              ])
              .optional(),
            url: z.union([
              z
                .url()
                .refine(
                  (value) => /^https?:\/\//i.test(value),
                  "Use an http or https URL",
                ),
              z.literal(""),
            ]),
          })
          .strict(),
      )
      .max(30)
      .refine(
        (items) => new Set(items.map(({ id }) => id)).size === items.length,
        "Each item needs a unique ID",
      ),
  })
  .strict();

export const customSectionSchema = customSectionBase.superRefine(
  (section, ctx) => {
    if (section.sectionType) validateSectionType(section, ctx);
    if (
      !["youtube", "instagram", "pinterest"].includes(section.composition ?? "")
    )
      return;
    section.items.forEach((item, index) => {
      if (getSocialWork(item.url)?.provider !== section.composition)
        ctx.addIssue({
          code: "custom",
          path: ["items", index, "url"],
          message: `Use a public ${section.composition} work URL (video, post/reel or pin)`,
        });
    });
  },
);

function validateSectionType(
  section: z.infer<typeof customSectionBase>,
  ctx: z.RefinementCtx,
) {
  const type = section.sectionType;
  if (!type) return;
  if (
    !(getSectionRenderers(type) as readonly string[]).includes(section.renderer)
  )
    ctx.addIssue({
      code: "custom",
      path: ["renderer"],
      message: "Choose a compatible section layout",
    });
  if (
    section.source &&
    !(authorableSections[type].sources as readonly string[]).includes(
      section.source.field,
    )
  )
    ctx.addIssue({
      code: "custom",
      path: ["source"],
      message: "Choose a compatible content source",
    });
  const social = ["youtube", "instagram", "pinterest"].includes(type)
    ? type
    : null;
  if (social)
    section.items.forEach((item, index) => {
      if (getSocialWork(item.url)?.provider !== social)
        ctx.addIssue({
          code: "custom",
          path: ["items", index, "url"],
          message: `Use a public ${social} work URL`,
        });
    });
}
