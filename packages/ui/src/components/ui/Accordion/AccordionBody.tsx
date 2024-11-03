import { ReactNode } from 'react'

type AccordionBodyProps = {
  isOpen: boolean
  children: ReactNode
  className?: string
}

export const AccordionBody: React.FC<AccordionBodyProps> = ({
  isOpen,
  children,
  className = ''
}) => {
  return (
    <div className={`${isOpen ? 'block' : 'hidden'} p-5 ${className}`}>
      {children}
    </div>
  )
}
