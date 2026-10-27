import '@shared/ui/globals.css'
import { StyledEngineProvider } from '@mui/material'
import { copy } from '@shared/content'
import { Footer, Header, MouseCircle } from '@shared/ui/components'
import { NotificationProvider } from '@shared/ui/context'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = copy.metadata

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD uses trusted versioned content and escapes HTML.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(copy.structuredData).replace(/</g, '\u003c')
          }}
          type="application/ld+json"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledEngineProvider injectFirst>
          <NotificationProvider>
            <MouseCircle />
            <Header />
            {children}
            <Footer />
          </NotificationProvider>
        </StyledEngineProvider>
      </body>
    </html>
  )
}
