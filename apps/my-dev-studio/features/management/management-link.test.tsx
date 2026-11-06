import { renderToStaticMarkup } from "react-dom/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requirePortfolioAdmin: vi.fn(),
}));
vi.mock("@/features/management/managed-portfolios", () => ({
  requirePortfolioAdmin: mocks.requirePortfolioAdmin,
}));

import { ManagementLink } from "@/features/management/management-link";

describe("ManagementLink", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("hides portfolio management from someone who is not an administrator", async () => {
    mocks.requirePortfolioAdmin.mockRejectedValue(new Error("forbidden"));
    expect(await ManagementLink()).toBeNull();
  });
  it("offers administrators an icon link to managed portfolios", async () => {
    mocks.requirePortfolioAdmin.mockResolvedValue({ user: { id: "admin" } });
    const markup = renderToStaticMarkup(await ManagementLink());
    expect(markup).toContain('href="/admin/portfolios"');
    expect(markup).toContain('aria-label="Manage portfolios"');
    expect(markup).toContain('data-variant="outline"');
  });
});
