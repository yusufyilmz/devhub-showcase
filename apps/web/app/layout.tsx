import '@shared/ui/globals.css'
import { NotificationProvider } from '@shared/ui/context'
import { Footer, Header, ThemeProvider } from '@shared/ui/components'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { Poppins } from 'next/font/google'

const inter = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: '400'
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html className={inter.className} lang="en">
      <body>
        <StyledEngineProvider injectFirst>
          <ThemeProvider>
            <CssBaseline />
            <NotificationProvider>
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
