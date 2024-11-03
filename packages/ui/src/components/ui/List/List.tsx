import React, { ReactNode } from 'react'

type ListProps = {
  children: ReactNode
  className?: string
  divider?: boolean
}

export const List: React.FC<ListProps> = ({
  children,
  className = '',
  divider = false
}) => {
  return (
    <ul
      className={`overflow-y-auto overflow-x-hidden pl-2 rounded-lg shadow-md ${divider ? 'divide-y divide-gray-200' : ''} ${className}`}
    >
      {children}
    </ul>
  )
}
