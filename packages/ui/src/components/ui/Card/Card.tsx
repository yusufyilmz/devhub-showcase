import React, { forwardRef, ReactNode } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  children: ReactNode
  tabIndex?: number
  className?: string
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ id, tabIndex = -1, children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        tabIndex={tabIndex}
        id={id}
        className={`bg-white rounded-lg shadow-md overflow-hidden w-full md:w-[90%] ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
