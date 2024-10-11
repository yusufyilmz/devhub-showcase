
'use client'

import { ThemeProvider as MaterialUiThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '../../theme/theme'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MaterialUiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MaterialUiThemeProvider>
  )
}