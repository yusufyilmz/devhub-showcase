'use client'

import { CircularProgress, Link } from '@mui/material'
import { useState, useEffect, useMemo } from 'react'

interface IFramePreviewProps {
  url: string
}

export const IFramePreview: React.FC<IFramePreviewProps> = ({ url }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [url])

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setError(true)
    setLoading(false)
  }

  const IFrame = useMemo(() => {
    return url ? (
      <iframe
        src={url ?? null}
        title="Website Preview"
        className={`w-full h-[600px] transition-opacity duration-500 opacity-100`}
        sandbox="allow-same-origin"
        onLoad={handleLoad}
        onError={handleError}
      />
    ) : null
  }, [url])

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden cursor-pointer relative">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <CircularProgress />
        </div>
      )}
      {!error ? (
        IFrame
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <p className="text-red-500">Unable to load the website preview.</p>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-main-blue hover:underline"
          >
            Click here to visit the website
          </Link>
        </div>
      )}
    </div>
  )
}
