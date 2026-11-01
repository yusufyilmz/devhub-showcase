import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { seedWorkspace } from "../lib/domain/seed";

const mocks = vi.hoisted(() => ({
  find: vi.fn(),
  load: vi.fn(),
  save: vi.fn(),
}));
const owner = "00000000-0000-4000-8000-000000000001";
vi.mock("../lib/auth", () => ({
  configured: () => true,
  requestIdentity: async (request: Request) => ({
    client: {},
    user:
      request.headers.get("authorization") === "Bearer owner-token"
        ? { id: "00000000-0000-4000-8000-000000000001" }
        : request.headers.get("authorization") === "Bearer other-token"
          ? { id: "00000000-0000-4000-8000-000000000002" }
          : null,
  }),
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://fitness.example",
  workspaceOwnerId: () => "00000000-0000-4000-8000-000000000001",
}));
vi.mock("../lib/db/client", () => ({ database: () => ({}) }));
vi.mock("../lib/repositories/drizzle-workspace-repository", () => ({
  DrizzleWorkspaceRepository: class {
    find = mocks.find;
    load = mocks.load;
    save = mocks.save;
  },
}));

import { GET, PUT } from "../app/api/state/route";

beforeEach(() => {
  vi.stubEnv("SUPABASE_DB_URL", "test");
  vi.stubEnv("WORKSPACE_OWNER_ID", owner);
  vi.resetAllMocks();
  mocks.find.mockResolvedValue({ revision: 7, state: seedWorkspace() });
  mocks.load.mockResolvedValue({ revision: 7, state: seedWorkspace() });
  mocks.save.mockResolvedValue(8);
});
afterEach(() => vi.unstubAllEnvs());
it("anonymous visitors read the current owner workspace without creating data", async () => {
  const response = await GET(new Request("https://fitness.example/api/state?userId=another-owner"));
  expect(response.status).toBe(200);
  expect((await response.json()).canEdit).toBe(false);
  expect(mocks.find).toHaveBeenCalledExactlyOnceWith(owner);
  expect(mocks.load).not.toHaveBeenCalled();
  expect(mocks.save).not.toHaveBeenCalled();
  expect(response.headers.get("cache-control")).toContain("no-store");
});
it("another authenticated account remains a reader of the configured owner's data", async () => {
  const response = await GET(
    new Request("https://fitness.example/api/state", {
      headers: { Authorization: "Bearer other-token" },
    }),
  );
  expect((await response.json()).canEdit).toBe(false);
  expect(mocks.find).toHaveBeenCalledExactlyOnceWith(owner);
});
it("visitors cannot initialize an unpublished workspace", async () => {
  mocks.find.mockResolvedValue(null);
  expect((await GET(new Request("https://fitness.example/api/state"))).status).toBe(404);
  expect(mocks.load).not.toHaveBeenCalled();
});
it.each([undefined, "Bearer forged-token", "Bearer other-token"])(
  "rejects writes from %s even with forged client edit flags",
  async (auth) => {
    const response = await PUT(
      new Request("https://fitness.example/api/state", {
        body: JSON.stringify({
          canEdit: true,
          revision: 7,
          state: seedWorkspace(),
          userId: owner,
        }),
        headers: {
          origin: "https://fitness.example",
          ...(auth ? { Authorization: auth } : {}),
        },
        method: "PUT",
      }),
    );
    expect(response.status).toBe(403);
    expect(mocks.save).not.toHaveBeenCalled();
  },
);
it("the verified owner can initialize and update the shared workspace", async () => {
  const headers = {
    Authorization: "Bearer owner-token",
    origin: "https://fitness.example",
  };
  const response = await GET(new Request("https://fitness.example/api/state", { headers }));
  expect((await response.json()).canEdit).toBe(true);
  expect(mocks.load).toHaveBeenCalledExactlyOnceWith(owner);
  const saved = await PUT(
    new Request("https://fitness.example/api/state", {
      body: JSON.stringify({ revision: 7, state: seedWorkspace() }),
      headers,
      method: "PUT",
    }),
  );
  expect(saved.status).toBe(200);
  expect(mocks.save).toHaveBeenCalledWith(owner, expect.anything(), 7);
});
it("rejects a cross-origin owner write", async () => {
  const response = await PUT(
    new Request("https://fitness.example/api/state", {
      headers: {
        Authorization: "Bearer owner-token",
        origin: "https://other.example",
      },
      method: "PUT",
    }),
  );
  expect(response.status).toBe(403);
  expect(mocks.save).not.toHaveBeenCalled();
});
