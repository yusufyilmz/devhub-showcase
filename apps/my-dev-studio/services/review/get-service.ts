import { createPortfolioReviewService } from "@shared/lib/portfolio-reviews";
import { logger } from "@shared/utils/logger";

import { requireAdmin } from "@/services/admin/get-auth";
import { portfolioAccessServer } from "@/services/portfolio/get-access-session";

export const { loadPendingPortfolioReviews, decidePortfolioReview, savePortfolioReferral } =
  createPortfolioReviewService({ logger, portfolioAccessServer, requireAdmin });
