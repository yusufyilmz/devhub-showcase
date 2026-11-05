import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  finish: vi.fn(),
  limit: vi.fn(),
  propose: vi.fn(),
  reserve: vi.fn(),
  workspace: vi.fn(),
}));
vi.mock("@/features/admin/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://studio.example",
}));
vi.mock("@shared/assistant", () => ({ proposeInterviewPrep: mocks.propose }));
vi.mock("@shared/cache", () => ({ allowStudioAssistant: mocks.limit }));
vi.mock("@shared/billing/server", () => ({
  billingServiceClient: () => ({}),
  PremiumUsageRepository: class {
    finish = mocks.finish;
    reserve = mocks.reserve;
  },
  premiumAiConfigured: () => true,
}));

import { POST } from "./route";

const requestId = "00000000-0000-4000-8000-000000000002";
const accountId = "00000000-0000-4000-8000-000000000001";
const context = {
  evidence: [{ facts: ["Built a test suite"], title: "Frontend role" }],
  job: "Frontend role with test ownership",
};

function request(input: object = {}, origin = "https://studio.example") {
  return new Request("https://studio.example/api/assistant/job", {
    body: JSON.stringify({ ...context, requestId, ...input }),
    headers: { origin },
    method: "POST",
  });
}

describe("CV interview prep", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.workspace.mockResolvedValue({
      repository: { read: async () => ({ id: "owner-profile" }) },
      user: { id: accountId },
    });
    mocks.limit.mockResolvedValue(true);
    mocks.reserve.mockResolvedValue(true);
    mocks.finish.mockResolvedValue(undefined);
    mocks.propose.mockResolvedValue({
      gaps: [],
      questions: ["How did you test it?"],
      summary: "Test ownership",
    });
  });

  it("uses the authenticated owner's allowance and sends only the selected evidence", async () => {
    const response = await POST(request({ profileId: "someone-else" }));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(mocks.reserve).toHaveBeenCalledWith(
      accountId,
      "owner-profile",
      "studio_assistant",
      requestId,
    );
    expect(mocks.propose).toHaveBeenCalledWith(context, expect.any(AbortSignal));
  });

  it("rejects foreign origins, missing evidence, and exhausted allowance before generation", async () => {
    expect((await POST(request({}, "https://other.example"))).status).toBe(403);
    expect(mocks.workspace).not.toHaveBeenCalled();
    expect((await POST(request({ evidence: [] }))).status).toBe(400);
    mocks.reserve.mockResolvedValue(false);
    expect((await POST(request())).status).toBe(503);
    expect(mocks.propose).not.toHaveBeenCalled();
  });
});
