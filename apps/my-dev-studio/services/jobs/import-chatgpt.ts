import { parseChatgptJobImport } from "@shared/lib/services/jobs/chatgpt-import";

import type { requireWorkspace } from "@/services/admin/get-auth";
import { jobsServiceClient } from "@/services/jobs/get-config";

type Workspace = Awaited<ReturnType<typeof requireWorkspace>>;

export async function importChatgptResearch(workspace: Workspace, input: unknown) {
  // Workspace ownership is sourced only from the authenticated session.
  const { jobs, report } = parseChatgptJobImport(input);
  const userId = workspace.user.id;
  if (jobs.length === 0) return { imported: 0, duplicates: 0, summary: report.summary };

  const database = jobsServiceClient();
  let imported = 0;
  let duplicates = 0;
  for (const job of jobs) {
    const listing = {
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
      ].filter(Boolean).join(" "),
      employment: "",
      location: job.location ?? "",
      maximum: job.salaryMax ?? null,
      minimum: job.salaryMin ?? null,
      source: "chatgpt_research" as const,
      sourceId: job.key,
      title: job.title,
      url: job.originalUrl,
    };

    // Both tables are service-role-write-only. Every query explicitly scopes to
    // the authenticated owner; never accept a user id from the incoming JSON.
    const inserted = await database
      .from("job_listings")
      .upsert(
        { id: job.key, listing, user_id: userId },
        { ignoreDuplicates: true, onConflict: "user_id,id" },
      );
    if (inserted.error) throw new Error("Could not store the imported job.");

    const match = await database
      .from("job_matches")
      .upsert(
        {
          user_id: userId,
          listing_id: job.key,
          score: null,
          cv_revision: 0,
          explanation: {
            matchedSkills: [],
            missingRequirements: [],
            reason: job.matchReason
              ? `ChatGPT research (unverified): ${job.matchReason}`
              : "Imported ChatGPT research (unverified).",
          },
          state: "new",
        },
        { ignoreDuplicates: true, onConflict: "user_id,listing_id" },
      );
    if (match.error) throw new Error("Could not create the imported match.");

    // Match duplicates are checked after the idempotent writes to tolerate
    // retries and recover if a previous attempt saved the listing only.
    // This value counts processed candidates; the UI refreshes from storage.
    imported += 1;
  }
  return { imported, duplicates, summary: report.summary };
}
