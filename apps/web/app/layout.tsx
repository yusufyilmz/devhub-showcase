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

const inter = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: '400'
})

export const metadata: Metadata = {
  title: "Yusuf's devhub showcase",
  description:
    'Explore my portfolio, professional experience, and AI-powered chat to learn more about my skills and projects'
}

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
