import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  adminStatus: vi.fn(),
  legacyAdmin: vi.fn(),
  relay: vi.fn(),
  session: vi.fn(),
  trello: vi.fn(),
}));
vi.mock("@/services/home/get-home-links", () => ({ getHomeSession: mocks.session }));
vi.mock("@/services/management/get-portfolios", () => ({
  portfolioAdminStatus: mocks.adminStatus,
  requirePortfolioAdmin: mocks.legacyAdmin,
}));
vi.mock("@/services/jobs/get-config", () => ({ jobAlertConfig: mocks.relay }));
vi.mock("@/services/trello/get-config", () => ({ trelloConfig: mocks.trello }));

import { getAccountMenu } from "@/services/home/get-account-menu";

describe("account menu links", () => {
  const client = { rpc: vi.fn() };
  const ownerAction = { href: "/owner/edit", label: "Open studio", signedIn: true };
  beforeEach(() => {
    mocks.adminStatus.mockReset().mockResolvedValue(false);
    mocks.legacyAdmin.mockReset();
    mocks.session.mockReset().mockResolvedValue({ action: ownerAction, client });
    mocks.relay.mockReset().mockReturnValue(null);
    mocks.trello.mockReset().mockReturnValue(null);
  });

  it("offers Trello only to administrators with a configured connection", async () => {
    mocks.trello.mockReturnValue({});
    expect((await getAccountMenu({ action: ownerAction }))?.props.canAccessTrello).toBe(false);

    mocks.adminStatus.mockResolvedValue(true);
    expect((await getAccountMenu({ action: ownerAction }))?.props.canAccessTrello).toBe(true);

    mocks.trello.mockReturnValue(null);
    expect((await getAccountMenu({ action: ownerAction }))?.props.canAccessTrello).toBe(false);
  });

  it("keeps private navigation hidden from signed-out users without a session lookup", async () => {
    expect(
      await getAccountMenu({ action: { href: "/login", label: "Sign in", signedIn: false } }),
    ).toBeNull();
    expect(mocks.session).not.toHaveBeenCalled();
    expect(mocks.adminStatus).not.toHaveBeenCalled();
    expect(mocks.legacyAdmin).not.toHaveBeenCalled();
  });

  it("keeps private navigation hidden when the verified home session is a guest", async () => {
    mocks.session.mockResolvedValue({
      action: { href: "/login", label: "Sign in", signedIn: false },
      client: null,
    });
    expect(await getAccountMenu({})).toBeNull();
    expect(mocks.adminStatus).not.toHaveBeenCalled();
  });

  it("reuses the verified client for admin flags without rechecking the identity", async () => {
    mocks.adminStatus.mockResolvedValue(true);
    mocks.relay.mockReturnValue({ domain: "jobs.example.test" });
    const menu = await getAccountMenu({ action: ownerAction });
    expect(mocks.session).toHaveBeenCalledTimes(1);
    expect(mocks.adminStatus).toHaveBeenCalledExactlyOnceWith(client);
    expect(mocks.legacyAdmin).not.toHaveBeenCalled();
    expect(menu?.props).toMatchObject({
      canImportLinkedInAlerts: true,
      canManagePortfolios: true,
      studioHref: "/owner/edit",
    });
    expect(menu?.props.client).toBeUndefined();
  });

  it("fails closed on administrator status lookup errors", async () => {
    mocks.adminStatus.mockRejectedValue(new Error("unavailable"));
    const menu = await getAccountMenu({ action: ownerAction });
    expect(menu?.props.canManagePortfolios).toBe(false);
  });
});
