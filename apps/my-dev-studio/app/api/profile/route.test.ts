import { beforeEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";
import { ProfileAccessError } from "@shared/lib/profile";

const mocks = vi.hoisted(() => ({ published: vi.fn(), workspace: vi.fn() }));
vi.mock("@/features/admin/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
  sameOrigin: () => true,
}));
vi.mock("@shared/lib/published-profile", () => ({ readPublicProfile: mocks.published }));

import { GET } from "./route";

describe("saved owner profile and published knowledge", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.workspace.mockResolvedValue({
      repository: {
        read: async () => ({
          id: "authorized-profile",
          isPublic: true,
          profile,
          revision: 3,
          updatedAt: "",
        }),
      },
    });
  });
  it("returns ordinary saved reads without looking up public data", async () => {
    const response = await GET(new Request("https://example.test/api/profile"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect((await response.json()).revision).toBe(3);
    expect(mocks.published).not.toHaveBeenCalled();
  });
  it("uses only the authorized profile for published knowledge and never substitutes its draft", async () => {
    mocks.published.mockResolvedValue(null);
    const response = await GET(
      new Request("https://example.test/api/profile?knowledge=1&profileId=victim"),
    );
    const result = await response.json();
    expect(mocks.published).toHaveBeenCalledWith("authorized-profile");
    expect(result.publishedSnapshot).toBeNull();
    expect(result.profile.name).toBe(profile.name);
  });
  it("denies signed-out knowledge inspection before looking up snapshots", async () => {
    mocks.workspace.mockRejectedValue(new ProfileAccessError());
    expect((await GET(new Request("https://example.test/api/profile?knowledge=1"))).status).toBe(
      403,
    );
    expect(mocks.published).not.toHaveBeenCalled();
  });
});
