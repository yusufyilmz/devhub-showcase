'use client'

import { Button } from '../../../../components'
import { copy } from '@shared/content'
import { ReviewState, ReviewWithReferrals } from '@shared/lib/types'
import { useNotification } from '../../../../hooks'
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

      let notifier

      if (status === ReviewState.APPROVED) {
        notifier = copy.notifications.success.referralApproved
      } else if (status === ReviewState.REJECTED) {
        notifier = copy.notifications.success.referralRejected
      }

      if (notifier) {
        setInfo(notifier(createdReferral.referral?.name ?? ''))
      }

      router.refresh()
    } catch (e) {
      setError(copy.notifications.errors.referralApproveError)
    }
  }

  return (
    <div className="flex w-full gap-4">
      <Button
        aria-label="Reject"
        fullWidth
        variant="outlined"
        onClick={() => onReview(id, ReviewState.REJECTED)}
      >
        Reject
      </Button>
      <Button
        fullWidth
        aria-label="Approve"
        variant="outlined"
        onClick={() => onReview(id, ReviewState.APPROVED)}
      >
        Approve
      </Button>
    </div>
  )
}
