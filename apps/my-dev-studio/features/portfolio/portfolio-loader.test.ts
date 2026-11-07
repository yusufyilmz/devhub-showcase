import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  client: vi.fn(),
  referrals: vi.fn(),
  warn: vi.fn(),
}));
vi.mock("@shared/services/studio", () => ({
  ReferralService: class {
    getAll = mocks.referrals;
  },
}));
vi.mock("./access/server-access", () => ({ portfolioAccessServer: mocks.client }));
vi.mock("@shared/utils/logger", () => ({ logger: { warn: mocks.warn } }));

vi.mock("@/features/portfolio/profiles/published-profile", async () => {
  const { profile } = await import("@shared/config");
  return {
    getPublishedProfile: async () => ({ profile, revision: 1, updatedAt: "" }),
  };
});

import { loadPageResources } from "@/features/portfolio/portfolio-resources";

describe("PortfolioLoader", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });
  it("serves current CV content without requiring external services", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect((await loadPageResources()).experiences[0]?.company.name).toBe("dLocal");
    expect(mocks.client).not.toHaveBeenCalled();
  });
  it("does not resurrect deleted projects from the older database tables", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-secret");
    mocks.client.mockReturnValue({ client: {} });
    mocks.referrals.mockResolvedValue([]);
    const result = await loadPageResources();
    expect(result.projects.map((item) => item.id)).toEqual(["fitness-os", "devhub"]);
    expect(mocks.referrals).toHaveBeenCalled();
  });
  it("keeps the portfolio usable when a configured backend fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-secret");
    mocks.client.mockReturnValue({ client: {} });
    mocks.referrals.mockRejectedValue(new Error("unavailable"));

    const result = await loadPageResources();
    expect(result.experiences[0]?.company.name).toBe("dLocal");
    expect(result.referrals).toEqual([]);
    expect(result.projects).toHaveLength(2);
  });
});

// Keep per-test configuration mutable; production schemas are validated separately.
vi.mock("../../env", () => ({ env: process.env }));
