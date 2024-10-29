'use client'

import { Button } from '@mui/material'
import { copy } from '@shared/content'
import { ReviewWithReferrals } from '@shared/lib/types'
import { useNotification } from '@shared/ui/hooks'

export const ReviewButton = ({
  handleApprove,
  id
}: {
  id: string
  handleApprove: (id: string) => Promise<ReviewWithReferrals | undefined>
}) => {
  const { setError, setInfo } = useNotification()
  const onApprove = async (id: string): Promise<void> => {
    try {
      const createdReferral = await handleApprove(id)

      setInfo(
        copy.notifications.success.referralApproved(
          createdReferral.referral?.name ?? ''
        )
      )
    } catch {
      setError(copy.notifications.errors.referralApproveError)
    }
  }

  return (
    <Button
      fullWidth
      color="primary"
      variant="contained"
      onClick={() => onApprove(id)}
    >
      Approve
    </Button>
  )
}
