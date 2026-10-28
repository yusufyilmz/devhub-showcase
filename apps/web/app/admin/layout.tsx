import { ThemeToggle } from '@shared/ui/theme'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Portfolio studio',
  robots: { index: false, follow: false }
}
export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-content">
        Skip to editor
      </a>
      <header className="admin-brand">
        <a href="/" className="brand-mark">
          Y<span>.</span>
        </a>
        <span>PORTFOLIO STUDIO</span>
        <ThemeToggle />
      </header>
      {children}
    </div>
  )
}
