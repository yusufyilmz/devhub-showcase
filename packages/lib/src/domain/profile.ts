import { MAX_CUSTOM_SECTIONS, type PortfolioProfile, portfolioSectionIds } from "@shared/content";
import { z } from "zod";

import { customSectionSchema, portfolioEntryIdSchema, sectionSettingsSchema } from "./section";
import { usernameSchema } from "./username";

const text = (max = 200) => z.string().trim().min(1, "This field is required").max(max);
const safeUrl = z.url().refine((value) => /^https?:\/\//i.test(value), "Use an http or https URL");
const optionalUrl = safeUrl.nullable();
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .refine((value) => {
    const parsed = new Date(value);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Enter a valid date");
const id = text(100).regex(
  /^[a-zA-Z0-9_-]+$/,
  "Use letters, numbers, underscores or hyphens for IDs",
);
const dated = { end: date.nullable(), start: date };
const chronological = (value: { start: string; end: string | null }) =>
  !value.end || value.end >= value.start;

export const profileSchema = z
  .object({
    about: z.array(text(6000)).max(30),
    appearance: z
      .object({
        accent: z.enum(["cyan", "violet", "emerald"]),
        defaultTheme: z.enum(["system", "light", "dark"]),
        theme: z.enum(["studio", "paper", "graphite", "bloom"]).default("studio"),
      })
      .default({ accent: "cyan", defaultTheme: "dark", theme: "studio" }),
    birthDate: date
      .refine(
        (value) => value <= new Date().toISOString().slice(0, 10),
        "Birthdate cannot be in the future",
      )
      .optional(),
    customSections: z.array(customSectionSchema).max(MAX_CUSTOM_SECTIONS).optional(),
    cvLanguage: z.enum(["en", "es", "tr"]).default("en"),
    cvLayout: z.enum(["classic", "editorial", "compact"]).default("classic"),
    cvSettings: z
      .object({
        fontSize: z.union([z.literal(9), z.literal(10), z.literal(11)]),
        includeLanguages: z.boolean(),
        includeProjects: z.boolean(),
        pageSize: z.enum(["A4", "LETTER"]),
        showEmail: z.boolean(),
        showPhone: z.boolean(),
      })
      .default({
        fontSize: 9,
        includeLanguages: true,
        includeProjects: true,
        pageSize: "A4",
        showEmail: true,
        showPhone: true,
      }),
    cvUrl: z.union([safeUrl, z.literal("/cv.pdf")]).default("/cv.pdf"),
    education: z
      .array(
        z
          .object({
            degree: text(),
            end: date,
            field: text(),
            id,
            institution: text(),
            start: date,
            url: z.union([safeUrl, z.literal("")]),
          })
          .refine(chronological, {
            message: "End date must follow the start date",
            path: ["end"],
          }),
      )
      .max(30),
    email: z.email(),
    experiences: z
      .array(
        z
          .object({
            company: text(),
            companyUrl: z.union([safeUrl, z.literal("")]),
            id,
            position: text(),
            ...dated,
            achievements: z.array(text(3000)).max(50),
          })
          .refine(chronological, {
            message: "End date must follow the start date",
            path: ["end"],
          }),
      )
      .max(60),
    github: z.union([safeUrl, z.literal("")]),
    hero: z
      .object({
        kind: z.enum(["image", "video"]),
        overlay: z.enum(["soft", "strong"]),
        position: z.enum(["center", "top", "bottom"]),
        poster: z.union([safeUrl, z.literal("")]).optional(),
        url: safeUrl,
      })
      .strict()
      .optional(),
    languages: z.array(z.object({ id, language: text(100), proficiency: text(100) })).max(30),
    linkedin: z.union([safeUrl, z.literal("")]),
    location: text(),
    name: text(),
    phone: z.string().trim().max(80),
    portfolioLanguage: z.enum(["en", "es", "tr"]).default("en"),
    portfolioType: z.enum(["engineer", "designer", "consultant", "minimal"]).default("engineer"),
    projects: z
      .array(
        z.object({
          company: text(),
          coverImage: optionalUrl.optional(),
          description: text(5000),
          experienceId: id.nullable(),
          id,
          name: text(),
          public: z.boolean(),
          skills: z.array(text(100)).max(60),
          sourceUrl: optionalUrl,
          url: optionalUrl,
        }),
      )
      .max(100),
    sectionOrder: z
      .array(z.enum(portfolioSectionIds))
      .length(portfolioSectionIds.length)
      .refine((order) => new Set(order).size === order.length, "Include each section once")
      .optional(),
    sectionSequence: z
      .array(portfolioEntryIdSchema)
      .max(MAX_CUSTOM_SECTIONS + 6)
      .optional(),
    sectionSettings: sectionSettingsSchema.optional(),
    skills: z
      .record(
        text(80).refine((key) => !["__proto__", "constructor", "prototype"].includes(key)),
        z.array(text(100)).max(100),
      )
      .refine((groups) => Object.keys(groups).length <= 30, "Use at most 30 skill groups"),
    summary: text(3000),
    templateChosen: z.boolean().default(true),
    title: text(),
    website: z.union([safeUrl, z.literal("")]),
  })
  .superRefine((value, ctx) => {
    for (const key of ["experiences", "projects", "education", "languages"] as const) {
      const ids = value[key].map((item) => item.id);
      if (new Set(ids).size !== ids.length)
        ctx.addIssue({
          code: "custom",
          message: "Each item needs a unique ID",
          path: [key],
        });
    }
    const expectedSections = [
      ...portfolioSectionIds,
      ...(value.customSections ?? []).map(({ id }) => id),
    ];
    if (new Set(expectedSections).size !== expectedSections.length)
      ctx.addIssue({
        code: "custom",
        message: "Each section needs a unique ID",
        path: ["customSections"],
      });
    if (
      value.sectionSequence &&
      (value.sectionSequence.length !== expectedSections.length ||
        new Set(value.sectionSequence).size !== expectedSections.length ||
        value.sectionSequence.some((id) => !expectedSections.includes(id)))
    )
      ctx.addIssue({
        code: "custom",
        message: "Include each existing section once",
        path: ["sectionSequence"],
      });
    const employers = new Set(value.experiences.map((item) => item.id));
    value.projects.forEach((project, index) => {
      if (project.experienceId && !employers.has(project.experienceId))
        ctx.addIssue({
          code: "custom",
          message: "Choose an existing experience or Personal",
          path: ["projects", index, "experienceId"],
        });
    });
  });
export type EditableProfile = z.infer<typeof profileSchema>;
export function validateProfile(value: unknown): PortfolioProfile {
  return profileSchema.parse(value);
}
export const saveProfileSchema = z.object({
  isPublic: z.boolean().optional(),
  profile: profileSchema,
  revision: z.number().int().min(1),
  username: usernameSchema.optional(),
});
