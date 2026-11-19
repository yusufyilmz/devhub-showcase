import { describe, expect, it } from "vitest";

import { chatgptJobKey, parseChatgptJobImport } from "./chatgpt-import";

const sample = {
  schemaVersion: 1,
  report: {
    generatedAt: "2026-11-19T19:00:00Z",
    source: "chatgpt_automation",
    automationTitle: "Birleşik Kariyer ve İş Fırsatları",
    summary: "Two opportunities.",
  },
  jobs: [
    {
      company: "Example",
      title: "Senior Frontend Engineer",
      originalUrl: "https://example.com/careers/123?utm_source=chatgpt",
    },
  ],
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
    ["excess results", { ...sample, jobs: Array.from({ length: 6 }, (_, index) => ({
      ...sample.jobs[0], originalUrl: `https://example.com/${index}`,
    })) }],
    ["unsupported protocol", { ...sample, jobs: [{ ...sample.jobs[0], originalUrl: "javascript:alert(1)" }] }],
    ["nonpublic URL", { ...sample, jobs: [{ ...sample.jobs[0], originalUrl: "https://localhost/jobs" }] }],
    ["embedded credentials", { ...sample, jobs: [{ ...sample.jobs[0], originalUrl: "https://user:pass@example.com/jobs" }] }],
    ["invalid time", { ...sample, report: { ...sample.report, generatedAt: "yesterday" } }],
    ["unexpected personal fields", { ...sample, jobs: [{ ...sample.jobs[0], recruiterEmail: "name@example.com" }] }],
    ["unsupported version", { ...sample, schemaVersion: 2 }],
  ])("rejects %s", (_name, value) => {
    expect(() => parseChatgptJobImport(value)).toThrow();
  });

  it("permits unknown salary and eligibility", () => {
    expect(parseChatgptJobImport({
      ...sample,
      jobs: [{ ...sample.jobs[0], salaryMin: null, salaryMax: null, spainEligible: null }],
    }).jobs).toHaveLength(1);
  });

  it("rejects contradictory salary bounds", () => {
    expect(() => parseChatgptJobImport({
      ...sample,
      jobs: [{ ...sample.jobs[0], salaryMin: 120000, salaryMax: 90000 }],
    })).toThrow();
  });
});
