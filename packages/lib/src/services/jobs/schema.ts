import { z } from "zod";

const optionalText = (length: number) => z.string().trim().max(length).default("");
const salary = z.number().int().nonnegative().max(100_000_000).nullable().default(null);

export const jobFilters = z
  .object({
    country: z.string().regex(/^[a-z]{2}$/),
    currency: z
      .string()
      .regex(/^(?:[A-Z]{3})?$/)
      .default(""),
    employment: z.enum(["", "full-time", "contract", "freelance"]).default(""),
    excludedCompanies: optionalText(250),
    excludedKeywords: optionalText(250),
    experience: z.enum(["", "mid", "senior", "staff", "lead", "principal"]).default(""),
    keywords: optionalText(250),
    location: optionalText(120),
    maximum: salary,
    minimum: salary,
    postedDays: z.number().int().min(0).max(30).default(0),
    preferredCompanies: optionalText(250),
    sponsorship: z.boolean().default(false),
    title: z.string().trim().min(1).max(120),
    workplace: z.enum(["", "remote", "hybrid", "onsite"]).default(""),
  })
  .refine(({ minimum, maximum }) => minimum === null || maximum === null || minimum <= maximum, {
    message: "Maximum salary must be at least the minimum.",
  })
  .refine(({ minimum, maximum, currency }) => (minimum === null && maximum === null) || currency, {
    message: "Enter a currency to filter by salary.",
  });

export const savedJobSearch = z.object({
  enabled: z.boolean(),
  filters: jobFilters,
  hours: z.union([z.literal(3), z.literal(6), z.literal(12), z.literal(24)]),
  name: z.string().trim().min(1).max(100),
  threshold: z.number().int().min(0).max(100),
});

export const applicationStatuses = [
  "preparing",
  "opened",
  "applied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export const listingSchema = z.object({
  company: z.string(),
  currency: z.string(),
  date: z.string().nullable(),
  dateKind: z.enum(["posted", "updated"]),
  description: z.string(),
  employment: z.string(),
  location: z.string(),
  maximum: z.number().nullable(),
  minimum: z.number().nullable(),
  source: z.enum(["adzuna", "jooble", "linkedin"]),
  sourceId: z.string(),
  title: z.string().min(1),
  url: z.url({ protocol: /^https?$/ }).refine((value) => {
    const url = new URL(value);
    return !url.username && !url.password;
  }),
});

export type JobFilters = z.output<typeof jobFilters>;
export type JobListing = z.output<typeof listingSchema>;
export type SavedJobSearch = z.output<typeof savedJobSearch>;
