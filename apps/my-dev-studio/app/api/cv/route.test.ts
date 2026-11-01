import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileAccessError } from "@shared/services/profile";

const mocks = vi.hoisted(() => ({
  render: vi.fn(),
  workspace: vi.fn(),
}));
vi.mock("@/features/admin/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
}));
vi.mock("@/features/portfolio/cv/cv-response", () => ({ cvResponse: mocks.render }));

import { GET } from "./route";

describe("Cv", () => {
  beforeEach(() => vi.resetAllMocks());

  it("downloads only the session workspace even if another ID is supplied", async () => {
    const own = { id: "alice", profile: { name: "Alice" }, revision: 3 };
    mocks.workspace.mockResolvedValue({ repository: { read: async () => own } });
    mocks.render.mockResolvedValue(new Response("pdf"));
    expect((await GET(new Request("https://example.com/api/admin/cv?profileId=bob"))).status).toBe(
      200,
    );
    expect(mocks.render).toHaveBeenCalledWith(own);
  });

  it("rejects a signed out private download before reading or rendering", async () => {
    mocks.workspace.mockRejectedValue(new ProfileAccessError());
    expect((await GET(new Request("https://example.com/api/admin/cv"))).status).toBe(403);
    expect(mocks.render).not.toHaveBeenCalled();
  });
});
