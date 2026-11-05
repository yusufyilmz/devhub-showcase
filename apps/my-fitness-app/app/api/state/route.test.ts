import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { starterWorkspace } from "@/features/task-workspace/starter";

const mocks = vi.hoisted(() => ({
  identity: vi.fn(),
  load: vi.fn(),
  save: vi.fn(),
}));

const first = "00000000-0000-4000-8000-000000000001";
const second = "00000000-0000-4000-8000-000000000002";
const origin = "https://fitness.example";
const endpoint = `${origin}/api/state`;

vi.mock("@shared/auth/config", () => ({ supabaseConfigured: () => true }));
vi.mock("@shared/auth/server", () => ({
  createClient: async () => ({ auth: { getUser: mocks.identity } }),
  createRequestClient: () => ({ auth: { getUser: mocks.identity } }),
}));
vi.mock("@shared/services/db/client", () => ({ database: () => ({}) }));
vi.mock("@shared/services/workspace", async (importOriginal) => ({
  ...(await importOriginal()),
  WorkspaceRepository: class {
    load = mocks.load;
    save = mocks.save;
  },
}));

import { GET, PUT } from "./route";

function signIn(user: { id: string; email_confirmed_at?: string; is_anonymous?: boolean } | null) {
  mocks.identity.mockResolvedValue({ data: { user }, error: null });
}

function saveRequest(workspaceId: string, requestOrigin = origin, target = endpoint) {
  return new Request(target, {
    body: JSON.stringify({ revision: 7, state: starterWorkspace(), workspaceId }),
    headers: { origin: requestOrigin },
    method: "PUT",
  });
}

describe("private Fitness workspace API", () => {
  beforeEach(() => {
    vi.stubEnv("APP_URL", origin);
    vi.stubEnv("FITNESS_ADDITIONAL_ORIGIN", "");
    vi.stubEnv("SUPABASE_DB_URL", "test");
    vi.clearAllMocks();
    mocks.load.mockImplementation(async (id: string) => {
      const state = starterWorkspace();
      state.settings.name = id === first ? "First fixture" : "Second fixture";
      return { revision: 7, state };
    });
    mocks.save.mockResolvedValue(8);
  });
  afterEach(() => vi.unstubAllEnvs());

  it.each([null, { id: first }, { email_confirmed_at: "today", id: first, is_anonymous: true }])(
    "blocks workspace reads and writes before touching storage without a confirmed account",
    async (user) => {
      signIn(user);
      const result = await GET(new Request(`${endpoint}?userId=${first}`));
      expect(result.status).toBe(401);
      expect(result.headers.get("cache-control")).toContain("no-store");
      expect((await PUT(saveRequest(first))).status).toBe(401);
      expect(mocks.load).not.toHaveBeenCalled();
      expect(mocks.save).not.toHaveBeenCalled();
    },
  );

  it("ignores client-supplied read targets and loads each verified account independently", async () => {
    signIn({ email_confirmed_at: "today", id: first });
    const firstResult = await GET(new Request(`${endpoint}?userId=${second}`));
    expect(await firstResult.json()).toMatchObject({
      canEdit: true,
      state: { settings: { name: "First fixture" } },
      workspaceId: first,
    });
    signIn({ email_confirmed_at: "today", id: second });
    const secondResult = await GET(new Request(`${endpoint}?userId=${first}`));
    expect(await secondResult.json()).toMatchObject({
      canEdit: true,
      state: { settings: { name: "Second fixture" } },
      workspaceId: second,
    });
    expect(mocks.load.mock.calls).toEqual([[first], [second]]);
  });

  it("rejects cross-account and cross-origin saves and permits the current account's save", async () => {
    signIn({ email_confirmed_at: "today", id: second });
    expect((await PUT(saveRequest(first))).status).toBe(409);
    expect((await PUT(saveRequest(second, "https://other.example"))).status).toBe(403);
    expect(mocks.save).not.toHaveBeenCalled();
    expect(await (await PUT(saveRequest(second))).json()).toEqual({ revision: 8 });
    expect(mocks.save).toHaveBeenCalledExactlyOnceWith(second, expect.anything(), 7);
  });

  it("permits an explicitly configured second origin only for its own same-origin requests", async () => {
    const alias = "https://new-fitness.example";
    const aliasEndpoint = `${alias}/api/state`;
    signIn({ email_confirmed_at: "today", id: second });
    expect((await PUT(saveRequest(second, alias, aliasEndpoint))).status).toBe(403);
    vi.stubEnv("FITNESS_ADDITIONAL_ORIGIN", `${alias}/`);
    expect((await PUT(saveRequest(second, alias))).status).toBe(403);
    expect((await PUT(saveRequest(second, origin, aliasEndpoint))).status).toBe(403);
    expect(mocks.save).not.toHaveBeenCalled();
    expect((await PUT(saveRequest(second, alias, aliasEndpoint))).status).toBe(200);
    expect((await PUT(saveRequest(second))).status).toBe(200);
  });
});
