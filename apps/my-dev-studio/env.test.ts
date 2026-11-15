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

  it("prevents browser access to server credentials", async () => {
    vi.stubGlobal("window", {});
    vi.stubEnv("OPENAI_API_KEY", "fictional-secret");
    const { env } = await import("./env");
    expect(() => env.OPENAI_API_KEY).toThrow();
  });
});
