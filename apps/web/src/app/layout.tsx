import '@shared/ui/globals.css'
import { NotificationProvider } from '@shared/ui/context'
import { Footer, Header, Navbar, ThemeProvider } from '@shared/ui/components'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <NotificationProvider>
            <div className="px-page-px bg-main-black text-main-white">
              <Navbar />
            </div>
            <div className="px-page-px bg-main-black text-main-white">
              <Header />
            </div>
            <main className="px-page-px w-full text-main-black  bg-gradient-to-b to-main-gray from-main-white flex flex-col justify-center items-center pt-16">
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
