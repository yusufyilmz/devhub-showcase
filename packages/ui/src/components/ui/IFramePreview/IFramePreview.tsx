'use client'

import React from 'react'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { Spinner } from '../Spinner'

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
      <div className="overflow-y-auto" onClick={() => window.open(url)}>
        <iframe
          id="iframe"
          src={url ?? null}
          title="Website Preview"
          sandbox="allow-scripts"
          className="w-full h-[100vh] transition-opacity duration-500 opacity-100 pointer-events-none"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    ) : null
  }, [url])

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden cursor-pointer relative">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Spinner />
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
