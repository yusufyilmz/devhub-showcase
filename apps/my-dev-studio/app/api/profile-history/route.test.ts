import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileAccessError } from "@shared/lib/profile";

const mocks = vi.hoisted(() => ({
  eq: vi.fn(),
  from: vi.fn(),
  result: vi.fn(),
  workspace: vi.fn(),
}));
vi.mock("@/features/admin/admin-auth", () => ({ requireWorkspace: mocks.workspace }));

import { GET } from "./route";

describe("owner revision history", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    const chain = {
      eq: mocks.eq,
      limit: mocks.result,
      maybeSingle: mocks.result,
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    };
    mocks.eq.mockReturnValue(chain);
    mocks.from.mockReturnValue(chain);
    mocks.workspace.mockResolvedValue({
      client: { from: mocks.from },
      repository: { read: async () => ({ id: "own", revision: 5 }) },
    });
    mocks.result.mockResolvedValue({ data: [], error: null });
  });
  it("ignores a forged profile parameter and lists metadata only for the workspace", async () => {
    const response = await GET(
      new Request("https://example.test/api/profile-history?profileId=other"),
    );
    expect(response.status).toBe(200);
    expect(mocks.eq).toHaveBeenCalledWith("profile_id", "own");
    expect(await response.json()).toEqual({
      currentRevision: 5,
      retention: { count: 20, days: 90 },
      revisions: [],
    });
  });
  it("rejects unauthenticated reads before storage access", async () => {
    mocks.workspace.mockRejectedValue(new ProfileAccessError());
    expect((await GET(new Request("https://example.test/api/profile-history"))).status).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("fails safely for invalid, expired and incompatible revisions", async () => {
    expect(
      (await GET(new Request("https://example.test/api/profile-history?revision=bad"))).status,
    ).toBe(400);
    mocks.result.mockResolvedValue({ data: null, error: null });
    expect(
      (await GET(new Request("https://example.test/api/profile-history?revision=1"))).status,
    ).toBe(404);
    mocks.result.mockResolvedValue({
      data: { created_at: "", document: { invalid: true }, revision: 1 },
      error: null,
    });
    expect(
      (await GET(new Request("https://example.test/api/profile-history?revision=1"))).status,
    ).toBe(409);
  });
});
