import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  matches: new Map<string, Set<string>>(),
  writes: [] as { table: string; userId: string }[],
}));

vi.mock("@/services/jobs/get-config", () => ({
  jobsServiceClient: () => ({
    from: (table: string) => ({
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
      upsert: async (row: { id?: string; listing_id?: string; user_id: string }) => {
        mocks.writes.push({ table, userId: row.user_id });
        if (table === "job_matches") {
          const current = mocks.matches.get(row.user_id) ?? new Set<string>();
          current.add(row.listing_id ?? "");
          mocks.matches.set(row.user_id, current);
        }
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
    mocks.matches.clear();
    mocks.writes.length = 0;
  });

  it("does not mutate storage for preview", async () => {
    const result = await importChatgptResearch(workspace("owner-a"), report, true);
    expect(result.jobs).toHaveLength(1);
    expect(result.imported).toBe(0);
    expect(mocks.writes).toHaveLength(0);
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
    expect(mocks.writes.every((entry) => entry.userId === "owner-a")).toBe(true);
  });

  it("accepts empty reports without any writes", async () => {
    const result = await importChatgptResearch(workspace("owner-a"), {
      ...report,
      jobs: [],
    });
    expect(result.imported).toBe(0);
    expect(mocks.writes).toHaveLength(0);
  });
});
