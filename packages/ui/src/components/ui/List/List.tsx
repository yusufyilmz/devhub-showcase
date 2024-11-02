import { ReactNode } from 'react'

interface ListProps {
  children: ReactNode
  className?: string
  divider?: boolean
}

export const List = ({
  children,
  className = '',
  divider = false
}: ListProps) => {
  return (
    <ul
      className={`overflow-y-auto overflow-x-hidden pl-2 rounded-lg shadow-md ${divider ? 'divide-y divide-gray-200' : ''} ${className}`}
    >
      {children}
    </ul>
  )
}
