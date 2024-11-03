'use client'

import React from 'react'
import { CVCategoryType } from '@shared/lib/types'
import { useEffect, useRef, useState } from 'react'
import { CARD_IDS } from '../../../constants/cards'
import { ArrowForwardIcon, ArrowBackIcon } from '../../../components'
import { IconButton } from '../IconButton'

interface ScrollableContainerProps {
  children: React.ReactNode
  category: CVCategoryType
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  category
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [containerHeight, setContainerHeight] = useState(0)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const offset =
        (document.getElementById(CARD_IDS[category])?.offsetWidth ?? 300) + 32
      scrollContainerRef.current.scrollBy({ left: -offset, behavior: 'smooth' })
      handleScroll()
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const offset =
        (document.getElementById(CARD_IDS[category])?.offsetWidth ?? 300) + 32

      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' })
      handleScroll()
    }
  }

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current!
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth)
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      setContainerHeight(scrollContainerRef.current.clientHeight)
    }
  }, [children])

  return (
    <div className="relative flex align-top scrollbar-hide overflow-hidden">
      {showLeftArrow && (
        <div
          style={{ top: `${containerHeight / 2}px` }}
          className="absolute z-10 left-0 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
        >
          <IconButton aria-label="Scroll left" onClick={scrollLeft}>
            <ArrowBackIcon />
          </IconButton>
        </div>
      )}
      <div
        className="w-full gap-8 no-scrollbar flex flex-row justify-start overflow-x-auto scrollbar-hide whitespace-nowrap p-4 max-w-full"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {children}
      </div>
      {showRightArrow && (
        <div
          style={{ top: `${containerHeight / 2}px` }}
          className="absolute z-10 right-0 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
        >
          <IconButton aria-label="Scroll right" onClick={scrollRight}>
            <ArrowForwardIcon />
          </IconButton>
        </div>
      )}
    </div>
  )
}
