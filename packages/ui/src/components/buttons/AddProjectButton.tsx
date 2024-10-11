import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'

export const AddProjectButton = () => {
  const { push } = useRouter()

  return (
    <Button
      variant="contained"
      onClick={() => push('/projects/add')}
      sx={{
        backgroundColor: '#0071E3',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#005BB5'
        },
        borderRadius: '8px',
        padding: '10px 20px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      Add Project
    </Button>
  )
}
