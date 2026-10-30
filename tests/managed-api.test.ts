import { beforeEach, expect, it, vi } from "vitest";
import { profile } from "../packages/content/src/profile";
import {
  ProfileAccessError,
  ProfileConflictError,
} from "../packages/lib/src/repositories/profile-repository";

const mocks = vi.hoisted(() => ({
  guard: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  managed: vi.fn(),
  cv: vi.fn(),
}));
vi.mock("../apps/web/lib/managed-portfolios", () => ({
  requirePortfolioAdmin: mocks.guard,
  createManaged: mocks.create,
  saveManaged: mocks.save,
  managedRepository: mocks.managed,
}));
vi.mock("../apps/web/lib/cv-response", () => ({ cvResponse: mocks.cv }));

import { GET as pdf } from "../apps/web/app/admin/portfolios/[id]/cv.pdf/route";
import { PUT as save } from "../apps/web/app/api/admin/managed/[id]/route";
import { POST as transfer } from "../apps/web/app/api/admin/managed/[id]/transfer/route";
import { POST as create } from "../apps/web/app/api/admin/managed/route";

const id = "88888888-8888-4888-8888-888888888888";
const context = { params: Promise.resolve({ id }) };
const request = (path: string, body: unknown, origin = "https://example.com") =>
  new Request(`https://example.com${path}`, {
    method: "POST",
    headers: { origin },
    body: JSON.stringify(body),
  });
beforeEach(() => vi.resetAllMocks());
it("rejects cross origin mutations before checking storage", async () => {
  expect(
    (await create(request("/api/admin/managed", {}, "https://evil.test")))
      .status,
  ).toBe(403);
  expect(
    (
      await save(
        request(`/api/admin/managed/${id}`, {}, "https://evil.test"),
        context,
      )
    ).status,
  ).toBe(403);
  expect(
    (
      await transfer(
        request(`/api/admin/managed/${id}/transfer`, {}, "https://evil.test"),
        context,
      )
    ).status,
  ).toBe(403);
  expect(mocks.guard).not.toHaveBeenCalled();
  expect(mocks.managed).not.toHaveBeenCalled();
});
it("blocks ordinary users and signed out users before creation or private PDF reads", async () => {
  mocks.guard.mockRejectedValue(new ProfileAccessError());
  mocks.managed.mockRejectedValue(new ProfileAccessError());
  expect(
    (
      await create(
        request("/api/admin/managed", { username: "sample", profile }),
      )
    ).status,
  ).toBe(403);
  expect(
    (await pdf(new Request("https://example.com/cv"), context)).status,
  ).toBe(403);
  expect(mocks.create).not.toHaveBeenCalled();
  expect(mocks.cv).not.toHaveBeenCalled();
});
it("creates only a private managed profile with validated content and a server verified administrator", async () => {
  const admin = { user: { id: "verified-admin" } };
  mocks.guard.mockResolvedValue(admin);
  mocks.create.mockResolvedValue({ id });
  const response = await create(
    request("/api/admin/managed", {
      username: "sample-import",
      profile,
      owner_id: "victim",
      managed_by: "victim",
      isPublic: true,
    }),
  );
  expect(response.status).toBe(201);
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(mocks.create.mock.calls[0]?.slice(0, 2)).toEqual([
    admin,
    "sample-import",
  ]);
  expect(mocks.create.mock.calls[0]).toHaveLength(3);
});
it("rejects invalid imports and oversized bodies without writing records", async () => {
  mocks.guard.mockResolvedValue({});
  expect(
    (
      await create(
        request("/api/admin/managed", { username: "admin", profile }),
      )
    ).status,
  ).toBe(400);
  expect(
    (
      await create(
        request("/api/admin/managed", { username: "valid", profile: {} }),
      )
    ).status,
  ).toBe(400);
  expect(
    (await create(request("/api/admin/managed", "x".repeat(250001)))).status,
  ).toBe(413);
  expect(mocks.create).not.toHaveBeenCalled();
});
it("preserves revision conflicts rather than overwriting another editor save", async () => {
  mocks.guard.mockResolvedValue({});
  mocks.save.mockRejectedValue(new ProfileConflictError());
  expect(
    (
      await save(
        request("/api/admin/managed/id", { profile, revision: 1 }),
        context,
      )
    ).status,
  ).toBe(409);
});
it("reports transfer failures without performing an alternate ownership write", async () => {
  const rpc = vi.fn().mockResolvedValue({
    error: { code: "23505", message: "This account already has edited work" },
  });
  mocks.managed.mockResolvedValue({ client: { rpc }, repository: { id } });
  const result = await transfer(
    request("/transfer", { email: "owner@example.com", revision: 2 }),
    context,
  );
  expect(result.status).toBe(409);
  expect(rpc).toHaveBeenCalledWith("transfer_managed_portfolio", {
    profile_id: id,
    target_email: "owner@example.com",
    expected_revision: 2,
  });
});
