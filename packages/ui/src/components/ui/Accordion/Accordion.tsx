import React, { ReactNode } from 'react'

type AccordionProps = {
  children: ReactNode
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  className = ''
}) => {
  return <div className={`accordion ${className}`}>{children}</div>
}
