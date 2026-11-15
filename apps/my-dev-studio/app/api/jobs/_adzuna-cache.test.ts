import { describe, expect, it, vi } from "vitest";

import { adzunaSearchKey, jobFilters } from "@shared/lib/services/jobs";

import { withAdzunaCache } from "./_adzuna-cache";

const empty = { examined: 0, jobs: [] };
const filters = jobFilters.parse({ country: "es", title: "Engineer" });

describe("Adzuna Redis cache", () => {
  it("reuses requests that differ only in local filters and separates provider queries", () => {
    const key = adzunaSearchKey(filters, "account");
    expect(adzunaSearchKey({ ...filters, excludedCompanies: "Example" }, "account")).toBe(key);
    expect(adzunaSearchKey({ ...filters, location: "Madrid" }, "account")).not.toBe(key);
    expect(adzunaSearchKey({ ...filters, country: "gb" }, "account")).not.toBe(key);
    expect(adzunaSearchKey(filters, "other-account")).not.toBe(key);
  });

  it("serves a valid hit without running the quota-and-fetch callback", async () => {
    const cache = { get: vi.fn(async () => JSON.stringify(empty)), set: vi.fn() };
    const fetchJobs = vi.fn(async () => empty);
    expect(await withAdzunaCache(cache, "key", 14_400, fetchJobs)).toEqual(empty);
    expect(fetchJobs).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it("recovers from Redis failure and gives empty results a short TTL", async () => {
    const cache = {
      get: vi.fn().mockRejectedValue(new Error("offline")),
      set: vi.fn(async () => {}),
    };
    const fetchJobs = vi.fn(async () => empty);
    expect(await withAdzunaCache(cache, "key", 14_400, fetchJobs)).toEqual(empty);
    expect(fetchJobs).toHaveBeenCalledOnce();
    expect(cache.set).toHaveBeenCalledWith("key", JSON.stringify(empty), 900);
  });

  it("does not cache provider failures", async () => {
    const cache = { get: vi.fn(async () => null), set: vi.fn() };
    const fetchJobs = vi.fn().mockRejectedValue(new Error("daily limit reached"));
    await expect(withAdzunaCache(cache, "key", 14_400, fetchJobs)).rejects.toThrow(
      "daily limit reached",
    );
    expect(cache.set).not.toHaveBeenCalled();
  });
});
