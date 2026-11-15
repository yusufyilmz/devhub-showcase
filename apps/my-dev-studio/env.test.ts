// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

describe("application environment validation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("normalizes empty optional credentials without requiring integrations", async () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    vi.stubEnv("OPENAI_API_KEY", "");
    vi.stubEnv("REDIS_TOKEN", "");
    const { env } = await import("./env");
    expect(env.OPENAI_API_KEY).toBeUndefined();
    expect(env.REDIS_TOKEN).toBeUndefined();
  });

  it("rejects malformed configured integration URLs", async () => {
    vi.stubEnv("REDIS_URL", "invalid-url");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(import("./env")).rejects.toThrow("Invalid environment variables");
  });

  it.each([
    ["preview", "REDIS_URL"],
    ["production", "REDIS_TOKEN"],
  ] as const)("rejects a missing Redis setting on %s", async (deployment, missing) => {
    vi.stubEnv("VERCEL_ENV", deployment);
    vi.stubEnv("REDIS_URL", "https://redis.example.test");
    vi.stubEnv("REDIS_TOKEN", "fictional-token");
    vi.stubEnv(missing, "");
    const report = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(import("./env")).rejects.toThrow("Invalid environment variables");
    expect(JSON.stringify(report.mock.calls)).toContain(missing);
  });

  it("rejects a Redis TCP URL where an HTTPS REST URL is required", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("REDIS_URL", "rediss://redis.example.test:6379");
    vi.stubEnv("REDIS_TOKEN", "fictional-token");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(import("./env")).rejects.toThrow("Invalid environment variables");
  });

  it("loads valid Redis settings on a hosted deployment", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("REDIS_URL", "https://redis.example.test");
    vi.stubEnv("REDIS_TOKEN", "fictional-token");
    const { env } = await import("./env");
    expect(env.REDIS_URL).toBe("https://redis.example.test");
    expect(env.REDIS_TOKEN).toBe("fictional-token");
  });

  it("prevents browser access to server credentials", async () => {
    vi.stubGlobal("window", {});
    vi.stubEnv("OPENAI_API_KEY", "fictional-secret");
    const { env } = await import("./env");
    expect(() => env.OPENAI_API_KEY).toThrow();
  });
});
