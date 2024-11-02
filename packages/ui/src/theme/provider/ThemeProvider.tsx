'use client'

import { ThemeProvider as MTThemeProvider } from '@material-tailwind/react'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <MTThemeProvider>{children}</MTThemeProvider>
}
