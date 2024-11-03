'use client'

import React, { PropsWithChildren } from 'react'

import { ThemeProvider as MTThemeProvider } from '@mui/material'

// eslint-disable-next-line @typescript-eslint/ban-types
export const ThemeProvider: React.FC<PropsWithChildren<{}>> = ({
  children
}: {
  children?: React.ReactNode
}) => {
  return <MTThemeProvider theme={{}}>{children}</MTThemeProvider>
}
