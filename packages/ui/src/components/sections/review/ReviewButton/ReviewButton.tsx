'use client'

import { Box, Button } from '@mui/material'
import { copy } from '@shared/content'
import { ReviewState, ReviewWithReferrals } from '@shared/lib/types'
import { useNotification } from '@shared/ui/hooks'
import { useRouter } from 'next/navigation'

export const ReviewButton = ({
  handleReview,
  id
}: {
  id: string
  handleReview: (
    id: string,
    status: ReviewState
  ) => Promise<ReviewWithReferrals | undefined>
}) => {
  const { setError, setInfo } = useNotification()
  const router = useRouter()
  const onReview = async (id: string, status: ReviewState): Promise<void> => {
    try {
      const createdReferral = await handleReview(id, status)

      if (createdReferral === undefined) {
        throw new Error('Error approving referral')
      }

      setInfo(
        copy.notifications.success.referralApproved(
          createdReferral.referral?.name ?? ''
        )
      )

      router.replace('/reviews')
    } catch (e) {
      console.log(e)
      setError(copy.notifications.errors.referralApproveError)
    }
  }

  return (
    <Box className="flex w-full gap-4">
      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={() => onReview(id, ReviewState.REJECTED)}
      >
        Reject
      </Button>
      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={() => onReview(id, ReviewState.APPROVED)}
      >
        Approve
      </Button>
    </Box>
  )
}
