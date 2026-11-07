import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireWorkspace: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@shared/lib/supabase", () => ({
  createServerClient: async () => ({
    auth: { signInWithPassword: mocks.signIn, signOut: mocks.signOut },
  }),
}));
vi.mock("@/features/admin/admin-auth", () => ({ requireWorkspace: mocks.requireWorkspace }));

import { POST } from "./route";

describe("local test login", () => {
  const request = (
    origin = "http://localhost:3000",
    url = "http://localhost:3000/api/auth/local-test",
  ) => new Request(url, { headers: { Origin: origin }, method: "POST" });

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_TEST_LOGIN", "true");
    vi.stubEnv("LOCAL_TEST_EMAIL", "local-test@example.test");
    vi.stubEnv("LOCAL_TEST_PASSWORD", "fixture-password");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    mocks.signIn.mockResolvedValue({ error: null });
    mocks.signOut.mockResolvedValue({ error: null });
    mocks.requireWorkspace.mockResolvedValue({});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates a genuine local auth session and verifies the workspace", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.signIn).toHaveBeenCalledWith({
      email: "local-test@example.test",
      password: "fixture-password",
    });
    expect(mocks.requireWorkspace).toHaveBeenCalledOnce();
  });

  it.each([
    ["production", "production", "http://127.0.0.1:54321"],
    ["hosted Supabase", "development", "https://project.supabase.co"],
  ])("fails closed for %s", async (_name, nodeEnv, dbUrl) => {
    vi.stubEnv("NODE_ENV", nodeEnv);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", dbUrl);
    expect((await POST(request())).status).toBe(404);
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  it("rejects remote and cross-origin callers", async () => {
    expect((await POST(request("https://evil.example"))).status).toBe(404);
    expect(
      (await POST(request("http://localhost:3000", "http://evil.example/api/auth/local-test")))
        .status,
    ).toBe(404);
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  it("does not issue a session without explicit credentials", async () => {
    vi.stubEnv("LOCAL_TEST_PASSWORD", undefined);
    expect((await POST(request())).status).toBe(503);
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  it("clears the session when workspace authorization fails", async () => {
    mocks.requireWorkspace.mockRejectedValue(new Error("missing workspace"));
    expect((await POST(request())).status).toBe(503);
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" });
  });
});

// Keep per-test configuration mutable; production schemas are validated separately.
vi.mock("../../../../env", () => ({ env: process.env }));
