import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ rpc: mocks.rpc }) }));

import { GET } from "./route";

const secret = "fixture-only-scheduler-secret-32-characters";
const request = (token?: string) =>
  new Request("https://example.test/api/cron/publications", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
describe("scheduled publication worker", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("CRON_SECRET", secret);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.test");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "fixture-service");
  });
  afterEach(() => vi.unstubAllEnvs());
  it("denies absent, forged and unconfigured secrets before accessing the database", async () => {
    expect((await GET(request())).status).toBe(403);
    expect((await GET(request("forged"))).status).toBe(403);
    expect((await GET(request("é".repeat(secret.length)))).status).toBe(403);
    vi.stubEnv("CRON_SECRET", "");
    expect((await GET(request(secret))).status).toBe(403);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("executes only the due-job RPC and reports retryable storage failures without private data", async () => {
    mocks.rpc.mockResolvedValue({ data: 2, error: null });
    const response = await GET(request(secret));
    expect(await response.json()).toEqual({ completed: 2 });
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(mocks.rpc).toHaveBeenCalledWith("execute_portfolio_schedules");
    mocks.rpc.mockResolvedValue({ error: { message: "private SQL" } });
    const failed = await GET(request(secret));
    expect(failed.status).toBe(503);
    expect(await failed.text()).not.toContain("private SQL");
  });
});

// Keep per-test configuration mutable; production schemas are validated separately.
vi.mock("../../../../env", () => ({ env: process.env }));
