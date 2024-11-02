interface ButtonProps {
  children: React.ReactNode
  variant?:
    | 'contained'
    | 'text'
    | 'outlined'
    | 'primary'
    | 'secondary'
    | 'disabled'
  onClick?: () => void
  fullWidth?: boolean
  className?: string
  href?: string
  target?: string
  rel?: string
  endIcon?: React.ReactNode
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained', // Default to contained
  onClick,
  fullWidth = false,
  className = '',
  href,
  target,
  rel,
  endIcon,
  disabled
}) => {
  const baseStyles = `px-4 py-2 rounded-md font-semibold focus:outline-none transition ease-in-out duration-300`

  // Variants based on the selected option
  const variants = {
    contained: `bg-main-primary hover:bg-backgroundColor-buttonHover text-textColor-white`,
    text: `bg-transparent text-main-lightSlate hover:bg-main-dark-hover`,
    outlined: `border border-borderColor-button text-backgroundColor-button hover:bg-main-dark-hover`,
    primary: `bg-main-primary hover:bg-backgroundColor-buttonHover text-textColor-white`,
    secondary: `bg-main-secondary hover:bg-main-dark-slate text-textColor-white`,
    disabled: `bg-backgroundColor-gray text-textColor-slate cursor-not-allowed`
  }

  const widthStyle = fullWidth ? `w-full` : ``
  const buttonStyles = `${baseStyles} ${disabled ? variants.disabled : variants[variant]} ${widthStyle} hover:scale-105 shine-effect ${className}`

  const Component = href ? 'a' : 'button'

  return (
    <Component
      className={buttonStyles}
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      disabled={disabled}
      aria-label="View my Resume"
    >
      <span>{children}</span>
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </Component>
  )
}

export { Button }
