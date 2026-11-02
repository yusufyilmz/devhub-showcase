import type React from "react";

import { Typography } from "../../display/typography";
import { ReferralItem } from "../referral-section/ReferralItem";
import { ReviewButton } from "./ReviewButton";
import { reviewSectionStyles } from "./styles";
import type { ReviewSectionProps } from "./types";

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews = [], handleReview }) => {
  return (
    <section
      className={
        "px-[5%] mb-16 relative opacity-0 translate-y-8 transition-all duration-700 animate-fade-in-on-scroll parallax w-full flex flex-col items-center justify-start "
      }
    >
      <Typography className={reviewSectionStyles.element1} variant="h2">
        Pending Reviews
      </Typography>
      <div className={reviewSectionStyles.element2}>
        {reviews?.map((review) => {
          if (!review.referral?.name) {
            return null;
          }

          return (
            <div className={reviewSectionStyles.element3} key={review.id}>
              <ReferralItem key={review.id} referral={review.referral}>
                <ReviewButton handleReview={handleReview} id={review.id} />
              </ReferralItem>
            </div>
          );
        })}
      </div>
    </section>
  );
};
