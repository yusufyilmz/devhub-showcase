import { createHash } from "node:crypto";

import { ZodError, type ZodIssue, z } from "zod";

const httpsUrl = z
  .url({ protocol: /^https$/ })
  .max(2048)
  .refine((value) => {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return (
      !url.username &&
      !url.password &&
      hostname !== "localhost" &&
      !hostname.endsWith(".localhost") &&
      !hostname.endsWith(".local") &&
      !hostname.endsWith(".internal") &&
      !/^\d+\.\d+\.\d+\.\d+$/.test(hostname) &&
      !hostname.includes(":")
    );
  }, "Enter a public HTTPS link.");

const optional = (max: number) => z.string().trim().max(max).optional();
const money = z.number().int().min(0).max(100_000_000).nullable().optional();
const isoDate = z.iso.datetime({ offset: true });

export const chatgptJobImportSchema = z.strictObject({
  jobs: z
    .array(
      z
        .strictObject({
          company: z.string().trim().min(1).max(180),
          evidenceUrl: httpsUrl.optional(),
          location: optional(180),
          matchReason: optional(1200),
          originalUrl: httpsUrl,
          postedAt: isoDate.nullable().optional(),
          salaryCurrency: z
            .string()
            .regex(/^[A-Z]{3}$/)
            .nullable()
            .optional(),
          salaryMax: money,
          salaryMin: money,
          spainEligible: z.boolean().nullable().optional(),
          title: z.string().trim().min(1).max(180),
          workModel: z.enum(["remote", "hybrid", "onsite", "unknown"]).optional(),
        })
        .refine(
          (job) => job.salaryMin == null || job.salaryMax == null || job.salaryMax >= job.salaryMin,
          { message: "Maximum salary cannot be below minimum salary." },
        ),
    )
    .max(5),
  report: z.strictObject({
    automationTitle: z.string().trim().min(1).max(150),
    generatedAt: isoDate,
    source: z.literal("chatgpt_automation"),
    summary: z.string().trim().max(3000),
  }),
  schemaVersion: z.literal(1),
});

export type ChatgptJobImport = z.infer<typeof chatgptJobImportSchema>;

export function normalizeChatgptJobUrl(value: string) {
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|fbclid$|gclid$|mc_cid$|mc_eid$)/i.test(key)) url.searchParams.delete(key);
  }
  const entries = [...url.searchParams.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  );
  url.search = "";
  for (const [key, entry] of entries) url.searchParams.append(key, entry);
  url.hostname = url.hostname.toLowerCase();
  return url.toString();
}

function publicImportMessage(issue: ZodIssue) {
  const path = issue.path.join(".");
  if (path.includes("Url")) return "Enter a public HTTPS link.";
  if (path.endsWith("At")) return "Enter a valid timestamp.";
  if (issue.code === "unrecognized_keys") return "Remove unsupported fields.";
  if (issue.code === "too_big") return "Shorten this value.";
  if (issue.code === "too_small") return "Enter a value.";
  return issue.message.length > 180 ? "This value is invalid." : issue.message;
}

export function chatgptImportIssues(error: unknown) {
  if (error instanceof Error && error.message === "Duplicate job URL in one report.") {
    return [{ message: error.message, path: "jobs" }];
  }
  if (!(error instanceof ZodError)) return [];
  return error.issues.map((issue) => ({
    message: publicImportMessage(issue),
    path: issue.path.join(".") || "report",
  }));
}

export function chatgptJobKey(url: string) {
  return createHash("sha256").update(normalizeChatgptJobUrl(url)).digest("hex");
}

export function parseChatgptJobImport(input: unknown) {
  const report = chatgptJobImportSchema.parse(input);
  const seen = new Set<string>();
  return {
    ...report,
    jobs: report.jobs.map((job) => {
      const originalUrl = normalizeChatgptJobUrl(job.originalUrl);
      const key = chatgptJobKey(originalUrl);
      if (seen.has(key)) throw new Error("Duplicate job URL in one report.");
      seen.add(key);
      return { ...job, key, originalUrl };
    }),
  };
}
