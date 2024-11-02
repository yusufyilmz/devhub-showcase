'use client'

import { Button } from '@shared/ui/components'
import { copy } from '@shared/content'
import { useRouter } from 'next/navigation'

export const HomeButton = () => {
  const { replace } = useRouter()

  return (
    <Button
      aria-label="Go to home"
      variant="outlined"
      className="rounded-lg"
      onClick={() => replace('/')}
    >
      {copy.cta.home}
    </Button>
  )
}
