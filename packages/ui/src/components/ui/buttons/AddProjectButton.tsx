'use client'

import { Button } from '../../../components'
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
