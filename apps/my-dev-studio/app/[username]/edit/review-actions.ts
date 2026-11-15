"use server";

import type { ReviewState } from "@shared/lib/types";

import { decidePortfolioReview } from "@/features/portfolio/portfolio-reviews";

export async function submitPortfolioReviewAction(
  id: string,
  state: ReviewState,
  updatedAt: string,
) {
  return decidePortfolioReview(id, state, updatedAt);
}
