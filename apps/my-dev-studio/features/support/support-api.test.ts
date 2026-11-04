import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileAccessError } from "@shared/services/profile";

const mocks = vi.hoisted(() => ({ admin: vi.fn(), origin: vi.fn(), rpc: vi.fn() }));
vi.mock("@/features/management/managed-portfolios", () => ({ requirePortfolioAdmin: mocks.admin }));
vi.mock("@/features/admin/admin-auth", () => ({ sameOrigin: mocks.origin }));

import { supportRequest } from "./support-api";

const account = "22222222-2222-4222-8222-222222222222";
const requestId = "44444444-4444-4444-8444-444444444444";
const input = {
  account,
  action: "disable_visitor_chat",
  confirmed: true,
  reason: "customer_request",
  requestId,
};
function post(body: unknown = input) {
  return supportRequest(
    new Request("https://studio.test/api/support", { body: JSON.stringify(body), method: "POST" }),
  );
}

describe("support API permissions and input", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.origin.mockReturnValue(true);
    mocks.admin.mockResolvedValue({ client: { rpc: mocks.rpc } });
    mocks.rpc.mockResolvedValue({ data: [], error: null });
  });
  it("denies signed-out and non-members before metadata reads or mutations", async () => {
    mocks.admin.mockRejectedValue(new ProfileAccessError());
    expect((await supportRequest(new Request("https://studio.test/api/support"))).status).toBe(403);
    expect((await post()).status).toBe(403);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("rejects cross-origin mutations before authorization or RPC", async () => {
    mocks.origin.mockReturnValue(false);
    expect((await post()).status).toBe(403);
    expect(mocks.admin).not.toHaveBeenCalled();
  });
  it.each([
    { ...input, action: "grant_pro" },
    { ...input, actorId: account },
    { ...input, confirmed: false },
    { ...input, reason: "raw private CV" },
    { ...input, requestId: "invalid" },
  ])("rejects forged support action %#", async (body) => {
    expect((await post(body)).status).toBe(400);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("binds only the allowed action and preserves the logical request ID", async () => {
    mocks.rpc.mockResolvedValue({ data: { changed: true, requestId }, error: null });
    const response = await post();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(mocks.rpc).toHaveBeenCalledWith("support_disable_visitor_chat", {
      reason: "customer_request",
      request_id: requestId,
      target_account: account,
    });
  });
  it("validates cursors and bounds listing to 25 with a continuation", async () => {
    expect(
      (await supportRequest(new Request("https://studio.test/api/support?after=invalid"))).status,
    ).toBe(400);
    mocks.rpc.mockResolvedValue({
      data: Array.from({ length: 26 }, () => ({
        confirmed: true,
        created_at: "2026-11-04",
        id: account,
      })),
      error: null,
    });
    const response = await supportRequest(new Request("https://studio.test/api/support"));
    const data = await response.json();
    expect(data.accounts).toHaveLength(25);
    expect(data.next).toBe(account);
  });
  it("fails closed if storage unexpectedly includes private fields", async () => {
    mocks.rpc.mockResolvedValue({
      data: [{ confirmed: true, created_at: "2026-11-04", document: "private-CV", id: account }],
      error: null,
    });
    const response = await supportRequest(new Request("https://studio.test/api/support"));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private-CV");
  });
  it.each([
    ["42501", 403],
    ["P0002", 404],
    ["XX000", 503],
  ] as const)("maps %s without leaking raw storage errors", async (code, status) => {
    mocks.rpc.mockResolvedValue({ data: null, error: { code, message: "private SQL and token" } });
    const response = await post();
    expect(response.status).toBe(status);
    expect(await response.text()).not.toContain("private SQL");
  });
});
