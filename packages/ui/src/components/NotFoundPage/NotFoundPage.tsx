'use client'

import { Button } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const NotFoundPage = () => {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>

      <div className="flex gap-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.back()}
          sx={{ backgroundColor: '#1f1f1f', color: '#ffffff' }}
        >
          Go Back
        </Button>
        <Link href="/" passHref>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#333333', color: '#ffffff' }}
          >
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
