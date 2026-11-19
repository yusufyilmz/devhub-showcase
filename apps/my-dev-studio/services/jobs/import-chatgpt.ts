import { parseChatgptJobImport } from "@shared/lib/services/jobs";

import type { requireWorkspace } from "@/services/admin/get-auth";
import { jobsServiceClient } from "@/services/jobs/get-config";

type Workspace = Awaited<ReturnType<typeof requireWorkspace>>;
type ParsedJob = ReturnType<typeof parseChatgptJobImport>["jobs"][number];

function toListing(job: ParsedJob) {
  return {
    company: job.company,
    currency: job.salaryCurrency ?? "",
    date: job.postedAt ?? null,
    dateKind: "posted" as const,
    description: [
      "Unverified ChatGPT research; review the original job listing before applying.",
      job.matchReason ?? "",
      job.workModel ? `Work model (unverified): ${job.workModel}.` : "",
      job.spainEligible == null
        ? "Spain work eligibility: unverified."
        : `Spain work eligibility (unverified): ${job.spainEligible ? "reported yes" : "reported no"}.`,
      job.evidenceUrl ? `Additional evidence: ${job.evidenceUrl}` : "",
    ]
      .filter(Boolean)
      .join(" "),
    employment: "",
    location: job.location ?? "",
    maximum: job.salaryMax ?? null,
    minimum: job.salaryMin ?? null,
    source: "chatgpt_research" as const,
    sourceId: job.key,
    title: job.title,
    url: job.originalUrl,
  };
}

async function saveCandidate(userId: string, job: ParsedJob) {
  const database = jobsServiceClient();
  const inserted = await database.from("job_listings").upsert(
    { id: job.key, listing: toListing(job), user_id: userId },
    { ignoreDuplicates: true, onConflict: "user_id,id" },
  );
  if (inserted.error) throw new Error("Could not store the imported job.");

  const match = await database.from("job_matches").upsert(
    {
      cv_revision: 0,
      explanation: {
        matchedSkills: [],
        missingRequirements: [],
        reason: job.matchReason
          ? `ChatGPT research (unverified): ${job.matchReason}`
          : "Imported ChatGPT research (unverified).",
      },
      listing_id: job.key,
      score: null,
      state: "new",
      user_id: userId,
    },
    { ignoreDuplicates: true, onConflict: "user_id,listing_id" },
  );
  if (match.error) throw new Error("Could not create the imported match.");
}

export async function importChatgptResearch(
  workspace: Workspace,
  input: unknown,
  preview = false,
) {
  const { jobs, report } = parseChatgptJobImport(input);
  const userId = workspace.user.id;
  if (jobs.length === 0)
    return { duplicates: 0, imported: 0, jobs: [], summary: report.summary };

  const existing = await jobsServiceClient()
    .from("job_matches")
    .select("listing_id")
    .eq("user_id", userId)
    .in(
      "listing_id",
      jobs.map((job) => job.key),
    );
  if (existing.error) throw new Error("Could not check existing imports.");
  const existingIds = new Set(existing.data.map((row) => row.listing_id));
  if (!preview) {
    for (const job of jobs) await saveCandidate(userId, job);
  }
  return {
    duplicates: jobs.filter((job) => existingIds.has(job.key)).length,
    imported: preview ? 0 : jobs.filter((job) => !existingIds.has(job.key)).length,
    jobs: jobs.map((job) => ({
      company: job.company,
      duplicate: existingIds.has(job.key),
      title: job.title,
      url: job.originalUrl,
    })),
    summary: report.summary,
  };
}
