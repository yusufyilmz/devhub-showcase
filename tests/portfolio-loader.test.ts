import { afterEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  client: vi.fn(),
  projects: vi.fn(),
  referrals: vi.fn(),
  warn: vi.fn(),
}));
vi.mock("@shared/lib/services", () => ({
  ProjectService: class {
    getAll = mocks.projects;
  },
  ReferralService: class {
    getAll = mocks.referrals;
  },
}));
vi.mock("@shared/lib/supabase", () => ({ createServerClient: mocks.client }));
vi.mock("@shared/lib/logger", () => ({ logger: { warn: mocks.warn } }));

vi.mock("../apps/web/lib/published-profile", async () => {
  const { profile } = await import("../packages/content/src/profile");
  return {
    getPublishedProfile: async () => ({ profile, revision: 1, updatedAt: "" }),
  };
});

import { loadPageResources } from "../apps/web/lib/portfolio-resources";

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
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
  mocks.client.mockResolvedValue({});
  mocks.referrals.mockResolvedValue([]);
  const result = await loadPageResources();
  expect(result.projects.map((item) => item.id)).toEqual(["fitness-os", "devhub"]);
  expect(mocks.projects).not.toHaveBeenCalled();
});
it("keeps the portfolio usable when a configured backend fails", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
  mocks.client.mockResolvedValue({});
  mocks.referrals.mockRejectedValue(new Error("unavailable"));

  const result = await loadPageResources();
  expect(result.experiences[0]?.company.name).toBe("dLocal");
  expect(result.referrals).toEqual([]);
  expect(result.projects).toHaveLength(2);
});
