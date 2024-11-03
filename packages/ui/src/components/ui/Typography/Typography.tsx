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

type TypographyProps = {
  variant?: Variant
  className?: string
  component?: keyof JSX.IntrinsicElements
  children: React.ReactNode // Ensure children can accept ReactNode
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

  return (
    <Component {...props} className={`${variantClasses[variant]} ${className}`}>
      {children}
    </Component>
  )
}

export default Typography
