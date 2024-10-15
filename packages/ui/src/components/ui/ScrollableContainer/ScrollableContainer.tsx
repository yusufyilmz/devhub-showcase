'use client'

import { Grid } from '@mui/material'
import { useRef, useState } from 'react'

interface ScrollableContainerProps {
  children: React.ReactNode
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
      handleScroll()
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
      handleScroll()
    }
  }

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current!
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth)
  }

  return (
    <Grid className="relative w-full align scrollbar-hide overflow-hidden">
      {showLeftArrow && (
        <button

          onClick={scrollLeft}
          className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
        >
          ◀
        </button>
      )}
      <div
        className="w-full gap-8 no-scrollbar flex flex-row overflow-x-auto scrollbar-hide whitespace-nowrap p-4 max-w-full"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {children}
      </div>
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
        >
          ▶
        </button>
      )}
    </Grid>
  )
}
