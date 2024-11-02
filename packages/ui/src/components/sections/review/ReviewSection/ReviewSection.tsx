import { Typography } from '@shared/ui/components'
import { ReviewState, ReviewWithReferrals } from '@shared/lib/types'
import { ReferralItem } from '../../referral/ReferralItem'
import { ReviewButton } from '../ReviewButton/ReviewButton'

type ReviewSectionProps = {
  reviews: ReviewWithReferrals[]
  handleReview: (
    reviewId: string,
    status: ReviewState
  ) => Promise<ReviewWithReferrals | undefined>
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  handleReview
}) => {
  return (
    <section
      className={`px-[5%] mb-16 relative opacity-0 translate-y-8 transition-all duration-700 animate-fade-in-on-scroll parallax w-full flex flex-col items-center justify-start `}
    >
      <Typography variant="h2" className="mb-8 text-center">
        Pending Reviews
      </Typography>
      <div className="flex flex-wrap gap-y-4 gap-x-1 sm:gap-x-2 md:gap-x-6 overflow-y-auto no-scrollbar w-full mt-32 md:mt-0 p">
        {reviews.map(review => {
          if (!review.referral || !review.referral.name) {
            return null
          }

          return (
            <div className="w-full md:w-1/2" key={review.id}>
              <ReferralItem key={review.id} referral={review.referral}>
                <ReviewButton handleReview={handleReview} id={review.id} />
              </ReferralItem>
            </div>
          )
        })}
      </div>
    </section>
  )
}
