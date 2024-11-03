import React, { ReactNode } from 'react'

interface ListItemProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <li
      className={`p-2 cursor-pointer transition duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </li>
  )
}
