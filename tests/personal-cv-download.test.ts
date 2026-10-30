import { beforeEach, expect, it, vi } from "vitest";

import { ProfileAccessError } from "../packages/lib/src/repositories/profile-repository";

const mocks = vi.hoisted(() => ({
  published: vi.fn(),
  render: vi.fn(),
  workspace: vi.fn(),
}));
vi.mock("../apps/web/lib/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
}));
vi.mock("@shared/lib/published-profile", () => ({
  readPublicProfile: mocks.published,
}));
vi.mock("../apps/web/lib/cv-response", () => ({ cvResponse: mocks.render }));

import { GET as ownPdf } from "../apps/web/app/api/admin/cv/route";
import { GET as publicPdf } from "../apps/web/app/p/[id]/cv.pdf/route";

beforeEach(() => vi.resetAllMocks());
it("downloads only the session workspace even if another ID is supplied", async () => {
  const own = { id: "alice", profile: { name: "Alice" }, revision: 3 };
  mocks.workspace.mockResolvedValue({ repository: { read: async () => own } });
  mocks.render.mockResolvedValue(new Response("pdf"));
  expect((await ownPdf(new Request("https://example.com/api/admin/cv?profileId=bob"))).status).toBe(
    200,
  );
  expect(mocks.render).toHaveBeenCalledWith(own);
});
it("rejects a signed out private download before reading or rendering", async () => {
  mocks.workspace.mockRejectedValue(new ProfileAccessError());
  expect((await ownPdf(new Request("https://example.com/api/admin/cv"))).status).toBe(403);
  expect(mocks.render).not.toHaveBeenCalled();
});
it("does not render a private or missing public CV and never uses the main profile as fallback", async () => {
  mocks.published.mockResolvedValue(null);
  expect(
    (
      await publicPdf(new Request("https://example.com/p/bob/cv.pdf"), {
        params: Promise.resolve({ id: "bob" }),
      })
    ).status,
  ).toBe(404);
  expect(mocks.published).toHaveBeenCalledWith("bob");
  expect(mocks.render).not.toHaveBeenCalled();
});
