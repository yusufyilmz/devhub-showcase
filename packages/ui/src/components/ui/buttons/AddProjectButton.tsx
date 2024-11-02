'use client'

import { Button } from '@shared/ui/components'
import { useRouter } from 'next/navigation'

export const AddProjectButton = () => {
  const { push } = useRouter()

  return (
    <Button
      aria-label="Add project"
      variant="contained"
      onClick={() => push('/projects/add')}
    >
      Add Project
    </Button>
  )
}
