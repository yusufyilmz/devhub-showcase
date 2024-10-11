/* eslint-disable no-unused-vars */
'use client'

import { createContext, useCallback, useState, useContext } from 'react'
import { Snackbar, Alert } from '@mui/material'

export interface NotificationContextProps {
  setError: (message: string) => void
  setSuccess: (message: string) => void
  setInfo: (message: string) => void
}

export const NotificationContext = createContext<
  NotificationContextProps | undefined
>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [notification, setNotification] = useState({
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
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
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
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
