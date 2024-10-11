import { CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'

interface IFramePreviewProps {
  url: string
}

export const IFramePreview: React.FC<IFramePreviewProps> = ({ url }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    setIframeLoaded(false)
  }, [url])

  const handleIframeLoad = () => {
    setIframeLoaded(true)
  }

  const handleCardClick = () => {
    window.open(url, '_blank')
  }

  return (
    <div
      className="border rounded-lg shadow-lg overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {!iframeLoaded && (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      )}
      <iframe
        src={url}
        title="Website Preview"
        className={`w-full h-96 transition-opacity duration-500 ${
          iframeLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleIframeLoad}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
}
