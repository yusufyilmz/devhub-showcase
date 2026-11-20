import { beforeEach, describe, expect, it, vi } from "vitest";

type StoredMatch = {
  explanation: { reason: string };
  notified_at: string | null;
  score: number | null;
  state: string;
};
type StoredRow = {
  explanation?: { reason: string };
  id?: string;
  listing?: { source: string; url: string };
  listing_id?: string;
  notified_at?: string | null;
  score?: number | null;
  state?: string;
  user_id: string;
};

const mocks = vi.hoisted(() => ({
  failMatchWrite: 0,
  listings: [] as { listing: { source: string; url: string }; user_id: string }[],
  matches: new Map<string, Map<string, StoredMatch>>(),
  matchWrites: 0,
  reports: [] as { job_count: number; new_count: number; user_id: string }[],
  tables: [] as string[],
}));

function rememberMatch(row: StoredRow) {
  mocks.matchWrites += 1;
  if (mocks.failMatchWrite === mocks.matchWrites) return { error: { message: "match failed" } };
  const current = mocks.matches.get(row.user_id) ?? new Map<string, StoredMatch>();
  const id = row.listing_id ?? "";
  if (!current.has(id)) {
    current.set(id, {
      explanation: row.explanation ?? { reason: "" },
      notified_at: row.notified_at ?? null,
      score: row.score ?? null,
      state: row.state ?? "new",
    });
  }
  mocks.matches.set(row.user_id, current);
  return { error: null };
}

vi.mock("@/services/jobs/get-config", () => ({
  jobsServiceClient: () => ({
    from: (table: string) => ({
      insert: async (row: { job_count: number; new_count: number; user_id: string }) => {
        mocks.tables.push(table);
        mocks.reports.push(row);
        return { error: null };
      },
      select: () => ({
        eq: (_column: string, userId: string) => ({
          in: (_field: string, keys: string[]) => ({
            data: keys
              .filter((key) => mocks.matches.get(userId)?.has(key))
              .map((listing_id) => ({ listing_id })),
            error: null,
          }),
        }),
      }),
      upsert: async (row: StoredRow) => {
        mocks.tables.push(table);
        if (table === "job_listings" && row.listing) {
          mocks.listings.push({ listing: row.listing, user_id: row.user_id });
        }
        if (table === "job_matches") return rememberMatch(row);
        return { error: null };
      },
    }),
  }),
}));

import { importChatgptResearch } from "./import-chatgpt";

const report = {
  jobs: [
    {
      company: "Example",
      originalUrl: "https://example.com/jobs/123?utm_source=chatgpt",
      title: "Senior Frontend Engineer",
    },
  ],
  report: {
    automationTitle: "Job research",
    generatedAt: "2026-11-19T19:00:00Z",
    source: "chatgpt_automation",
    summary: "One candidate.",
  },
  schemaVersion: 1,
};

function workspace(userId: string) {
  return { user: { id: userId } } as never;
}

describe("ChatGPT import persistence", () => {
  beforeEach(() => {
    mocks.failMatchWrite = 0;
    mocks.matchWrites = 0;
    mocks.listings.length = 0;
    mocks.matches.clear();
    mocks.reports.length = 0;
    mocks.tables.length = 0;
  });

  it("does not mutate storage for preview", async () => {
    const result = await importChatgptResearch(workspace("owner-a"), report, true);
    expect(result.jobs).toHaveLength(1);
    expect(result.imported).toBe(0);
    expect(result.jobs[0]?.salaryKnown).toBe(false);
    expect(mocks.tables).toHaveLength(0);
  });

  it("deduplicates retries without changing existing match state", async () => {
    expect((await importChatgptResearch(workspace("owner-a"), report)).imported).toBe(1);
    const next = await importChatgptResearch(workspace("owner-a"), report);
    expect(next.imported).toBe(0);
    expect(next.duplicates).toBe(1);
    expect(next.jobs[0]?.duplicate).toBe(true);
  });

  it("keeps imports isolated by authenticated account", async () => {
    await importChatgptResearch(workspace("owner-a"), report);
    const other = await importChatgptResearch(workspace("owner-b"), report, true);
    expect(other.jobs[0]?.duplicate).toBe(false);
    expect(mocks.listings.every((entry) => entry.user_id === "owner-a")).toBe(true);
    expect(mocks.reports.every((entry) => entry.user_id === "owner-a")).toBe(true);
  });

  it("stores unverified research without alerts or applications", async () => {
    await importChatgptResearch(workspace("owner-a"), report);
    expect(mocks.listings[0]?.listing.source).toBe("chatgpt_research");
    const stored = [...(mocks.matches.get("owner-a")?.values() ?? [])][0];
    expect(stored).toMatchObject({ notified_at: null, score: null, state: "new" });
    expect(stored?.explanation.reason).toContain("unverified");
    expect(mocks.tables).not.toContain("job_applications");
    expect(mocks.tables).not.toContain("job_push_deliveries");
  });

  it("keeps a report history row for empty and repeated imports", async () => {
    await importChatgptResearch(workspace("owner-a"), { ...report, jobs: [] });
    await importChatgptResearch(workspace("owner-a"), report);
    await importChatgptResearch(workspace("owner-a"), report);
    expect(mocks.reports.map((entry) => entry.new_count)).toEqual([0, 1, 0]);
    expect(mocks.reports[2]?.job_count).toBe(1);
  });

  it("retries a failed job without duplicating the one already stored", async () => {
    const second = {
      ...report,
      jobs: [
        report.jobs[0],
        {
          ...report.jobs[0],
          originalUrl: "https://example.com/jobs/456",
          title: "Staff Frontend Engineer",
        },
      ],
    };
    mocks.failMatchWrite = 2;
    await expect(importChatgptResearch(workspace("owner-a"), second)).rejects.toThrow(
      "Could not create the imported match.",
    );
    expect(mocks.matches.get("owner-a")?.size).toBe(1);
    const retried = await importChatgptResearch(workspace("owner-a"), second);
    expect(retried.imported).toBe(1);
    expect(retried.duplicates).toBe(1);
    expect(mocks.matches.get("owner-a")?.size).toBe(2);
  });

  it("accepts empty reports without job writes", async () => {
    const result = await importChatgptResearch(workspace("owner-a"), {
      ...report,
      jobs: [],
    });
    expect(result.imported).toBe(0);
    expect(mocks.listings).toHaveLength(0);
    expect(mocks.reports).toHaveLength(1);
  });
});
