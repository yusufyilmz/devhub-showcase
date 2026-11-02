import type { ReviewState, ReviewWithReferrals } from "@shared/lib/types";

export type ReviewSectionProps = {
  reviews: ReviewWithReferrals[];
  handleReview: (reviewId: string, status: ReviewState) => Promise<ReviewWithReferrals | undefined>;
};

export type ReviewButtonOptions = {
  id: string;
  handleReview: (id: string, status: ReviewState) => Promise<ReviewWithReferrals | undefined>;
};
