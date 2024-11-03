import React from 'react'

type FontSize = 'small' | 'medium' | 'large' | 'xlarge'

interface IconProps {
  d?: string
  className?: string
  fontSize?: FontSize
}

const sizeMap: Record<FontSize, string> = {
  small: '16px',
  medium: '24px',
  large: '32px',
  xlarge: '48px'
}

const Icon: React.FC<IconProps> = ({
  d,
  className = '',
  fontSize = 'medium'
}) => {
  const iconSize = sizeMap[fontSize]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-6 h-6 ${className}`}
      style={{ width: iconSize, height: iconSize }}
    >
      <path d={d} />
    </svg>
  )
}

// Icon Paths
const icons = {
  pdf: 'M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5zm4-3H19v1h1.5V11H19v2h-1.5V7h3zM9 9.5h1v-1H9zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4zm10 5.5h1v-3h-1z',
  close:
    'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  linkedin:
    'M22.23 0H1.77A1.77 1.77 0 0 0 0 1.77v20.46A1.77 1.77 0 0 0 1.77 24h20.46A1.77 1.77 0 0 0 24 22.23V1.77A1.77 1.77 0 0 0 22.23 0zM7.12 20.45H3.54V9.29h3.58v11.16zM5.33 7.77A2.1 2.1 0 1 1 5.32 3.58a2.1 2.1 0 0 1 .01 4.19zM20.45 20.45h-3.57v-5.58c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.97v5.68h-3.57V9.29h3.43v1.52h.05a3.76 3.76 0 0 1 3.39-1.86c3.62 0 4.29 2.38 4.29 5.48v6.02z',
  phone:
    'M6.62 10.79a15.91 15.91 0 0 0 6.59 6.59l2.2-2.2a1.003 1.003 0 0 1 1.16-.18c1.26.5 2.66.78 4.1.78a1 1 0 0 1 1 1v3.36c0 .55-.45 1-1 1A19.93 19.93 0 0 1 2 4c0-.55.45-1 1-1h3.35c.55 0 1 .45 1 1 0 1.45.28 2.84.78 4.1.16.38.07.81-.18 1.16l-2.2 2.2z',
  email:
    'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 14H4V8l8 5 8-5zm-8-7L4 6h16z',
  github:
    'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577V20.73c-3.338.73-4.042-1.613-4.042-1.613-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.084-.73.084-.73 1.205.085 1.837 1.237 1.837 1.237 1.07 1.832 2.808 1.303 3.492.996.108-.774.42-1.303.763-1.603-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.535-1.523.116-3.176 0 0 1.008-.322 3.301 1.23.96-.267 1.98-.4 3-.404 1.02.004 2.04.137 3 .403 2.29-1.553 3.296-1.23 3.296-1.23.652 1.653.242 2.873.118 3.176.77.84 1.236 1.91 1.236 3.222 0 4.61-2.805 5.625-5.475 5.92.43.37.823 1.102.823 2.222v3.292c0 .317.22.692.825.577C20.565 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z',
  send: 'M2.01 21l20.99-9L2.01 3v7l15 2-15 2z',
  chat: 'M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1m-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1',

  referral:
    'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m6 9.8a.9.9 0 0 1-.1.5l-2.1 4.9a1.34 1.34 0 0 1-1.3.8H9a2 2 0 0 1-2-2v-5a1.28 1.28 0 0 1 .4-1L12 5l.69.69a1.08 1.08 0 0 1 .3.7v.2L12.41 10H17a1 1 0 0 1 1 1z',
  externalLink:
    'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5',
  menu: 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z',
  arrowBack: 'M20 11H7.83l5.88-5.88L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  arrowForward: 'M4 11h12.17l-5.88-5.88L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z',
  info: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
  arrowDown: 'M7 10l5 5 5-5H7z'
}

export const PdfIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.pdf} />
)
export const CloseIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.close} />
)
export const LinkedInIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.linkedin} />
)
export const PhoneIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.phone} />
)
export const EmailIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.email} />
)
export const GitHubIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.github} />
)
export const SendIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.send} />
)
export const ChatIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.chat} />
)
export const ReferralIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.referral} />
)
export const ExternalLinkIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.externalLink} />
)
export const MenuIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.menu} />
)
export const ArrowBackIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.arrowBack} />
)
export const ArrowForwardIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.arrowForward} />
)
export const ArrowDownwardIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.arrowDown} />
)
export const InfoIcon: React.FC<IconProps> = props => (
  <Icon {...props} d={icons.info} />
)
