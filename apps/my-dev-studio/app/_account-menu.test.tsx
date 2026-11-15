import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  admin: vi.fn(),
  relay: vi.fn(),
}));
vi.mock("@/features/management/managed-portfolios", () => ({ requirePortfolioAdmin: mocks.admin }));
vi.mock("./api/jobs/_config", () => ({ jobAlertConfig: mocks.relay }));

import { getAccountMenu } from "./_account-menu";

describe("account menu links", () => {
  beforeEach(() => {
    mocks.admin.mockReset().mockRejectedValue(new Error("No management access"));
    mocks.relay.mockReset().mockReturnValue(null);
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
