import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  loadPending: vi.fn(),
  snapshot: vi.fn(),
  workspace: vi.fn(),
}));
vi.mock("@/services/admin/get-auth", () => ({
  readWorkspaceSnapshot: mocks.snapshot,
  requireWorkspace: mocks.workspace,
}));

vi.mock("@/services/review/get-service", () => ({
  loadPendingPortfolioReviews: mocks.loadPending,
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
    mocks.workspace.mockResolvedValue({ user: { id: "owner-id" } });
    mocks.snapshot.mockResolvedValue({ isPublic: true, username: "bob" });
    await expect(EditPage({ params: Promise.resolve({ username: "alice" }) })).rejects.toThrow(
      "NEXT_HTTP_ERROR_FALLBACK;404",
    );
    expect(mocks.snapshot).toHaveBeenCalledOnce();
  });

  it("lets the owner edit a private CV", async () => {
    const snapshot = {
      isPublic: false,
      profile: { name: "Alice" },
      revision: 1,
      username: "alice",
    };
    mocks.workspace.mockResolvedValue({
      user: { app_metadata: { role: "owner" }, email: "alice@example.test", id: "owner-id" },
    });
    mocks.snapshot.mockResolvedValue(snapshot);
    const result = await EditPage({
      params: Promise.resolve({ username: "alice" }),
      searchParams: Promise.resolve({ tab: "sections" }),
    });
    expect(result.props.initial).toBe(snapshot);
    expect(mocks.snapshot).toHaveBeenCalledOnce();
    expect(result.props.initialTab).toBe("Sections");
    expect(result.props.reviews).toBeUndefined();
    expect(mocks.loadPending).not.toHaveBeenCalled();
    expect(result.props.user).toEqual({
      email: "alice@example.test",
      id: "owner-id",
      name: "Alice",
    });
  });

  it("opens the original portfolio's review queue for its owner", async () => {
    const snapshot = { id: "main", profile: { name: "Alice" }, username: "alice" };
    const client = {};
    mocks.workspace.mockResolvedValue({
      client,
      user: { id: "owner-id" },
    });
    mocks.snapshot.mockResolvedValue(snapshot);
    mocks.loadPending.mockResolvedValue([]);
    const result = await EditPage({
      params: Promise.resolve({ username: "alice" }),
      searchParams: Promise.resolve({ tab: "reviews" }),
    });
    expect(result.props.initialTab).toBe("Reviews");
    expect(result.props.reviews.props.reviews).toEqual([]);
    expect(mocks.loadPending).toHaveBeenCalledWith(client);
  });
});
