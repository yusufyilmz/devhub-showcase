'use client'

import { IconButton } from '.'

export { IconButton } from '@material-tailwind/react'

type IconButtonWithLinkProps = {
  href: string
  children: React.ReactNode
  label: string
  className?: string
}

export const IconButtonWithLink: React.FC<IconButtonWithLinkProps> = ({
  href,
  children,
  label,
  className
}) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <IconButton
        variant="text"
        aria-label={label}
        className={`icon-button ${className}`}
      >
        {children}
      </IconButton>
    </a>
  )
}
