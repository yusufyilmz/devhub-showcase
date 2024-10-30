'use client'

import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { copy } from '@shared/content'

export const GoBackButton = () => {
  const router = useRouter()

  return (
    <Button
      aria-label="Go back"
      variant="contained"
      color="primary"
      onClick={() => router.back()}
      className="rounded-lg"
    >
      {copy.cta.goBack}
    </Button>
  )
}
