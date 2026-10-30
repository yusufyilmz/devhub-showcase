import { beforeEach, expect, it, vi } from "vitest";
import { usernameSchema } from "../packages/lib/src/domain/username";

const mocks = vi.hoisted(() => ({
  workspace: vi.fn(),
  publicRead: vi.fn(),
  render: vi.fn(),
}));
vi.mock("../apps/web/lib/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
}));
vi.mock("@shared/lib/published-profile", () => ({
  readPublicProfileByUsername: mocks.publicRead,
}));
vi.mock("../apps/web/lib/cv-response", () => ({ cvResponse: mocks.render }));

import { GET } from "../apps/web/app/[username]/cv.pdf/route";
import EditPage from "../apps/web/app/[username]/edit/page";
import AdminPage from "../apps/web/app/admin/page";

beforeEach(() => vi.resetAllMocks());
it("rejects reserved, malformed, and path injection usernames and normalizes names", () => {
  for (const value of [
    "admin",
    "api",
    "reviews",
    "auth",
    "../alice",
    "alice/edit",
    "alice.pdf",
    "-alice",
    "alice--smith",
    "ab",
    "a".repeat(51),
  ])
    expect(usernameSchema.safeParse(value).success).toBe(false);
  expect(usernameSchema.parse(" Alice-Smith ")).toBe("alice-smith");
});
it("redirects signed out editors to login", async () => {
  mocks.workspace.mockRejectedValue(new Error("signed out"));
  await expect(
    EditPage({ params: Promise.resolve({ username: "alice" }) }),
  ).rejects.toMatchObject({
    digest: expect.stringContaining(";/admin/login;"),
  });
});
it("denies another account even when its CV is public", async () => {
  mocks.workspace.mockResolvedValue({
    repository: { read: async () => ({ username: "bob", isPublic: true }) },
  });
  await expect(
    EditPage({ params: Promise.resolve({ username: "alice" }) }),
  ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
});
it("lets the owner edit a private CV and sends the studio entry to their own editor", async () => {
  const snapshot = { username: "alice", isPublic: false, revision: 1 };
  mocks.workspace.mockResolvedValue({
    repository: { read: async () => snapshot },
  });
  const result = await EditPage({
    params: Promise.resolve({ username: "alice" }),
  });
  expect(result.props.initial).toBe(snapshot);
  await expect(AdminPage()).rejects.toMatchObject({
    digest: expect.stringContaining(";/alice/edit;"),
  });
});
it("does not render a private or nonexistent username PDF", async () => {
  mocks.publicRead.mockResolvedValue(null);
  const response = await GET(new Request("https://example.com/alice/cv.pdf"), {
    params: Promise.resolve({ username: "alice" }),
  });
  expect(response.status).toBe(404);
  expect(mocks.render).not.toHaveBeenCalled();
});
