import { describe, expect, it, vi } from "vitest";

import { discoverJobs, discoveryCandidates, passesJobFilters } from "./discovery";
import { type JobListing, jobFilters } from "./schema";

const filter = jobFilters.parse({ country: "gb", title: "Senior Engineer" });
const providers = { adzuna: { appId: "example", key: "example" }, joobleKeys: { gb: "test-key" } };
const signal = new AbortController().signal;
const base: JobListing = {
  company: "Example Ltd",
  currency: "GBP",
  date: "2026-11-11T00:00:00.000Z",
  dateKind: "posted",
  description: "Hybrid, TypeScript",
  employment: "full_time",
  location: "London",
  maximum: 90000,
  minimum: 70000,
  source: "adzuna",
  sourceId: "1",
  title: "Senior Engineer",
  url: "https://example.org/job",
};

describe("job discovery", () => {
  it("normalizes Adzuna and drops unsafe links", async () => {
    const listing = {
      company: { display_name: "Example Ltd" },
      created: base.date,
      description: "<b>Hybrid</b> TypeScript",
      id: "1",
      location: { display_name: "London" },
      redirect_url: "https://example.org/job",
      salary_min: 70000,
      title: "Senior Engineer",
    };
    const request = vi.fn(async () =>
      Response.json({ results: [listing, { ...listing, redirect_url: "javascript:alert(1)" }] }),
    );
    const result = await discoverJobs("adzuna", filter, providers, signal, request);
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/v1/api/jobs/gb/search/1" }),
      expect.objectContaining({ redirect: "error" }),
    );
    expect(result).toEqual({
      examined: 2,
      jobs: [
        expect.objectContaining({
          currency: "GBP",
          description: "Hybrid TypeScript",
          minimum: 70000,
          title: base.title,
        }),
      ],
    });
  });

  it("uses the configured Jooble market and keeps update dates distinct", async () => {
    const request = vi.fn(async () =>
      Response.json({
        jobs: [
          {
            company: "Example Ltd",
            id: 42,
            link: "https://uk.jooble.org/job",
            location: "London",
            salary: "70,000 - 90,000 GBP",
            snippet: "Hybrid",
            title: "Senior Engineer",
            type: "Full-time",
            updated: base.date,
          },
        ],
      }),
    );
    const result = await discoverJobs("jooble", filter, providers, signal, request);
    expect(request).toHaveBeenCalledWith(
      "https://uk.jooble.org/api/test-key",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result.jobs).toEqual([
      expect.objectContaining({
        dateKind: "updated",
        maximum: 90000,
        minimum: 70000,
        sourceId: "42",
      }),
    ]);
    await expect(
      discoverJobs("jooble", { ...filter, country: "de" }, providers, signal, request),
    ).rejects.toThrow("unconfigured");
  });

  it("deduplicates across providers after deterministic filtering", () => {
    const filters = {
      ...filter,
      currency: "GBP",
      employment: "full-time" as const,
      excludedKeywords: "PHP",
      minimum: 80000,
      workplace: "hybrid" as const,
    };
    const duplicate = {
      ...base,
      description: "Hybrid, TypeScript and React",
      source: "jooble" as const,
    };
    const candidates = discoveryCandidates(
      [base, duplicate, { ...base, description: "Hybrid PHP", title: "Different" }],
      filters,
    );
    expect(candidates.map(([, job]) => job)).toEqual([duplicate]);
    expect(passesJobFilters(base, { ...filters, minimum: 95000 })).toBe(false);
    expect(passesJobFilters({ ...base, dateKind: "updated" }, { ...filters, postedDays: 7 })).toBe(
      false,
    );
  });
});
