import { beforeEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";
import { ProfileAccessError } from "@shared/services/profile";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  guard: vi.fn(),
}));
vi.mock("@/features/management/managed-portfolios", () => ({
  createManaged: mocks.create,
  requirePortfolioAdmin: mocks.guard,
}));

import { POST } from "./route";

const id = "88888888-8888-4888-8888-888888888888";
const request = (body: unknown, origin = "https://example.com") =>
  new Request("https://example.com/api/admin/managed", {
    body: JSON.stringify(body),
    headers: { origin },
    method: "POST",
  });

describe("Managed", () => {
  beforeEach(() => vi.resetAllMocks());

  it("rejects cross origin mutations before checking storage", async () => {
    expect((await POST(request({}, "https://evil.test"))).status).toBe(403);
    expect(mocks.guard).not.toHaveBeenCalled();
  });

  it("blocks ordinary users and signed out users before creation", async () => {
    mocks.guard.mockRejectedValue(new ProfileAccessError());
    expect((await POST(request({ profile, username: "sample" }))).status).toBe(403);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("creates only a private managed profile with validated content and a server verified administrator", async () => {
    const admin = { user: { id: "verified-admin" } };
    mocks.guard.mockResolvedValue(admin);
    mocks.create.mockResolvedValue({ id });
    const response = await POST(
      request({
        isPublic: true,
        managed_by: "victim",
        owner_id: "victim",
        profile,
        username: "sample-import",
      }),
    );
    expect(response.status).toBe(201);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.create.mock.calls[0]?.slice(0, 2)).toEqual([admin, "sample-import"]);
    expect(mocks.create.mock.calls[0]).toHaveLength(3);
  });

  it("rejects invalid imports and oversized bodies without writing records", async () => {
    mocks.guard.mockResolvedValue({});
    expect((await POST(request({ profile, username: "admin" }))).status).toBe(400);
    expect((await POST(request({ profile: {}, username: "valid" }))).status).toBe(400);
    expect((await POST(request("x".repeat(250001)))).status).toBe(413);
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
