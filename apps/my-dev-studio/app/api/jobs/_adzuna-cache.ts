import { setTimeout } from "node:timers/promises";

import { z } from "zod";

import type { RedisCacheClient } from "@shared/lib/cache";
import { type JobListing, listingSchema } from "@shared/lib/services/jobs";

type SearchResult = { examined: number; jobs: JobListing[] };
type Cache = Pick<RedisCacheClient, "get" | "set">;
const storedResult = z.object({
  examined: z.number().int().min(0).max(20),
  jobs: z.array(listingSchema.extend({ source: z.literal("adzuna") })).max(20),
});

async function bestEffort<T>(operation: Promise<T>) {
  return Promise.race([operation, setTimeout(1000, null, { ref: false })]).catch(() => null);
}

function decode(value: unknown): SearchResult | undefined {
  try {
    return storedResult.safeParse(typeof value === "string" ? JSON.parse(value) : value).data;
  } catch {
    return undefined;
  }
}

export async function withAdzunaCache(
  cache: Cache | null,
  key: string,
  ttl: number,
  fetchJobs: () => Promise<SearchResult>,
): Promise<SearchResult> {
  if (!cache || ttl <= 0) return fetchJobs();
  const hit = decode(await bestEffort(cache.get(key)));
  if (hit) return hit;
  const result = await fetchJobs();
  await bestEffort(
    cache.set(key, JSON.stringify(result), result.jobs.length ? ttl : Math.min(ttl, 900)),
  );
  return result;
}
