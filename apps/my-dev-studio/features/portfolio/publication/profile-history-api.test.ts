import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileAccessError } from "@shared/services/profile";

const mocks = vi.hoisted(() => ({
  eq: vi.fn(),
  from: vi.fn(),
  managed: vi.fn(),
  workspace: vi.fn(),
}));
vi.mock("@/features/admin/admin-auth", () => ({ requireWorkspace: mocks.workspace }));
vi.mock("@/features/management/managed-portfolios", () => ({ managedRepository: mocks.managed }));

import { readProfileHistory } from "./profile-history-api";

describe("managed revision history authorization", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    const chain = {
      eq: mocks.eq,
      limit: async () => ({ data: [], error: null }),
      order: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    };
    mocks.eq.mockReturnValue(chain);
    mocks.from.mockReturnValue(chain);
    mocks.managed.mockResolvedValue({
      client: { from: mocks.from },
      repository: { read: async () => ({ id: "authorized-managed", revision: 4 }) },
    });
  });
  it("scopes history to the current authorized managed repository", async () => {
    expect(
      (
        await readProfileHistory(
          new Request("https://example.test/api/managed/record/history?profileId=victim"),
          "record",
        )
      ).status,
    ).toBe(200);
    expect(mocks.managed).toHaveBeenCalledWith("record");
    expect(mocks.eq).toHaveBeenCalledWith("profile_id", "authorized-managed");
    expect(mocks.workspace).not.toHaveBeenCalled();
  });
  it("denies a former manager before reading history", async () => {
    mocks.managed.mockRejectedValue(new ProfileAccessError());
    expect(
      (
        await readProfileHistory(
          new Request("https://example.test/api/managed/record/history"),
          "record",
        )
      ).status,
    ).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
