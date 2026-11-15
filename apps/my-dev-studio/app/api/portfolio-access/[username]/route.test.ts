import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ gate: vi.fn(), origin: vi.fn(), rpc: vi.fn() }));
vi.mock("@shared/lib/published-profile", () => ({ readPortfolioAccessStatus: mocks.gate }));
vi.mock("@/features/admin/admin-auth", () => ({ sameOrigin: mocks.origin }));
vi.mock("../../../[username]/access/_session", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../[username]/access/_session")>()),
  portfolioAccessServer: () => ({ client: { rpc: mocks.rpc }, secret: "fictional-server-secret" }),
}));

import { hashPortfolioPassword, verifyPortfolioGrant } from "@shared/lib/portfolio-password";

import { POST } from "./route";

const unlockPortfolio = (request: Request, username: string) =>
  POST(request, { params: Promise.resolve({ username }) });

const id = "22222222-2222-4222-8222-222222222222";
const version = "33333333-3333-4333-8333-333333333333";
const password = "fictional-test-password";
const request = (value = password) =>
  new Request("https://example.test/api/portfolio-access/alice", {
    body: JSON.stringify({ password: value }),
    headers: { "x-forwarded-for": "192.0.2.5" },
    method: "POST",
  });
describe("visitor password verification", () => {
  let digest: string;
  beforeAll(async () => {
    digest = await hashPortfolioPassword(password);
  });
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.origin.mockReturnValue(true);
    mocks.gate.mockResolvedValue({ id, username: "alice" });
    mocks.rpc.mockImplementation(async (name) =>
      name === "reserve_portfolio_access_attempt"
        ? { data: true, error: null }
        : { data: { access_version: version, password_digest: digest }, error: null },
    );
  });
  it("issues only a portfolio-bound HttpOnly grant and never returns credentials", async () => {
    const response = await unlockPortfolio(request(), "alice");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ unlocked: true });
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=lax");
    expect(cookie).toContain("Max-Age=3600");
    expect(cookie).not.toContain(password);
    expect(cookie).not.toContain(digest);
    const grant = cookie.split(";")[0]?.split("=")[1] ?? "";
    expect(verifyPortfolioGrant(id, decodeURIComponent(grant), "fictional-server-secret")).toBe(
      version,
    );
    expect(response.headers.get("cache-control")).toContain("no-store");
    const bucket = mocks.rpc.mock.calls[0]?.[1].request_bucket;
    expect(bucket).toMatch(/^[a-f0-9]{64}$/);
    expect(bucket).not.toContain("192.0.2.5");
  });
  it("denies wrong passwords, missing/private names and foreign origins without issuing cookies", async () => {
    const wrong = await unlockPortfolio(request("incorrect"), "alice");
    expect(wrong.status).toBe(403);
    expect(wrong.headers.get("set-cookie")).toBeNull();
    mocks.gate.mockResolvedValue(null);
    const missing = await unlockPortfolio(request(), "missing");
    expect(await missing.json()).toEqual(await wrong.json());
    mocks.origin.mockReturnValue(false);
    mocks.gate.mockClear();
    expect((await unlockPortfolio(request(), "alice")).status).toBe(403);
    expect(mocks.gate).not.toHaveBeenCalled();
  });
  it("stops before reading a credential when throttled and fails closed on storage errors", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });
    const limited = await unlockPortfolio(request(), "alice");
    expect(limited.status).toBe(429);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(limited.headers.get("retry-after")).toBe("300");
    mocks.rpc.mockResolvedValue({ data: null, error: { code: "storage" } });
    expect((await unlockPortfolio(request(), "alice")).status).toBe(503);
    expect((await unlockPortfolio(request("x".repeat(1025)), "alice")).status).toBe(413);
  });
});
