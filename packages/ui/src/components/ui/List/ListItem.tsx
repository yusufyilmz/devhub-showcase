import { ReactNode } from 'react'

interface ListItemProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export const ListItem = ({
  children,
  onClick,
  className = '',
  ...props
}: ListItemProps) => {
  return (
    <li
      className={`px-4 py-8 cursor-pointer transition duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </li>
  )
}
