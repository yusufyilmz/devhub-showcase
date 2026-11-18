"use server";

import type { ReviewState } from "@shared/lib/types";

import { decidePortfolioReview } from "@/services/review/get-service";

export async function submitPortfolioReviewAction(
  id: string,
  state: ReviewState,
  updatedAt: string,
) {
  return decidePortfolioReview(id, state, updatedAt);
}
