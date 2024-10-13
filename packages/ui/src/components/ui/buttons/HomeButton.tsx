'use client'

import { Button } from '@mui/material'
import { copy } from '@shared/content'
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
      {copy.cta.home}
    </Button>
  )
}
