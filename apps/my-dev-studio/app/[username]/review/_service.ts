import { createPortfolioReviewService } from "@shared/lib/portfolio-reviews";
import { logger } from "@shared/utils/logger";

import { requireAdmin } from "@/features/admin/admin-auth";

import { portfolioAccessServer } from "../access/_session";

export const { loadPendingPortfolioReviews, decidePortfolioReview, savePortfolioReferral } =
  createPortfolioReviewService({ logger, portfolioAccessServer, requireAdmin });
