import React, { ReactNode } from 'react'

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
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between w-full p-5 font-medium text-main-white border-b border-main-light-slate ${className}`}
      aria-expanded={isOpen}
    >
      {children}
      <span
        className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
      >
        {expandIcon}
      </span>
    </button>
  )
}
