import { beforeEach, describe, expect, it, vi } from "vitest";

const evalMock = vi.hoisted(() => vi.fn());

vi.mock("@upstash/redis", () => ({
  Redis: class {
    eval = evalMock;
  },
}));

import { allowJobResearchImport } from "./job-research-import-limit";

describe("ChatGPT research import attempts", () => {
  beforeEach(() => {
    evalMock.mockReset();
    vi.stubEnv("REDIS_URL", "");
    vi.stubEnv("REDIS_TOKEN", "");
    vi.stubEnv("VERCEL_ENV", "");
  });

  it("allows a local import when Redis is not configured", async () => {
    await expect(allowJobResearchImport("owner-a")).resolves.toBe(true);
    expect(evalMock).not.toHaveBeenCalled();
  });

  it("refuses a hosted import when Redis is not configured", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    await expect(allowJobResearchImport("owner-a")).resolves.toBe(false);
    expect(evalMock).not.toHaveBeenCalled();
  });

  it("counts attempts without storing the report", async () => {
    vi.stubEnv("REDIS_URL", "https://redis.example.test");
    vi.stubEnv("REDIS_TOKEN", "fictional-token");
    evalMock.mockResolvedValueOnce(1);
    await expect(allowJobResearchImport("owner-a")).resolves.toBe(true);
    expect(evalMock).toHaveBeenCalledWith(
      expect.stringContaining("INCR"),
      ["jobs-chatgpt-import:user:owner-a", "jobs-chatgpt-import:global"],
      [],
    );
    expect(JSON.stringify(evalMock.mock.calls)).not.toContain("schemaVersion");
  });

  it("rejects when the account or global cap is reached", async () => {
    vi.stubEnv("REDIS_URL", "https://redis.example.test");
    vi.stubEnv("REDIS_TOKEN", "fictional-token");
    evalMock.mockResolvedValueOnce(0);
    await expect(allowJobResearchImport("owner-a")).resolves.toBe(false);
  });

  it("does not allow the import when Redis fails", async () => {
    vi.stubEnv("REDIS_URL", "https://redis.example.test");
    vi.stubEnv("REDIS_TOKEN", "fictional-token");
    evalMock.mockRejectedValueOnce(new Error("unavailable"));
    await expect(allowJobResearchImport("owner-a")).rejects.toThrow("unavailable");
  });
});
