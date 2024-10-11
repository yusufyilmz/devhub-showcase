'use client'

import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'

export const ErrorPage = () => {
  const router = useRouter()

  return (
    <div className="flex-col h-screen bg-gray-200 flex justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Internal Server Error</h1>
      <p className="text-lg text-gray-600 mb-6">
        Something went wrong. Please try again later.
      </p>

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push('/')}
        sx={{ backgroundColor: '#1f1f1f', color: '#ffffff' }}
      >
        Go Home
      </Button>
    </div>
  )
}
