'use client'
import { createContext, useContext } from 'react'
export const ThemeContext = createContext({ mode: 'dark', toggle: () => {} })
export function ThemeToggle() {
  const { mode, toggle } = useContext(ThemeContext)
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
      onClick={toggle}
    >
      <span aria-hidden="true">{mode === 'dark' ? '☀' : '☾'}</span>
    </button>
  )
}
