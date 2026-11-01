import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  workspace: vi.fn(),
}));
vi.mock("@/features/admin/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
}));

import AdminPage from "./page";

describe("Admin", () => {
  beforeEach(() => vi.resetAllMocks());

  it("sends the studio entry to the owner's editor", async () => {
    mocks.workspace.mockResolvedValue({
      repository: {
        read: async () => ({ isPublic: false, revision: 1, username: "alice" }),
      },
    });
    await expect(AdminPage()).rejects.toMatchObject({
      digest: expect.stringContaining(";/alice/edit;"),
    });
  });
});
