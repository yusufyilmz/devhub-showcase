'use client'

import { useEffect, useState } from 'react'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Box from '@mui/material/Box'

type ScrollButtonProps = {
  sectionIds: string[]
}

export const ScrollButton: React.FC<ScrollButtonProps> = ({ sectionIds }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollToNextSection = () => {
    const nextIndex = currentIndex + 1

    if (nextIndex < sectionIds.length && sectionIds[nextIndex]) {
      const nextSection = document.getElementById(sectionIds[nextIndex])
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' })
        setCurrentIndex(nextIndex)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      for (let i = 0; i < sectionIds.length; i++) {
        const section = document.getElementById(sectionIds[i] as string)
        if (section) {
          const rect = section.getBoundingClientRect()
          const top = rect.top
          const bottom = rect.bottom
          const windowHeight = window.innerHeight

          if (top <= windowHeight / 2 && bottom >= windowHeight / 2) {
            setCurrentIndex(i)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sectionIds])

  if (currentIndex === sectionIds.length - 1) return null

  return (
    <Box className="fixed bottom-4 inset-x-0 flex justify-center animate-bounce">
      <button
        onClick={scrollToNextSection}
        className="flex items-center justify-center w-12 px-6 py-3 rounded-full bg-button-primary text-white transition duration-300 hover:scale-105"
        aria-label="Scroll to next section"
      >
        <ArrowDownwardIcon />
      </button>
    </Box>
  )
}