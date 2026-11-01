import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  managed: vi.fn(),
}));
vi.mock("@/features/management/managed-portfolios", () => ({
  managedRepository: mocks.managed,
}));

import { POST } from "./route";

const id = "88888888-8888-4888-8888-888888888888";
const context = { params: Promise.resolve({ id }) };
const request = (body: unknown, origin = "https://example.com") =>
  new Request(`https://example.com/api/admin/managed/${id}/transfer`, {
    body: JSON.stringify(body),
    headers: { origin },
    method: "POST",
  });

describe("Transfer", () => {
  beforeEach(() => vi.resetAllMocks());

  it("rejects cross origin mutations before checking storage", async () => {
    expect((await POST(request({}, "https://evil.test"), context)).status).toBe(403);
    expect(mocks.managed).not.toHaveBeenCalled();
  });

  it("reports transfer failures without performing an alternate ownership write", async () => {
    const rpc = vi.fn().mockResolvedValue({
      error: { code: "23505", message: "This account already has edited work" },
    });
    mocks.managed.mockResolvedValue({ client: { rpc }, repository: { id } });
    const result = await POST(request({ email: "owner@example.com", revision: 2 }), context);
    expect(result.status).toBe(409);
    expect(rpc).toHaveBeenCalledWith("transfer_managed_portfolio", {
      expected_revision: 2,
      profile_id: id,
      target_email: "owner@example.com",
    });
  });
});
