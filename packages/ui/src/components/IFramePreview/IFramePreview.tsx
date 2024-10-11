// 'use client'

import { CircularProgress, Link } from '@mui/material'
import { useState, useEffect } from 'react'

interface IFramePreviewProps {
  url: string
}

export const IFramePreview: React.FC<IFramePreviewProps> = ({ url }) => {
  // const [iframeLoaded, setIframeLoaded] = useState(false)

  // useEffect(() => {
  //   setIframeLoaded(false)
  // }, [url])

  // const handleIframeLoad = () => {
  //   setIframeLoaded(true)
  // }

  const handleCardClick = () => {
    window.open(url, '_blank')
  }

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden cursor-pointer">
      {/* {!iframeLoaded && (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      )} */}
      <iframe
        src={url}
        title="Website Preview"
        className={`w-full h-[600px] transition-opacity duration-500`}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
}
