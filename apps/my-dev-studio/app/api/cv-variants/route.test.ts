import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthAccessError } from "@shared/auth";
import { profile } from "@shared/config";
import { createCvVariant } from "@shared/lib/profiles";

const mocks = vi.hoisted(() => ({
  client: vi.fn(),
  eq: vi.fn(),
  from: vi.fn(),
  insert: vi.fn(),
  read: vi.fn(),
  update: vi.fn(),
  user: vi.fn(),
}));
vi.mock("@shared/auth", async (original) => ({
  ...(await original<typeof import("@shared/auth")>()),
  requireConfirmedUser: mocks.user,
}));
vi.mock("@shared/lib/supabase", () => ({ createServerClient: mocks.client }));
vi.mock("@/features/admin/admin-auth", () => ({
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://example.test",
}));

import { GET, PUT } from "./route";

describe("private CV library route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.user.mockResolvedValue({ id: "alice" });
    const chain = {
      eq: mocks.eq,
      insert: mocks.insert,
      maybeSingle: mocks.read,
      select: vi.fn().mockReturnThis(),
      single: mocks.read,
      update: mocks.update,
    };
    mocks.eq.mockReturnValue(chain);
    mocks.insert.mockReturnValue(chain);
    mocks.update.mockReturnValue(chain);
    mocks.from.mockReturnValue(chain);
    mocks.client.mockResolvedValue({ from: mocks.from });
    mocks.read.mockResolvedValue({ data: null, error: null });
  });
  it("reads only the authenticated account and never a supplied owner ID", async () => {
    expect((await GET()).status).toBe(200);
    expect(mocks.eq).toHaveBeenCalledWith("owner_id", "alice");
  });
  it("rejects anonymous reads and cross-origin writes", async () => {
    mocks.user.mockRejectedValue(new AuthAccessError());
    expect((await GET()).status).toBe(403);
    expect(
      (
        await PUT(
          new Request("https://example.test/api/cv-variants", { body: "{}", method: "PUT" }),
        )
      ).status,
    ).toBe(403);
  });
  it("reports a stale revision without silently replacing the library", async () => {
    const version = createCvVariant(profile, 1, "Default");
    const response = await PUT(
      new Request("https://example.test/api/cv-variants", {
        body: JSON.stringify({ revision: 4, variants: [version] }),
        headers: { origin: "https://example.test" },
        method: "PUT",
      }),
    );
    expect(response.status).toBe(409);
    expect(mocks.eq).toHaveBeenCalledWith("revision", 4);
    expect(mocks.eq).toHaveBeenCalledWith("owner_id", "alice");
  });
});
