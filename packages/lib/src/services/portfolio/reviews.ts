import type { Logger } from "@shared/utils/logger";

import { ReviewState, type SupabaseDbClient } from "../../types/index";
import { ReferralService, ReviewService } from "../studio/index";

export function createPortfolioReviewService({
  requireAdmin,
  portfolioAccessServer,
  logger,
}: {
  requireAdmin: () => Promise<{ client: SupabaseDbClient }>;
  portfolioAccessServer: () => { client: SupabaseDbClient };
  logger: Logger;
}) {
  async function loadPendingPortfolioReviews(client: SupabaseDbClient) {
    try {
      return await new ReviewService(logger, client).getPendingReviews();
    } catch {
      logger.error("Could not load the portfolio review queue");
      return null;
    }
  }

  async function decidePortfolioReview(id: string, state: ReviewState, updatedAt: string) {
    if (
      typeof id !== "string" ||
      !id.trim() ||
      typeof updatedAt !== "string" ||
      !Number.isFinite(Date.parse(updatedAt)) ||
      (state !== ReviewState.APPROVED && state !== ReviewState.REJECTED)
    ) {
      return "error";
    }

    try {
      const { client } = await requireAdmin();
      const saved = await new ReviewService(logger, client).update(id, { state, updatedAt });
      return saved ? "saved" : "conflict";
    } catch {
      return "error";
    }
  }

  async function savePortfolioReferral(category: string, answer: string, sessionId: string) {
    const { client } = portfolioAccessServer();
    await new ReferralService(logger, client).saveReferral(category, answer, sessionId);
  }

  return { decidePortfolioReview, loadPendingPortfolioReviews, savePortfolioReferral };
}
