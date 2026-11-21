import { describe, expect, it } from "vitest";

import { chatgptImportIssues, chatgptJobKey, parseChatgptJobImport } from "./chatgpt-import";

const sample = {
  jobs: [
    {
      company: "Example",
      originalUrl: "https://example.com/careers/123?utm_source=chatgpt",
      title: "Senior Frontend Engineer",
    },
  ],
  report: {
    automationTitle: "Birleşik Kariyer ve İş Fırsatları",
    generatedAt: "2026-11-19T19:00:00Z",
    source: "chatgpt_automation",
    summary: "Two opportunities.",
  },
  schemaVersion: 1,
};

describe("ChatGPT job report imports", () => {
  it("accepts a zero-match report", () => {
    expect(parseChatgptJobImport({ ...sample, jobs: [] }).jobs).toEqual([]);
  });

  it("normalizes tracking URLs for deterministic identity", () => {
    const parsed = parseChatgptJobImport(sample);
    expect(parsed.jobs[0]?.originalUrl).toBe("https://example.com/careers/123");
    expect(chatgptJobKey("https://example.com/careers/123")).toBe(parsed.jobs[0]?.key);
  });

  it("rejects duplicate links", () => {
    expect(() =>
      parseChatgptJobImport({
        ...sample,
        jobs: [
          ...sample.jobs,
          { ...sample.jobs[0], originalUrl: "https://example.com/careers/123" },
        ],
      }),
    ).toThrow("Duplicate");
  });

  it.each([
    [
      "excess results",
      {
        ...sample,
        jobs: Array.from({ length: 6 }, (_, index) => ({
          ...sample.jobs[0],
          originalUrl: `https://example.com/${index}`,
        })),
      },
    ],
    [
      "unsupported protocol",
      { ...sample, jobs: [{ ...sample.jobs[0], originalUrl: "javascript:alert(1)" }] },
    ],
    [
      "nonpublic URL",
      { ...sample, jobs: [{ ...sample.jobs[0], originalUrl: "https://localhost/jobs" }] },
    ],
    [
      "embedded credentials",
      {
        ...sample,
        jobs: [{ ...sample.jobs[0], originalUrl: "https://user:pass@example.com/jobs" }],
      },
    ],
    ["invalid time", { ...sample, report: { ...sample.report, generatedAt: "yesterday" } }],
    [
      "unexpected personal fields",
      { ...sample, jobs: [{ ...sample.jobs[0], recruiterEmail: "name@example.com" }] },
    ],
    ["unsupported version", { ...sample, schemaVersion: 2 }],
  ])("rejects %s", (_name, value) => {
    expect(() => parseChatgptJobImport(value)).toThrow();
  });

  it("keeps distinct roles at one company and stable identity parameters", () => {
    const parsed = parseChatgptJobImport({
      ...sample,
      jobs: [
        {
          ...sample.jobs[0],
          originalUrl: "https://EXAMPLE.com/jobs/a?utm_source=chatgpt&jobId=alpha",
        },
        {
          ...sample.jobs[0],
          originalUrl: "https://example.com/jobs/b?jobId=beta&utm_medium=email",
        },
      ],
    });
    expect(parsed.jobs.map((job) => job.originalUrl)).toEqual([
      "https://example.com/jobs/a?jobId=alpha",
      "https://example.com/jobs/b?jobId=beta",
    ]);
    expect(new Set(parsed.jobs.map((job) => job.key)).size).toBe(2);
    expect(chatgptJobKey("https://example.com/jobs/a?jobId=alpha")).toBe(
      chatgptJobKey("https://example.com/jobs/a?utm_campaign=1&jobId=alpha"),
    );
    expect(chatgptJobKey("https://example.com/jobs/a?jobId=alpha&ref=board")).toBe(
      chatgptJobKey("https://example.com/jobs/a?ref=board&jobId=alpha"),
    );
  });

  it("names the field that failed without repeating the supplied value", () => {
    const secret = "recruiter@private.example";
    let caught: unknown;
    try {
      parseChatgptJobImport({
        ...sample,
        jobs: [{ ...sample.jobs[0], originalUrl: `file:///tmp/${secret}`, title: "x".repeat(181) }],
        report: { ...sample.report, generatedAt: "yesterday" },
      });
    } catch (error) {
      caught = error;
    }
    const issues = chatgptImportIssues(caught);
    expect(issues.map((issue) => issue.path)).toEqual(
      expect.arrayContaining(["report.generatedAt", "jobs.0.title", "jobs.0.originalUrl"]),
    );
    expect(JSON.stringify(issues)).not.toContain(secret);
  });

  it("permits unknown salary and eligibility", () => {
    expect(
      parseChatgptJobImport({
        ...sample,
        jobs: [{ ...sample.jobs[0], salaryMax: null, salaryMin: null, spainEligible: null }],
      }).jobs,
    ).toHaveLength(1);
  });

  it("rejects contradictory salary bounds", () => {
    expect(() =>
      parseChatgptJobImport({
        ...sample,
        jobs: [{ ...sample.jobs[0], salaryMax: 90000, salaryMin: 120000 }],
      }),
    ).toThrow();
  });
});
