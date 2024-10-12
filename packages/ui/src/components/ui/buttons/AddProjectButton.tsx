'use client'

import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'

export const AddProjectButton = () => {
  const { push } = useRouter()

  return (
    <Button variant="contained" onClick={() => push('/projects/add')}>
      Add Project
    </Button>
  )
}
