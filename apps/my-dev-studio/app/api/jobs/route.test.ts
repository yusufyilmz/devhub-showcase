import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  change: vi.fn(async () => ({ ok: true })),
  workspace: vi.fn(async () => ({ user: { id: "confirmed-user" } })),
}));
vi.mock("@/features/admin/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://studio.test",
}));
vi.mock("./_workspace", () => ({
  changeJobs: mocks.change,
  JobsError: class extends Error {},
  loadJobs: vi.fn(),
}));

import { ProfileAccessError } from "@shared/lib/profile";

import { POST } from "./route";

function request(origin: string, body = '{"action":"delete","id":"example"}') {
  return new Request("https://studio.test/api/jobs", { body, headers: { origin }, method: "POST" });
}

describe("private job mutations", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects cross-origin mutations before loading the workspace", async () => {
    expect((await POST(request("https://different.test"))).status).toBe(403);
    expect(mocks.workspace).not.toHaveBeenCalled();
  });
  it("requires a confirmed user and leaves mutations untouched on denial", async () => {
    mocks.workspace.mockRejectedValueOnce(new ProfileAccessError());
    expect((await POST(request("https://studio.test"))).status).toBe(403);
    expect(mocks.change).not.toHaveBeenCalled();
  });
  it("passes the confirmed workspace and parsed command to the feature", async () => {
    const response = await POST(request("https://studio.test"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.change).toHaveBeenCalledWith(
      { user: { id: "confirmed-user" } },
      { action: "delete", id: "example" },
      expect.any(AbortSignal),
    );
  });
});
