import React, { ReactNode } from 'react'
import { Button } from '../Button'

type AccordionHeaderProps = {
  isOpen: boolean
  onClick: () => void
  expandIcon?: ReactNode
  children?: ReactNode
  className?: string
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  children,
  isOpen,
  onClick,
  expandIcon,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      variant="text"
      className={`flex items-center flex-row justify-between w-full p-5 font-medium text-main-white border-b border-main-light-slate ${className}`}
      aria-expanded={isOpen}
      ari-label='accordion header'
    >
      {children}
      <span
        className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
      >
        {expandIcon}
      </span>
    </Button>
  )
}
