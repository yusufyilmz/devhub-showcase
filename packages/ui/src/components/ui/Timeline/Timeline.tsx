import React, { ReactNode } from 'react'

type TimelineProps = {
  children: ReactNode
  className?: string
}

type TimelineItemProps = {
  children: ReactNode
  className?: string
}

type TimelineHeaderProps = {
  children: ReactNode
  className?: string
}

type TimelineIconProps = {
  color?: string
  className?: string
}

type TimelineConnectorProps = {
  color?: string
  className?: string
}

type TimelineBodyProps = {
  children: ReactNode
  className?: string
}

export const Timeline: React.FC<TimelineProps> = ({
  children,
  className = ''
}) => {
  return (
    <ol
      className={`relative border-l border-gray-200 dark:border-gray-700 pl-3 md:pl-6 ${className}`}
    >
      {children}
    </ol>
  )
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  children,
  className = ''
}) => {
  return <li className={`mb-10 ${className}`}>{children}</li>
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  children,
  className = ''
}) => {
  return <div className={`flex items-center ${className}`}>{children}</div>
}

export const TimelineIcon: React.FC<TimelineIconProps> = ({
  color = 'bg-gray-200 dark:bg-gray-700 border border-white dark:border-gray-900',
  className = ''
}) => {
  return (
    <div
      className={`absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 ${color} ${className}`}
    />
  )
}

export const TimelineConnector: React.FC<TimelineConnectorProps> = ({
  color = 'bg-gray-200 dark:bg-gray-700',
  className = ''
}) => {
  return <div className={`absolute w-0.5 h-full ${color} ${className}`} />
}

export const TimelineBody: React.FC<TimelineBodyProps> = ({
  children,
  className = ''
}) => {
  return <div className={`my-4 ml-1 ${className}`}>{children}</div>
}
