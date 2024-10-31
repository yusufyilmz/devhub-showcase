import '@shared/ui/globals.css'
import { NotificationProvider } from '@shared/ui/context'
import {
  Footer,
  Header,
  MouseCircle,
  ThemeProvider
} from '@shared/ui/components'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { Poppins } from 'next/font/google'
import type { Metadata } from 'next'
import { copy } from '@shared/content'

const inter = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: '400'
})

export const metadata: Metadata = copy.metadata

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html className={inter.className} lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(copy.structuredData)
          }}
          type="application/ld+json"
        />
      </head>
      <body>
        <StyledEngineProvider injectFirst>
          <ThemeProvider>
            <CssBaseline />
            <NotificationProvider>
              <MouseCircle />
              <Header />
              {children}
              <Footer />
            </NotificationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </body>
    </html>
  )
}
