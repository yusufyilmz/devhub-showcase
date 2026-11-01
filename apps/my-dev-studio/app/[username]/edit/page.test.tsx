import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  workspace: vi.fn(),
}));
vi.mock("@/features/admin/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
}));

import EditPage from "./page";

describe("Edit", () => {
  beforeEach(() => vi.resetAllMocks());

  it("redirects signed out editors to login", async () => {
    mocks.workspace.mockRejectedValue(new Error("signed out"));
    await expect(
      EditPage({ params: Promise.resolve({ username: "alice" }) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining(";/login;"),
    });
  });

  it("denies another account even when its CV is public", async () => {
    mocks.workspace.mockResolvedValue({
      repository: { read: async () => ({ isPublic: true, username: "bob" }) },
    });
    await expect(EditPage({ params: Promise.resolve({ username: "alice" }) })).rejects.toThrow(
      "NEXT_HTTP_ERROR_FALLBACK;404",
    );
  });

  it("lets the owner edit a private CV", async () => {
    const snapshot = {
      isPublic: false,
      profile: { name: "Alice" },
      revision: 1,
      username: "alice",
    };
    mocks.workspace.mockResolvedValue({
      repository: { read: async () => snapshot },
      user: { app_metadata: { role: "owner" }, email: "alice@example.test", id: "owner-id" },
    });
    const result = await EditPage({
      params: Promise.resolve({ username: "alice" }),
    });
    expect(result.props.children[1].props.initial).toBe(snapshot);
    expect(result.props.children[0].props.user).toEqual({
      email: "alice@example.test",
      id: "owner-id",
      name: "Alice",
    });
  });
});
