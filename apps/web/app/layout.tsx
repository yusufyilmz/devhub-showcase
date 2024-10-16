import '@shared/ui/globals.css'
import { NotificationProvider } from '@shared/ui/context'
import { Footer, Header, Navbar, ThemeProvider } from '@shared/ui/components'
import { CssBaseline } from '@mui/material'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <CssBaseline />
          <NotificationProvider>
            <Navbar />
            <Header />
            <main className="w-full text-main-black  bg-gradient-to-b to-main-gray from-main-white flex flex-col justify-center items-center pt-16">
              {children}
            </main>
            <Footer />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
