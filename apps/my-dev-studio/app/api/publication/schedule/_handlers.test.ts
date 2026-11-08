import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileAccessError } from "@shared/lib/profile";

const mocks = vi.hoisted(() => ({
  managed: vi.fn(),
  origin: vi.fn(),
  rpc: vi.fn(),
  workspace: vi.fn(),
}));
vi.mock("@/features/admin/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
  sameOrigin: mocks.origin,
}));
vi.mock("@/features/management/managed-portfolios", () => ({ managedRepository: mocks.managed }));

import { publicationSchedule } from "./_handlers";

const input = { revision: 5, runAt: "2027-01-01T12:00:00Z", timezone: "Europe/Madrid" };
const request = (body?: unknown, method = "POST") =>
  new Request("https://example.test/api/publication/schedule", {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
describe("private publication schedule API", () => {
  afterEach(() => vi.unstubAllEnvs());
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("CRON_SECRET", "fixture-only-scheduler-secret-32-characters");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "fixture-service");
    mocks.origin.mockReturnValue(true);
    mocks.rpc.mockResolvedValue({ data: [], error: null });
    const context = {
      client: { rpc: mocks.rpc },
      repository: { read: async () => ({ id: "authorized", revision: 5 }) },
    };
    mocks.workspace.mockResolvedValue(context);
    mocks.managed.mockResolvedValue(context);
  });
  it("binds schedules to the authorized workspace and rejects source/identity injection", async () => {
    expect((await publicationSchedule(request({ ...input, profile_id: "victim" }))).status).toBe(
      400,
    );
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect((await publicationSchedule(request(input))).status).toBe(200);
    expect(mocks.rpc).toHaveBeenCalledWith("schedule_portfolio_publication", {
      expected_revision: 5,
      profile_id: "authorized",
      run_at: input.runAt,
      timezone: input.timezone,
    });
    expect((await publicationSchedule(request(undefined, "GET"), "managed")).status).toBe(200);
    expect(mocks.managed).toHaveBeenCalledWith("managed");
  });
  it("requires origin, authentication, revision and scheduler setup", async () => {
    mocks.origin.mockReturnValue(false);
    expect((await publicationSchedule(request(input))).status).toBe(403);
    mocks.origin.mockReturnValue(true);
    mocks.workspace.mockRejectedValueOnce(new ProfileAccessError());
    expect((await publicationSchedule(request(undefined, "GET"))).status).toBe(403);
    mocks.rpc.mockResolvedValueOnce({ error: { code: "40001" } });
    expect((await publicationSchedule(request(input))).status).toBe(409);
    vi.stubEnv("CRON_SECRET", "");
    expect((await publicationSchedule(request(input))).status).toBe(503);
  });
  it("cancels only the specified schedule and preserves invalid-time and storage errors", async () => {
    const scheduleId = "11111111-1111-4111-8111-111111111111";
    expect((await publicationSchedule(request({ scheduleId }, "DELETE"))).status).toBe(200);
    expect(mocks.rpc).toHaveBeenCalledWith("cancel_portfolio_schedule", {
      profile_id: "authorized",
      schedule_id: scheduleId,
    });
    mocks.rpc.mockResolvedValueOnce({ error: { code: "22023" } });
    expect((await publicationSchedule(request(input))).status).toBe(400);
    mocks.rpc.mockResolvedValueOnce({ error: { code: "storage" } });
    expect((await publicationSchedule(request(input))).status).toBe(503);
  });
});

// Keep per-test configuration mutable; production schemas are validated separately.
vi.mock("../../../../env", () => ({ env: process.env }));
