import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { profile, projectPublicProfile } from "@shared/config";

const mocks = vi.hoisted(() => ({ cookie: vi.fn(), rpc: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: mocks.cookie }) }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ rpc: mocks.rpc }) }));

import { issuePortfolioGrant } from "./password";
import { readProtectedProfile } from "./server-access";

const id = "22222222-2222-4222-8222-222222222222";
const version = "33333333-3333-4333-8333-333333333333";
describe("protected snapshot reads", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.test");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "fictional-secret");
  });
  afterEach(() => vi.unstubAllEnvs());
  it("never uses privileged reads without a valid portfolio-bound unexpired cookie", async () => {
    expect(await readProtectedProfile(id)).toBeNull();
    mocks.cookie.mockReturnValue({
      value: issuePortfolioGrant("main", version, "fictional-secret"),
    });
    expect(await readProtectedProfile(id)).toBeNull();
    mocks.cookie.mockReturnValue({
      value: issuePortfolioGrant(id, version, "fictional-secret", Date.now() - 3601000),
    });
    expect(await readProtectedProfile(id)).toBeNull();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("rechecks the grant version atomically for each surface and denies revoked grants", async () => {
    mocks.cookie.mockReturnValue({ value: issuePortfolioGrant(id, version, "fictional-secret") });
    mocks.rpc.mockResolvedValue({ data: null, error: null });
    expect(await readProtectedProfile(id, "cv")).toBeNull();
    expect(mocks.rpc).toHaveBeenCalledWith("read_protected_publication", {
      access_version: version,
      profile_id: id,
      surface: "cv",
    });
    mocks.rpc.mockResolvedValue({
      data: {
        document: projectPublicProfile(profile, "website"),
        id,
        revision: 4,
        updated_at: "2026-11-04",
        username: "alice",
      },
      error: null,
    });
    expect((await readProtectedProfile(id))?.revision).toBe(4);
    mocks.rpc.mockResolvedValue({ data: null, error: { code: "storage" } });
    await expect(readProtectedProfile(id)).rejects.toThrow();
  });
});
