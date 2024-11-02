import '@shared/ui/globals.css'
import { NotificationProvider } from '@shared/ui/context'
import { Footer, Header, MouseCircle } from '@shared/ui/components'
import type { Metadata } from 'next'
import { copy } from '@shared/content'
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
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(copy.structuredData)
          }}
          type="application/ld+json"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {' '}
        <NotificationProvider>
          <MouseCircle />
          <Header />
          {children}
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  )
}
