'use client'

import '@shared/ui/globals.css'
import { NotificationProvider } from '@shared/ui/context'
import { Footer, Header, Navbar } from '@shared/ui/components'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'

import { theme } from '@shared/ui/themes'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <NotificationProvider>
            <CssBaseline />
            <div className="px-page-px bg-main-black text-main-white">
              <Navbar />
            </div>
            <div className="px-page-px bg-main-black text-main-white">
              <Header />
            </div>
            <main className="px-page-px w-full min-h-screen  text-main-black  bg-gradient-to-b to-main-gray from-main-white flex flex-col  justify-center items-center py-16">
              {children}
            </main>
            <div className="w-full px-page-px bg-main-black text-main-white">
              <Footer />
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
