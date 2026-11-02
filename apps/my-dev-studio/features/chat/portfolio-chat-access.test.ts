import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

const mocks = vi.hoisted(() => ({ limit: vi.fn(), read: vi.fn() }));
vi.mock("@shared/services/published-profile", () => ({ readPublicProfileByUsername: mocks.read }));
vi.mock("@shared/cache", () => ({ allowPortfolioChat: mocks.limit }));

import { assertCurrentPublication, requireLegacyChat } from "@/features/chat/portfolio-chat";

const session = "11111111-1111-4111-8111-111111111111";

describe("PortfolioChatAccess", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("OPENAI_API_KEY", "test");
    vi.stubEnv("REDIS_URL", "https://redis.example");
    vi.stubEnv("REDIS_TOKEN", "test");
    mocks.limit.mockResolvedValue(true);
    mocks.read.mockResolvedValue({
      id: "main",
      isPublic: true,
      profile,
      revision: 1,
      updatedAt: "today",
      username: "alex",
    });
  });
  afterEach(() => vi.unstubAllEnvs());
  describe("published chat request boundary", () => {
    it("reads the requested username anew and applies the portfolio aggregate limiter", async () => {
      const result = await requireLegacyChat("alex", session);
      expect(mocks.read).toHaveBeenCalledWith("alex");
      expect(result.knowledge.source.profileId).toBe("main");
      expect(mocks.limit).toHaveBeenCalledWith("main", session);
      mocks.read.mockResolvedValue(null);
      await expect(requireLegacyChat("alex", session)).rejects.toThrow("not available");
      expect(mocks.read).toHaveBeenCalledTimes(2);
    });
    it("does not fall back to the main portfolio or enable paid chat for other accounts", async () => {
      mocks.read.mockResolvedValue({
        id: "someone-else",
        isPublic: true,
        profile,
        revision: 1,
        updatedAt: "today",
        username: "alex",
      });
      await expect(requireLegacyChat("alex", session)).rejects.toThrow("not available");
      expect(mocks.limit).not.toHaveBeenCalled();
      mocks.read.mockResolvedValue({
        id: "main",
        isPublic: false,
        profile,
        revision: 1,
        updatedAt: "today",
        username: "alex",
      });
      await expect(requireLegacyChat("alex", session)).rejects.toThrow("not available");
    });
    it("rechecks publication after generation without consuming another allowance", async () => {
      await assertCurrentPublication("alex", "main", 1);
      expect(mocks.limit).not.toHaveBeenCalled();
      mocks.read.mockResolvedValue(null);
      await expect(assertCurrentPublication("alex", "main", 1)).rejects.toThrow(
        "published portfolio changed",
      );
    });
    it("rejects invalid identities and fails closed on quota/configuration errors", async () => {
      await expect(requireLegacyChat("admin", session)).rejects.toThrow();
      await expect(requireLegacyChat("alex", "forged")).rejects.toThrow();
      expect(mocks.read).not.toHaveBeenCalled();
      mocks.limit.mockResolvedValue(false);
      await expect(requireLegacyChat("alex", session)).rejects.toThrow("limit reached");
      vi.stubEnv("OPENAI_API_KEY", "");
      await expect(requireLegacyChat("alex", session)).rejects.toThrow("not configured");
    });
  });
});
