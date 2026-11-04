import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  account: "11111111-1111-4111-8111-111111111111",
  commit: vi.fn(),
  list: vi.fn(),
  read: vi.fn(),
  release: vi.fn(),
  reserve: vi.fn(),
}));
vi.mock("../client", () => ({
  billingServiceClient: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: mocks.read }) }),
      update: () => ({ eq: () => ({ eq: mocks.release }) }),
    }),
    rpc: (name: string, args: unknown) =>
      name === "claim_billing" ? mocks.reserve(args) : mocks.commit(args),
  }),
}));
vi.mock("./stripe", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./stripe")>()),
  createStripe: () => ({ subscriptions: { list: mocks.list } }),
  stripeConfiguration: () => ({ chat: 100, editor: 10, price: "price_pro" }),
}));

import { synchronize } from "./gateway";

const subscription = {
  id: "sub_test",
  items: {
    data: [
      {
        current_period_end: 200,
        current_period_start: 100,
        price: { id: "price_pro" },
        quantity: 1,
      },
    ],
  },
  livemode: false,
  status: "active",
};
describe("confirmed billing synchronization", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.read.mockResolvedValue({ data: { account_id: mocks.account }, error: null });
    mocks.reserve.mockResolvedValue({ data: true, error: null });
    mocks.commit.mockResolvedValue({ data: true, error: null });
    mocks.release.mockResolvedValue({ error: null });
    mocks.list.mockResolvedValue({ data: [subscription], has_more: false });
  });
  it("fetches the current provider state for a delayed older event rather than restoring its historical grant", async () => {
    await synchronize("cus_test", "evt_newer");
    expect(mocks.commit.mock.calls[0]?.[0]).toMatchObject({
      p_account: mocks.account,
      p_event: "evt_newer",
      p_state: { chat: 100, status: "active" },
    });
    mocks.list.mockResolvedValue({
      data: [{ ...subscription, status: "past_due" }],
      has_more: false,
    });
    await synchronize("cus_test", "evt_older");
    expect(mocks.commit.mock.calls[1]?.[0]).toMatchObject({
      p_event: "evt_older",
      p_state: { chat: 0, editor: 0, status: "past_due" },
    });
    expect(mocks.list).toHaveBeenCalledTimes(2);
    expect(mocks.release).toHaveBeenCalledTimes(2);
  });
  it("does not call Stripe while another worker holds the lease and rejects fenced commits for retry", async () => {
    mocks.reserve.mockResolvedValue({ data: false, error: null });
    await expect(synchronize("cus_test", "evt_busy")).rejects.toThrow("progress");
    expect(mocks.list).not.toHaveBeenCalled();
    mocks.reserve.mockResolvedValue({ data: true, error: null });
    mocks.commit.mockResolvedValue({ data: false, error: null });
    await expect(synchronize("cus_test", "evt_expired")).rejects.toThrow("synchronize");
    expect(mocks.release).toHaveBeenCalledTimes(1);
  });
  it("does not acknowledge provider/storage failures as success and ignores unmapped customers", async () => {
    mocks.list.mockRejectedValue(new Error("provider unavailable"));
    await expect(synchronize("cus_test", "evt_retry")).rejects.toThrow("provider unavailable");
    expect(mocks.commit).not.toHaveBeenCalled();
    expect(mocks.release).toHaveBeenCalledTimes(1);
    mocks.read.mockResolvedValue({ data: null, error: null });
    await expect(synchronize("cus_unmapped", "evt_unmapped")).resolves.toBeUndefined();
    expect(mocks.reserve).toHaveBeenCalledTimes(1);
  });
});
