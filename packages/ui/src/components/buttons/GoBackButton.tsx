'use client'

import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { siteCopy } from '@shared/content'

export const GoBackButton = () => {
  const router = useRouter()

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => router.back()}
      className="rounded-lg"
    >
      {siteCopy.cta.goBack}
    </Button>
  )
}
