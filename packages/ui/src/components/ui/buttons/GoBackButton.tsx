'use client'

import { Button } from '@shared/ui/components'
import { useRouter } from 'next/navigation'
import { copy } from '@shared/content'

export const GoBackButton = () => {
  const router = useRouter()

  return (
    <Button
      aria-label="Go back"
      variant="outlined"
      onClick={() => router.back()}
      className="rounded-lg"
    >
      {copy.cta.goBack}
    </Button>
  )
}
