import type React from "react";

import { Card } from "../../cards";
import { ReferralItem } from "../referral-section/ReferralItem";
import { ReviewButton } from "./ReviewButton";
import { reviewSectionStyles } from "./styles";
import type { ReviewSectionProps } from "./types";

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews = [], handleReview }) => {
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section aria-label="Review queue" className="editor-card">
        {reviews.length === 0 && <p>No reviews are waiting for approval.</p>}
        <div className={reviewSectionStyles.list}>
          {reviews?.map((review) => {
            if (!review.referral?.name) {
              return null;
            }

            return (
              <div className={reviewSectionStyles.item} key={review.id}>
                <ReferralItem key={review.id} referral={review.referral}>
                  <ReviewButton handleReview={handleReview} id={review.id} />
                </ReferralItem>
              </div>
            );
          })}
        </div>
      </section>
    </Card>
  );
};
