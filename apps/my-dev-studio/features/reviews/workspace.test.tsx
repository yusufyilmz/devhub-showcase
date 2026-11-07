import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ pending: vi.fn(), requireAdmin: vi.fn() }));

vi.mock("@/features/admin/admin-auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@shared/services/studio", () => ({
  ReviewService: class {
    getPendingReviews = mocks.pending;
  },
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("Not found");
  },
  redirect: (path: string) => {
    throw new Error(`Redirect: ${path}`);
  },
}));
vi.mock("../../app/actions", () => ({ handleSubmitReviewAction: vi.fn() }));

import ReviewsRedirect from "../../app/(site)/reviews/page";
import PortfolioReviewPage from "../../app/[username]/review/page";

describe("portfolio reviews route", () => {
  const params = (username: string) => ({ params: Promise.resolve({ username }) });

  beforeEach(() => {
    vi.resetAllMocks();
    mocks.requireAdmin.mockResolvedValue({
      client: {},
      repository: { read: async () => ({ username: "current-owner" }) },
    });
    mocks.pending.mockResolvedValue([]);
  });

  it("redirects the legacy route to the current main portfolio username", async () => {
    await expect(ReviewsRedirect()).rejects.toThrow("Redirect: /current-owner/edit?tab=review");
  });

  it("redirects unauthenticated requests before reading reviews", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("Forbidden"));
    await expect(ReviewsRedirect()).rejects.toThrow("Redirect: /login");
    await expect(PortfolioReviewPage(params("current-owner"))).rejects.toThrow("Redirect: /login");
    expect(mocks.pending).not.toHaveBeenCalled();
  });

  it("opens the queue only at the authorized portfolio username", async () => {
    await expect(PortfolioReviewPage(params("someone-else"))).rejects.toThrow("Not found");
    expect(mocks.pending).not.toHaveBeenCalled();
    await expect(PortfolioReviewPage(params("current-owner"))).resolves.toBeTruthy();
    expect(mocks.pending).toHaveBeenCalledOnce();
  });
});
