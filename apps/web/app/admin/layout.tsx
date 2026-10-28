import { StudioShell } from '@shared/components/studio-shell'
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
    <StudioShell
      brand={
        <>
          CV<span>.</span>
        </>
      }
      title="PORTFOLIO STUDIO"
      contentId="admin-content"
      tools={<ThemeToggle />}
    >
      {children}
    </StudioShell>
  )
}
