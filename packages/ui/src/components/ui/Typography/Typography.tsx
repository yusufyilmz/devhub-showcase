import React from 'react'

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'

type TypographyProps = {
  variant?: Variant
  size?: Size
  className?: string
  component?: keyof JSX.IntrinsicElements
  children: React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const variantMapping: { [key in Variant]: keyof JSX.IntrinsicElements } = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span'
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  size,
  children,
  className = '',
  component,
  ...props
}) => {
  const Component = component || variantMapping[variant] || 'p'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const variantClasses: { [key in Variant]: string } = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-medium',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
    subtitle1: 'text-lg font-normal',
    subtitle2: 'text-base font-normal',
    body1: 'text-base font-normal',
    body2: 'text-sm font-normal',
    caption: 'text-xs font-light',
    overline: 'text-xs uppercase tracking-wide font-light'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sizeClasses: { [key in Size]: string } = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  }

  const appliedSizeClass = size ? sizeClasses[size] : variantClasses[variant]

  return (
    <Component {...props} className={`${appliedSizeClass} ${className}`}>
      {children}
    </Component>
  )
}

export default Typography
