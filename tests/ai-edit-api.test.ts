import { beforeEach, expect, it, vi } from "vitest";

import { profile } from "../packages/content/src/index";
import { ProfileAccessError } from "../packages/lib/src/repositories/profile-repository";

const mocks = vi.hoisted(() => ({
  finish: vi.fn(),
  propose: vi.fn(),
  rate: vi.fn(),
  read: vi.fn(),
  reserve: vi.fn(),
  save: vi.fn(),
  summary: vi.fn(),
  workspace: vi.fn(),
}));
vi.mock("../apps/web/lib/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://example.test",
}));
vi.mock("../apps/web/lib/billing/client", () => ({ billingServiceClient: () => ({}) }));
vi.mock("@shared/cache", () => ({ allowStudioAssistant: mocks.rate }));
vi.mock("@shared/chat", () => ({
  PortfolioEditModel: class {
    propose = mocks.propose;
  },
}));
vi.mock("@shared/lib/billing-repository", () => ({
  BillingRepository: class {
    summary = mocks.summary;
  },
  PremiumUsageRepository: class {
    reserve = mocks.reserve;
    finish = mocks.finish;
  },
}));

import { GET, POST } from "../apps/web/app/api/admin/assistant/route";

const account = "11111111-1111-4111-8111-111111111111";
const id = "22222222-2222-4222-8222-222222222222";
const snapshot = { id, isPublic: false, profile, revision: 2, updatedAt: "", username: "alex" };
const input = {
  draft: profile,
  message: "Use a violet accent",
  profileId: id,
  requestId: "33333333-3333-4333-8333-333333333333",
  revision: 2,
};
function post(body: unknown = input, origin = "https://example.test") {
  return POST(
    new Request("https://example.test/api/admin/assistant", {
      body: JSON.stringify(body),
      headers: { origin },
      method: "POST",
    }),
  );
}
beforeEach(() => {
  vi.clearAllMocks();
  for (const key of ["OPENAI_API_KEY", "REDIS_URL", "REDIS_TOKEN", "SUPABASE_SERVICE_ROLE_KEY"])
    vi.stubEnv(key, "test");
  mocks.read.mockResolvedValue(snapshot);
  mocks.workspace.mockResolvedValue({
    client: {},
    repository: { read: mocks.read, save: mocks.save },
    service: { requireOwner: async () => undefined },
    user: { id: account },
  });
  mocks.summary.mockResolvedValue({
    assignedProfileId: id,
    limits: { studio_assistant: 10 },
    plan: "pro",
    usage: { studio_assistant: 0 },
  });
  mocks.rate.mockResolvedValue(true);
  mocks.reserve.mockResolvedValue(true);
  mocks.finish.mockResolvedValue(undefined);
  mocks.propose.mockResolvedValue({ changes: [], summary: "Suggestion" });
});
it("authorizes private owner knowledge and reserves studio usage without saving", async () => {
  const response = await post();
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(mocks.reserve).toHaveBeenCalledWith(account, id, "studio_assistant", input.requestId);
  expect(mocks.propose.mock.calls[0]?.[0].audience).toBe("owner");
  expect(mocks.save).not.toHaveBeenCalled();
});
it("denies anonymous/foreign workspace access and stale revisions before provider calls", async () => {
  expect((await post({ ...input, profileId: "managed-record" })).status).toBe(403);
  expect((await post({ ...input, revision: 1 })).status).toBe(409);
  mocks.workspace.mockRejectedValue(new ProfileAccessError());
  expect((await post()).status).toBe(403);
  expect((await GET()).status).toBe(403);
  expect(mocks.propose).not.toHaveBeenCalled();
});
it("rejects origin, quota, forged context and unavailable configuration", async () => {
  expect((await post(input, "https://other.test")).status).toBe(403);
  expect((await post({ ...input, isPublic: true })).status).toBe(400);
  mocks.reserve.mockResolvedValue(false);
  expect((await post()).status).toBe(503);
  expect(mocks.propose).not.toHaveBeenCalled();
  vi.stubEnv("OPENAI_API_KEY", "");
  expect((await post()).status).toBe(503);
});
it("refuses results after a concurrent saved update and reports exhausted status", async () => {
  mocks.read.mockResolvedValueOnce(snapshot).mockResolvedValueOnce({ ...snapshot, revision: 3 });
  expect((await post()).status).toBe(409);
  expect(mocks.save).not.toHaveBeenCalled();
  mocks.read.mockResolvedValue(snapshot);
  mocks.summary.mockResolvedValue({
    assignedProfileId: id,
    limits: { studio_assistant: 10 },
    plan: "pro",
    usage: { studio_assistant: 10 },
  });
  expect(await (await GET()).json()).toMatchObject({ enabled: false });
});
it("rejects oversized bodies and unpaid users before rate or paid usage reservations", async () => {
  expect((await post({ ...input, message: "x".repeat(250001) })).status).toBe(413);
  mocks.summary.mockResolvedValue({
    assignedProfileId: null,
    limits: { studio_assistant: 0 },
    plan: "free",
    usage: { studio_assistant: 0 },
  });
  expect((await post()).status).toBe(503);
  expect(mocks.rate).not.toHaveBeenCalled();
  expect(mocks.reserve).not.toHaveBeenCalled();
});
