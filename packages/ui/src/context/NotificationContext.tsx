/* eslint-disable no-unused-vars */
'use client'

import { createContext, useCallback, useState, useContext } from 'react'
import { Alert, Typography, AlertProps } from '@shared/ui/components'

export interface NotificationContextProps {
  setError: (message: string) => void
  setSuccess: (message: string) => void
  setInfo: (message: string) => void
}

type AlertTypes = 'success' | 'error' | 'warning' | 'info'

const COLORS: Record<AlertTypes, AlertProps['color']> = {
  error: 'red',
  success: 'green',
  warning: 'yellow',
  info: 'blue'
}

export const NotificationContext = createContext<
  NotificationContextProps | undefined
>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [notification, setNotification] = useState({
    message: '',
    severity: 'success' as AlertTypes,
    open: false
  })

  const setError = useCallback((message: string) => {
    setNotification({ message, severity: 'error', open: true })
  }, [])

  const setSuccess = useCallback((message: string) => {
    setNotification({ message, severity: 'success', open: true })
  }, [])

  const setInfo = useCallback((message: string) => {
    setNotification({ message, severity: 'info', open: true })
  }, [])

  const handleClose = () => {
    setNotification(prev => ({ ...prev, open: false }))
  }

  return (
    <NotificationContext.Provider value={{ setError, setSuccess, setInfo }}>
      {children}
      {notification.open && (
        <Alert
          color={COLORS[notification.severity]}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-xs shadow-lg"
          onClose={handleClose}
          animate={{
            mount: { opacity: 1, y: 0 },
            unmount: { opacity: 0, y: 50 }
          }}
        >
          <Typography variant="small" className="text-white">
            {notification.message}
          </Typography>
        </Alert>
      )}
    </NotificationContext.Provider>
  )
}

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context
}
