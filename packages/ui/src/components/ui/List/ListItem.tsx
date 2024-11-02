import React, { ReactNode } from 'react'

interface ListItemProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export const ListItem = ({
  children,
  onClick,
  className = ''
}: ListItemProps) => {
  return (
    <li
      className={`px-4 py-8 cursor-pointer transition duration-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </li>
  )
}
