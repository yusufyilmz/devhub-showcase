import React from 'react'

type IconButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  color?: string
  size?: string
  className?: string
  children: React.ReactNode
  ariaLabel?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  color = 'text-gray-600',
  size = 'w-6 h-6',
  className = '',
  children,
  ariaLabel,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full focus:outline-none ${color} ${className}`}
      aria-label={ariaLabel}
      type="button"
      {...props}
    >
      <div className={size}>{children}</div>
    </button>
  )
}

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
      <IconButton aria-label={label} className={`icon-button ${className}`}>
        {children}
      </IconButton>
    </a>
  )
}
