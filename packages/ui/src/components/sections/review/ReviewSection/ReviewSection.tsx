'use client'

import { Box, Typography, Grid } from '@mui/material'
import { ReviewWithReferrals } from '@shared/lib/types'
import { ReferralItem } from '../../referral/ReferralItem'
import { ReviewButton } from '../ReviewButton/ReviewButton'

type ReviewSectionProps = {
  reviews: ReviewWithReferrals[]
  handleApprove: (reviewId: string) => Promise<ReviewWithReferrals | undefined>
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  handleApprove
}) => {
  return (
    <Box
      className="max-w-[100vw]"
      sx={{ flexDirection: 'column', display: 'flex', gap: 8 }}
    >
      <Typography variant="h2">Pending Reviews</Typography>
      <Grid container spacing={2}>
        {reviews.map(review => {
          if (!review.referral || !review.referral.name) {
            return null
          }

          return (
            <Grid key={review.id}>
              <ReferralItem referral={review.referral}>
                <ReviewButton handleApprove={handleApprove} id={review.id} />
              </ReferralItem>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
