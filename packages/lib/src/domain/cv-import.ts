import type { PortfolioProfile } from "@shared/content";
import { z } from "zod";

const text = (max = 200) => z.string().trim().max(max);
const nullableText = (max = 200) => text(max).nullable();
// URI is not an OpenAI structured-output format; use a supported pattern,
// with full URL validation again after generation.
const url = z
  .string()
  .max(2048)
  .regex(/^https?:\/\/\S+$/)
  .refine((value) => URL.canParse(value))
  .nullable();
const date = z
  .string()
  .regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/)
  .nullable();
export const cvExtractionSchema = z.strictObject({
  about: z.array(text(6000)).max(30),
  education: z
    .array(
      z.strictObject({
        degree: nullableText(),
        end: date,
        field: nullableText(),
        institution: nullableText(),
        start: date,
        url,
      }),
    )
    .max(30),
  email: z.email().nullable(),
  experiences: z
    .array(
      z.strictObject({
        achievements: z.array(text(3000)).max(50),
        company: nullableText(),
        companyUrl: url,
        end: date,
        ongoing: z.boolean(),
        position: nullableText(),
        start: date,
      }),
    )
    .max(60),
  github: url,
  isCv: z.boolean(),
  languages: z
    .array(z.strictObject({ language: nullableText(100), proficiency: nullableText(100) }))
    .max(30),
  linkedin: url,
  location: nullableText(),
  name: nullableText(),
  phone: nullableText(80),
  projects: z
    .array(
      z.strictObject({
        company: nullableText(),
        description: nullableText(5000),
        name: nullableText(),
        skills: z.array(text(100)).max(60),
        sourceUrl: url,
        url,
      }),
    )
    .max(100),
  skills: z
    .array(z.strictObject({ group: text(80).min(1), items: z.array(text(100).min(1)).max(100) }))
    .max(30),
  summary: nullableText(3000),
  title: nullableText(),
  warnings: z.array(text(500)).max(30),
  website: url,
});
export type CvExtraction = z.infer<typeof cvExtractionSchema>;
export const cvExtractionJsonSchema = z.toJSONSchema(cvExtractionSchema);
export const cvImportGroups = [
  "personal",
  "experiences",
  "education",
  "projects",
  "skills",
  "languages",
  "about",
] as const;
export type CvImportGroup = (typeof cvImportGroups)[number];
export function cvDate(value: string | null) {
  if (!value) return "";
  return value.length === 4 ? `${value}-01-01` : value.length === 7 ? `${value}-01` : value;
}
/** Candidate only: no storage, sharing, ownership or layout mutations. */
export function createCvDraft(base: PortfolioProfile, result: CvExtraction): PortfolioProfile {
  const personal = Object.fromEntries(
    [
      "name",
      "title",
      "summary",
      "email",
      "phone",
      "location",
      "website",
      "github",
      "linkedin",
    ].flatMap((key) => {
      const value = result[key as keyof CvExtraction];
      return typeof value === "string" && value.trim() ? [[key, value]] : [];
    }),
  );
  return {
    ...base,
    ...personal,
    about: result.about,
    education: result.education.map((item) => ({
      degree: item.degree ?? "",
      end: cvDate(item.end),
      field: item.field ?? "",
      id: crypto.randomUUID(),
      institution: item.institution ?? "",
      start: cvDate(item.start),
      url: item.url ?? "",
    })),
    experiences: result.experiences.map((item) => ({
      achievements: item.achievements,
      company: item.company ?? "",
      companyUrl: item.companyUrl ?? "",
      end: item.ongoing ? null : cvDate(item.end),
      id: crypto.randomUUID(),
      position: item.position ?? "",
      start: cvDate(item.start),
    })),
    languages: result.languages.map((item) => ({
      id: crypto.randomUUID(),
      language: item.language ?? "",
      proficiency: item.proficiency ?? "",
    })),
    projects: result.projects.map((item) => ({
      ...item,
      company: item.company ?? "Personal",
      description: item.description ?? "",
      experienceId: null,
      id: crypto.randomUUID(),
      name: item.name ?? "",
      public: false,
    })),
    skills: Object.fromEntries(
      result.skills
        .filter(({ group }) => !["__proto__", "prototype", "constructor"].includes(group))
        .map(({ group, items }) => [group, items]),
    ),
  };
}
export function applyCvDraft(
  base: PortfolioProfile,
  candidate: PortfolioProfile,
  selected: CvImportGroup[],
): PortfolioProfile {
  const next = { ...base };
  if (selected.includes("personal")) {
    for (const key of [
      "name",
      "title",
      "summary",
      "email",
      "phone",
      "location",
      "website",
      "github",
      "linkedin",
    ] as const)
      next[key] = candidate[key];
  }
  for (const key of cvImportGroups) {
    if (key !== "personal" && selected.includes(key))
      Object.assign(next, { [key]: candidate[key] });
  }
  if (selected.includes("experiences")) {
    const ids = new Set(next.experiences.map(({ id }) => id));
    next.projects = next.projects.map((project) =>
      project.experienceId && !ids.has(project.experienceId)
        ? { ...project, experienceId: null }
        : project,
    );
  }
  return next;
}
export function cvReviewNotes(result: CvExtraction) {
  const notes = [...result.warnings];
  if (
    [...result.experiences, ...result.education].some((item) =>
      [item.start, item.end].some((date) => date && date.length < 10),
    )
  )
    notes.push(
      "Partial dates use the first day of the given month or year. Review them before saving.",
    );
  notes.push(
    "Missing details stay blank or retain your current personal details. Complete required fields before saving. Imported projects start hidden from the public projects section.",
  );
  return notes;
}
