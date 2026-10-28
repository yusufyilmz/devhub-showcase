import { ThemeToggle } from '@shared/ui/theme'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'CV studio',
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
          CV<span>.</span>
        </a>
        <span>CV STUDIO</span>
        <ThemeToggle />
      </header>
      {children}
    </div>
  )
}
