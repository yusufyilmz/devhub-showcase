import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  admin: vi.fn(),
  relay: vi.fn(),
  trello: vi.fn(),
}));
vi.mock("@/services/management/get-portfolios", () => ({ requirePortfolioAdmin: mocks.admin }));
vi.mock("@/services/jobs/get-config", () => ({ jobAlertConfig: mocks.relay }));
vi.mock("@/services/trello/get-config", () => ({ trelloConfig: mocks.trello }));

import { getAccountMenu } from "@/services/home/get-account-menu";

describe("account menu links", () => {
  beforeEach(() => {
    mocks.admin.mockReset().mockRejectedValue(new Error("No management access"));
    mocks.relay.mockReset().mockReturnValue(null);
    mocks.trello.mockReset().mockReturnValue(null);
  });

  it("offers Trello only to administrators with a configured connection", async () => {
    const action = { href: "/owner/edit", label: "Open studio", signedIn: true };
    mocks.trello.mockReturnValue({});
    expect((await getAccountMenu({ action }))?.props.canAccessTrello).toBe(false);

    mocks.admin.mockResolvedValue({});
    expect((await getAccountMenu({ action }))?.props.canAccessTrello).toBe(true);

    mocks.trello.mockReturnValue(null);
    expect((await getAccountMenu({ action }))?.props.canAccessTrello).toBe(false);
  });

  it("keeps private navigation hidden from signed-out users", async () => {
    expect(
      await getAccountMenu({ action: { href: "/login", label: "Sign in", signedIn: false } }),
    ).toBeNull();
    expect(mocks.admin).not.toHaveBeenCalled();
  });

  it("binds the owner’s editor and includes management and email links when available", async () => {
    mocks.admin.mockResolvedValue({});
    mocks.relay.mockReturnValue({ domain: "jobs.example.test" });
    const menu = await getAccountMenu({
      action: { href: "/owner/edit", label: "Open studio", signedIn: true },
    });
    expect(menu?.props).toMatchObject({
      canImportLinkedInAlerts: true,
      canManagePortfolios: true,
      studioHref: "/owner/edit",
    });
  });
});
