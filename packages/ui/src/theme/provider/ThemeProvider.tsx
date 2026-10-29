'use client'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material'
import { getThemePalette, type PortfolioTheme } from '@shared/content'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../theme-toggle'

const rgb = (value: string) => `rgb(${value.replaceAll(' ', ', ')})`
export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  accent = 'cyan',
  storageKey = 'devhub-theme',
  portfolioTheme = 'studio'
}: {
  children: ReactNode
  defaultTheme?: 'dark' | 'light' | 'system'
  accent?: 'cyan' | 'violet' | 'emerald'
  storageKey?: string
  portfolioTheme?: PortfolioTheme
}) {
  const [mode, setMode] = useState(defaultTheme === 'light' ? 'light' : 'dark')
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      let preference = defaultTheme
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved === 'dark' || saved === 'light') preference = saved
      } catch {}
      const next =
        preference === 'system'
          ? media.matches
            ? 'dark'
            : 'light'
          : preference
      document.documentElement.dataset.theme = next
      setMode(next)
    }
    sync()
    media.addEventListener('change', sync)
    window.addEventListener('storage', sync)
    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [defaultTheme, storageKey])
  const context = useMemo(
    () => ({
      mode,
      toggle: () => {
        const next = mode === 'dark' ? 'light' : 'dark'
        document.documentElement.dataset.theme = next
        setMode(next)
        try {
          localStorage.setItem(storageKey, next)
        } catch {}
      }
    }),
    [mode, storageKey]
  )
  const palette = getThemePalette(
    portfolioTheme,
    mode === 'dark' ? 'dark' : 'light'
  )
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode === 'dark' ? 'dark' : 'light',
          background: { default: rgb(palette.bg), paper: rgb(palette.surface) },
          text: { primary: rgb(palette.text), secondary: rgb(palette.muted) },
          primary: {
            main:
              accent === 'violet'
                ? '#9b83f5'
                : accent === 'emerald'
                  ? '#20b899'
                  : '#2b9fb8'
          }
        },
        typography: { fontFamily: 'var(--font-geist-sans), sans-serif' }
      }),
    [mode, accent, palette]
  )
  return (
    <ThemeContext.Provider value={context}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}
