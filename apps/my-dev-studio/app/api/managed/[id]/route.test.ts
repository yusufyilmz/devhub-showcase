import { beforeEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";
import { ProfileAccessError, ProfileConflictError } from "@shared/lib/profile";

const mocks = vi.hoisted(() => ({
  guard: vi.fn(),
  managed: vi.fn(),
  save: vi.fn(),
}));
vi.mock("@/features/management/managed-portfolios", () => ({
  managedRepository: mocks.managed,
  requirePortfolioAdmin: mocks.guard,
  saveManaged: mocks.save,
}));

import { GET, PUT } from "./route";

const id = "88888888-8888-4888-8888-888888888888";
const context = { params: Promise.resolve({ id }) };
const request = (body: unknown, origin = "https://example.com") =>
  new Request(`https://example.com/api/admin/managed/${id}`, {
    body: JSON.stringify(body),
    headers: { origin },
    method: "PUT",
  });

describe("ManagedId", () => {
  beforeEach(() => vi.resetAllMocks());

  it("rejects cross origin mutations before checking storage", async () => {
    expect((await PUT(request({}, "https://evil.test"), context)).status).toBe(403);
    expect(mocks.guard).not.toHaveBeenCalled();
  });

  it("preserves revision conflicts rather than overwriting another editor save", async () => {
    mocks.guard.mockResolvedValue({});
    mocks.save.mockRejectedValue(new ProfileConflictError());
    expect((await PUT(request({ profile, revision: 1 }), context)).status).toBe(409);
  });

  it("reads only the requested authorized managed record without caching private content", async () => {
    const snapshot = {
      id,
      isPublic: false,
      profile,
      revision: 1,
      updatedAt: "today",
      username: "managed-example",
    };
    const read = vi.fn().mockResolvedValue(snapshot);
    mocks.managed.mockResolvedValue({ repository: { read } });
    const result = await GET(new Request(`https://example.com/api/admin/managed/${id}`), context);
    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toContain("no-store");
    expect(await result.json()).toEqual(snapshot);
    expect(mocks.managed).toHaveBeenCalledWith(id);
    mocks.managed.mockRejectedValue(new ProfileAccessError());
    expect((await GET(new Request("https://example.com"), context)).status).toBe(403);
  });
});
