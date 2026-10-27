'use client'

import { ThemeProvider as MTThemeProvider } from '@mui/material'
import type React from 'react'
import type { PropsWithChildren } from 'react'

export const ThemeProvider: React.FC<PropsWithChildren> = ({
  children
}: {
  children?: React.ReactNode
}) => {
  return <MTThemeProvider theme={{}}>{children}</MTThemeProvider>
}
