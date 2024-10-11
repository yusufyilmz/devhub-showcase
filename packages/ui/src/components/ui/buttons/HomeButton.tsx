'use client'

import { Button } from '@mui/material'
import { siteCopy } from '@shared/content'
import { useRouter } from 'next/navigation'

export const HomeButton = () => {
  const { replace } = useRouter()

  return (
    <Button
      variant="contained"
      color="primary"
      className="rounded-lg"
      onClick={() => replace('/')}
    >
      {siteCopy.cta.home}
    </Button>
  )
}
