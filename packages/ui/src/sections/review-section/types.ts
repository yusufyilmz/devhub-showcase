import type { ReviewState, ReviewWithReferrals } from "@shared/lib/types";

export type ReviewSectionProps = {
  reviews: ReviewWithReferrals[] | null;
  handleReview: (
    reviewId: string,
    status: ReviewState,
    updatedAt: string,
  ) => Promise<"saved" | "conflict" | "error">;
};

export type ReviewButtonOptions = {
  id: string;
  name: string;
  updatedAt: string;
  handleReview: ReviewSectionProps["handleReview"];
};
