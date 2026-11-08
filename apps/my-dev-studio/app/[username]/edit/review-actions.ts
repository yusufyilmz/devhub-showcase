"use server";

import type { ReviewState } from "../../../../../packages/lib/src/types";
import { decidePortfolioReview } from "../review/_service";

export async function submitPortfolioReviewAction(
  id: string,
  state: ReviewState,
  updatedAt: string,
) {
  return decidePortfolioReview(id, state, updatedAt);
}
