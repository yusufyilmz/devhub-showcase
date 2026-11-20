import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  snapshot: vi.fn(),
}));
vi.mock("@/services/admin/get-auth", () => ({
  readWorkspaceSnapshot: mocks.snapshot,
}));

import AdminPage from "./page";

describe("Admin", () => {
  beforeEach(() => vi.resetAllMocks());

  it("sends the studio entry to the owner's editor", async () => {
    mocks.snapshot.mockResolvedValue({ isPublic: false, revision: 1, username: "alice" });
    await expect(AdminPage()).rejects.toMatchObject({
      digest: expect.stringContaining(";/alice/edit;"),
    });
    expect(mocks.snapshot).toHaveBeenCalledOnce();
  });

  it("redirects unauthenticated visitors to login", async () => {
    mocks.snapshot.mockRejectedValue(new Error("signed out"));
    await expect(AdminPage()).rejects.toMatchObject({
      digest: expect.stringContaining(";/login;"),
    });
  });

  it("reports setup errors when the workspace has no profile", async () => {
    mocks.snapshot.mockResolvedValue(null);
    await expect(AdminPage()).rejects.toMatchObject({
      digest: expect.stringContaining(";/login?error=setup;"),
    });
  });
});
