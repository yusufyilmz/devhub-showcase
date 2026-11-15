import { assessJobMatches } from "@shared/assistant";
import { validateProfile } from "@shared/lib/profiles";
import {
  adzunaSearchKey,
  discoverJobs,
  discoveryCandidates,
  isProviderConfigured,
  type JobFilters,
  type JobListing,
  jobFilters,
} from "@shared/lib/services/jobs";
import type { Database, Json, SupabaseDbClient } from "@shared/lib/types";
import {
  createPushSender,
  deliverQueuedNotifications,
  pushSubscriptionSchema,
} from "@shared/notifications/server";

import { withAdzunaCache } from "./_adzuna-cache";
import {
  adzunaCache,
  adzunaCacheTtl,
  jobProviders,
  jobsPushConfig,
  providerDailyLimit,
} from "./_config";
import { cvEvidence } from "./_cv-evidence";

type Search = Database["public"]["Tables"]["job_searches"]["Row"];
const sources = ["adzuna", "jooble"] as const;

const providerIssues = new Map([
  ["unconfigured", "not configured for this market"],
  ["daily limit reached", "daily request budget reached"],
  ["rate-limited", "provider rate limit reached"],
]);

async function readProvider(
  client: SupabaseDbClient,
  filters: JobFilters,
  providers: ReturnType<typeof jobProviders>,
  source: (typeof sources)[number],
) {
  if (!isProviderConfigured(source, filters.country, providers)) throw new Error("unconfigured");
  const fetchJobs = async () => {
    const budget = await client.rpc("reserve_job_provider_request", {
      country: source === "adzuna" ? "all" : filters.country,
      daily_limit: providerDailyLimit(source),
      source,
    });
    if (budget.error) throw new Error("unavailable");
    if (!budget.data) throw new Error("daily limit reached");
    return discoverJobs(source, filters, providers, AbortSignal.timeout(8000));
  };
  if (source !== "adzuna" || !providers.adzuna) return fetchJobs();
  return withAdzunaCache(
    adzunaCache(),
    adzunaSearchKey(filters, providers.adzuna.appId),
    adzunaCacheTtl(),
    fetchJobs,
  );
}

async function readProviders(client: SupabaseDbClient, filters: JobFilters) {
  const providers = jobProviders();
  const outcomes = await Promise.allSettled(
    sources.map((source) => readProvider(client, filters, providers, source)),
  );
  const issues: string[] = [];
  const jobs: JobListing[] = [];
  let examined = 0;
  let retry = false;
  for (const [index, outcome] of outcomes.entries()) {
    if (outcome.status === "fulfilled") {
      jobs.push(...outcome.value.jobs);
      examined += outcome.value.examined;
    } else {
      const reason = outcome.reason instanceof Error ? outcome.reason.message : "";
      const issue = providerIssues.get(reason) ?? "temporarily unavailable";
      issues.push(`${sources[index]}: ${issue}.`);
      retry ||= issue === "temporarily unavailable";
    }
  }
  return { examined, issues, jobs, retry };
}

async function scan(client: SupabaseDbClient, search: Search) {
  const filters = jobFilters.safeParse(search.filters);
  if (!filters.success)
    return { examined: 0, issues: ["Invalid search filters."], results: [], retry: false };
  const profile = await client
    .from("portfolio_profiles")
    .select("document,revision")
    .eq("owner_id", search.user_id)
    .maybeSingle();
  if (profile.error) throw new Error("CV storage unavailable");
  const cv = profile.data && cvEvidence(validateProfile(profile.data.document));
  if (!profile.data || !cv)
    return {
      examined: 0,
      issues: ["Add experience or skills to your CV to enable matching."],
      results: [],
      retry: false,
    };
  const {
    jobs,
    issues,
    examined,
    retry: providerRetry,
  } = await readProviders(client, filters.data);
  let retry = providerRetry;
  const cvRevision = profile.data.revision;
  const candidates = discoveryCandidates(jobs, filters.data);
  const existing = candidates.length
    ? await client
        .from("job_matches")
        .select("listing_id,score,explanation,cv_revision")
        .eq("user_id", search.user_id)
        .in(
          "listing_id",
          candidates.map(([id]) => id),
        )
    : { data: [], error: null };
  if (existing.error) throw new Error("Match storage unavailable");
  const previous = new Map(
    existing.data
      .filter((match) => match.cv_revision === cvRevision && match.score !== null)
      .map((match) => [match.listing_id, match]),
  );
  const results = candidates.flatMap(([id, listing]) => {
    const match = previous.get(id);
    return match
      ? [{ cvRevision, explanation: match.explanation, id, listing, score: match.score }]
      : [];
  });
  const pending = candidates.filter(([id]) => !previous.has(id)).slice(0, 5);
  if (!pending.length) return { examined, issues, results, retry };
  try {
    const response = await assessJobMatches(
      {
        cv,
        jobs: pending.map(([id, listing]) => ({
          id,
          listing: {
            company: listing.company,
            description: listing.description.slice(0, 1500),
            title: listing.title,
          },
        })),
      },
      AbortSignal.timeout(30_000),
    );
    const byId = new Map(response.matches.map(({ id, ...match }) => [id, match]));
    for (const [id, listing] of pending) {
      const match = byId.get(id);
      if (match) results.push({ cvRevision, explanation: match, id, listing, score: match.score });
      else retry = true;
    }
    if (pending.some(([id]) => !byId.has(id)))
      issues.push("AI returned an incomplete set of scores.");
  } catch {
    issues.push("AI matching is temporarily unavailable.");
    retry = true;
  }
  return { examined, issues, results, retry };
}

export async function runJobDiscovery(client: SupabaseDbClient) {
  const { data, error } = await client.rpc("claim_job_search");
  if (error) throw new Error("Search queue unavailable.");
  const search = data[0];
  if (!search?.lease) return false;
  const outcome = await scan(client, search).catch(() => ({
    examined: 0,
    issues: ["Discovery could not complete. It will retry."],
    results: [],
    retry: true,
  }));
  const result = await client.rpc("finish_job_search", {
    claim: search.lease,
    examined_count: outcome.examined,
    issues_found: outcome.issues,
    results: outcome.results as Json,
    search: search.id,
    should_retry: outcome.retry,
  });
  if (result.error) throw new Error("Could not record search.");
  return result.data;
}

export async function sendJobAlerts(client: SupabaseDbClient) {
  const config = jobsPushConfig();
  if (!config) return;
  return deliverQueuedNotifications(
    {
      async claim(limit) {
        const { data, error } = await client.rpc("claim_job_push", { batch_size: limit });
        if (error) throw new Error("Push queue unavailable.");
        return data.map(({ id, lease, attempt, subscription }) => ({
          attempt,
          id,
          lease,
          message: {
            body: "Open Job Hunter to review your matches.",
            id,
            title: "New Job Hunter matches",
            url: "/admin/jobs",
          },
          subscription: pushSubscriptionSchema.parse(subscription),
        }));
      },
      async finish({ id, lease }, outcome) {
        const { error } = await client.rpc("finish_job_push", {
          claim: lease,
          delivery_id: id,
          outcome,
        });
        if (error) throw new Error("Could not record push delivery.");
      },
    },
    createPushSender(config),
  );
}
