import type { ReactNode } from 'react'

interface CardBodyProps {
  title?: string
  children?: ReactNode
  className?: string
}

export function CardBody({ title, children, className }: CardBodyProps) {
  return (
    <div className={`p-4 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  )
}
