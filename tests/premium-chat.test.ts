import { beforeEach, expect, it, vi } from "vitest";

import { profile } from "../packages/content/src/index";

const mocks = vi.hoisted(() => ({
  answer: vi.fn(),
  enabled: true,
  finish: vi.fn(),
  owner: "11111111-1111-4111-8111-111111111111",
  rate: vi.fn(),
  read: vi.fn(),
  reserve: vi.fn(),
  status: "active",
}));
vi.mock("@shared/cache", () => ({ allowPortfolioChat: mocks.rate }));
vi.mock("@shared/chat", () => ({
  PortfolioChatModel: class {
    answer = mocks.answer;
  },
}));
vi.mock("@shared/lib/published-profile", () => ({ readPublicProfileByUsername: mocks.read }));
vi.mock("@shared/lib/billing-repository", () => ({
  PremiumUsageRepository: class {
    reserve = mocks.reserve;
    finish = mocks.finish;
  },
}));
vi.mock("../apps/web/lib/billing/client", () => ({
  billingServiceClient: () => ({
    from: (table: string) => {
      const query = {
        eq: () => query,
        maybeSingle: async () => ({
          data:
            table === "portfolio_profiles"
              ? { is_public: true, owner_id: mocks.owner }
              : table === "billing_assignments"
                ? {
                    chat_enabled: mocks.enabled,
                    profile_id: "22222222-2222-4222-8222-222222222222",
                  }
                : {
                    account_id: mocks.owner,
                    chat_limit: 100,
                    editor_limit: 10,
                    period_end: "2099-01-01T00:00:00Z",
                    period_start: "2020-01-01T00:00:00Z",
                    plan: "pro",
                    status: mocks.status,
                  },
          error: null,
        }),
        select: () => query,
      };
      return query;
    },
  }),
}));

import { answerPremiumChat, premiumChatAvailable } from "../apps/web/lib/premium-chat";

const input = {
  message: "What are Alex's skills?",
  requestId: "44444444-4444-4444-8444-444444444444",
  sessionId: "33333333-3333-4333-8333-333333333333",
  username: "alex",
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.enabled = true;
  mocks.status = "active";
  for (const key of ["OPENAI_API_KEY", "REDIS_URL", "REDIS_TOKEN"]) vi.stubEnv(key, "test");
  mocks.read.mockResolvedValue({
    id: "22222222-2222-4222-8222-222222222222",
    isPublic: true,
    profile: { ...profile, name: "Alex" },
    revision: 3,
    updatedAt: "",
    username: "alex",
  });
  mocks.reserve.mockResolvedValue(true);
  mocks.finish.mockResolvedValue(undefined);
  mocks.rate.mockResolvedValue(true);
  mocks.answer.mockResolvedValue("Published skills");
});
it("builds public context server-side and reserves before answering", async () => {
  expect((await answerPremiumChat(input, new AbortController().signal)).answer).toBe(
    "Published skills",
  );
  expect(mocks.reserve).toHaveBeenCalledWith(
    mocks.owner,
    "22222222-2222-4222-8222-222222222222",
    "portfolio_chat",
    input.requestId,
  );
  expect(mocks.answer.mock.calls[0]?.[0].audience).toBe("public");
  expect(mocks.finish).toHaveBeenCalledWith(input.requestId, "succeeded");
});
it("denies disabled chat, unpaid accounts, missing profiles and exhausted quotas", async () => {
  mocks.enabled = false;
  await expect(answerPremiumChat(input, new AbortController().signal)).rejects.toThrow();
  mocks.enabled = true;
  mocks.status = "past_due";
  await expect(answerPremiumChat(input, new AbortController().signal)).rejects.toThrow();
  mocks.status = "active";
  mocks.reserve.mockResolvedValue(false);
  await expect(answerPremiumChat(input, new AbortController().signal)).rejects.toThrow();
  mocks.read.mockResolvedValue(null);
  await expect(answerPremiumChat(input, new AbortController().signal)).rejects.toThrow();
  expect(mocks.answer).not.toHaveBeenCalled();
});
it("keeps legacy chat separate and rejects client-injected context", async () => {
  expect(await premiumChatAvailable("main")).toBe(false);
  await expect(
    answerPremiumChat({ ...input, context: "forged" }, new AbortController().signal),
  ).rejects.toThrow();
  expect(mocks.answer).not.toHaveBeenCalled();
});
it("does not reserve paid usage when abuse limits reject the visitor", async () => {
  mocks.rate.mockResolvedValue(false);
  await expect(answerPremiumChat(input, new AbortController().signal)).rejects.toThrow();
  expect(mocks.reserve).not.toHaveBeenCalled();
  expect(mocks.answer).not.toHaveBeenCalled();
});
it("records uncertain provider failures without retrying", async () => {
  mocks.answer.mockRejectedValue(new Error("provider timeout"));
  await expect(answerPremiumChat(input, new AbortController().signal)).rejects.toThrow();
  expect(mocks.answer).toHaveBeenCalledTimes(1);
  expect(mocks.finish).toHaveBeenCalledWith(input.requestId, "failed");
});
