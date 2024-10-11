'use client'

import '@shared/ui/globals.css'
import { NotificationProvider } from '@shared/ui/context'
import { Footer, Header, Navbar } from '@shared/ui/components'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <div className="px-page-px bg-main-black text-main-white">
            <Navbar />
          </div>
          <div className="px-page-px bg-main-black text-main-white">
            <Header />
          </div>
          <div className="px-page-px min-h-screen  text-main-black  bg-gradient-to-b to-main-gray from-main-white">
            <main className="flex flex-col  justify-center items-center py-16">
              {children}
            </main>
          </div>
          <div className="px-page-px bg-main-black text-main-white">
            <Footer />
          </div>
        </NotificationProvider>
      </body>
    </html>
  )
}
