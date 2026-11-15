import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileAccessError } from "@shared/lib/profile";

const mocks = vi.hoisted(() => ({
  hash: vi.fn(),
  managed: vi.fn(),
  origin: vi.fn(),
  read: vi.fn(),
  reserve: vi.fn(),
  rpc: vi.fn(),
  workspace: vi.fn(),
}));
vi.mock("@/features/admin/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
  sameOrigin: mocks.origin,
}));
vi.mock("@/features/management/managed-portfolios", () => ({ managedRepository: mocks.managed }));

vi.mock("@shared/lib/portfolio-password", () => ({
  accessAttemptBucket: () => "bucket",
  hashPortfolioPassword: mocks.hash,
}));
vi.mock("../../[username]/access/_session", () => ({
  portfolioAccessServer: () => ({ client: { rpc: mocks.reserve }, secret: "test" }),
}));

import { changePublication } from "./_handlers";

const request = (body: unknown) =>
  new Request("https://example.test/api/publication", {
    body: JSON.stringify(body),
    method: "POST",
  });
describe("explicit publication authorization", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.origin.mockReturnValue(true);
    mocks.rpc.mockResolvedValue({ data: 5, error: null });
    mocks.reserve.mockResolvedValue({ data: true, error: null });
    mocks.hash.mockResolvedValue("salted-digest");
    mocks.read.mockResolvedValue({
      id: "authorized-id",
      profile: { publicationVisibility: "password" },
      revision: 5,
    });
    const context = {
      client: { rpc: mocks.rpc },
      repository: { read: mocks.read },
    };
    mocks.workspace.mockResolvedValue(context);
    mocks.managed.mockResolvedValue(context);
  });
  it("uses the authorized workspace and rejects client identity or source documents", async () => {
    expect(
      (await changePublication(request({ profile_id: "victim", publish: true, revision: 5 })))
        .status,
    ).toBe(400);
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect((await changePublication(request({ publish: true, revision: 5 }))).status).toBe(200);
    expect(mocks.rpc).toHaveBeenCalledWith("set_portfolio_publication", {
      expected_revision: 5,
      profile_id: "authorized-id",
      publish: true,
    });
    expect((await changePublication(request({ publish: true, revision: null }))).status).toBe(400);
  });
  it("requires the current manager check and preserves revision conflict errors", async () => {
    mocks.rpc.mockResolvedValue({ error: { code: "40001" } });
    expect(
      (await changePublication(request({ publish: false, revision: 4 }), "managed-id")).status,
    ).toBe(409);
    expect(mocks.managed).toHaveBeenCalledWith("managed-id");
    mocks.managed.mockRejectedValue(new ProfileAccessError());
    expect(
      (await changePublication(request({ publish: true, revision: 5 }), "managed-id")).status,
    ).toBe(403);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
  });
  it("rejects other origins and signed-out callers before publishing", async () => {
    mocks.origin.mockReturnValue(false);
    expect((await changePublication(request({ publish: true, revision: 5 }))).status).toBe(403);
    expect(mocks.workspace).not.toHaveBeenCalled();
    mocks.origin.mockReturnValue(true);
    mocks.workspace.mockRejectedValue(new ProfileAccessError());
    expect((await changePublication(request({ publish: true, revision: 5 }))).status).toBe(403);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("hashes only after permission, mode, revision and attempt checks", async () => {
    const input = { password: "fictional-password", publish: true, revision: 5 };
    expect((await changePublication(request({ ...input, revision: 4 }))).status).toBe(409);
    expect(mocks.hash).not.toHaveBeenCalled();
    expect((await changePublication(request(input))).status).toBe(200);
    expect(mocks.rpc).toHaveBeenCalledWith("publish_portfolio_with_password", {
      expected_revision: 5,
      password_digest: "salted-digest",
      profile_id: "authorized-id",
    });
    mocks.hash.mockClear();
    mocks.reserve.mockResolvedValue({ data: false, error: null });
    expect((await changePublication(request(input))).status).toBe(429);
    expect(mocks.hash).not.toHaveBeenCalled();
    mocks.read.mockResolvedValue({ id: "authorized-id", profile: {}, revision: 5 });
    expect((await changePublication(request(input))).status).toBe(400);
    expect(mocks.hash).not.toHaveBeenCalled();
  });
});
