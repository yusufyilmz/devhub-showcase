import '@shared/ui/globals.css'
import '../features/portfolio/themes.css'
import '../features/portfolio/portfolio.css'
import { StyledEngineProvider } from '@mui/material'
import { copy } from '@shared/content'
import { NotificationProvider } from '@shared/ui/context'
import { ThemeProvider } from '@shared/ui/theme'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import { getActiveProfile } from '../lib/active-profile'
import { getPagePresentation } from '../lib/page-presentation'
import { isPlatformPage, platformMetadata } from '../lib/platform'
import { getPublicThemeStyle } from '../lib/portfolio-theme'
import { getProfileStructuredData } from '../lib/profile-structured-data'

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

export async function generateMetadata(): Promise<Metadata> {
  if (await isPlatformPage()) return platformMetadata
  const snapshot = await getActiveProfile()
  if (!snapshot) return platformMetadata
  const { profile } = snapshot
  return {
    ...copy.metadata,
    keywords: [
      profile.name,
      profile.title,
      'CV',
      'portfolio',
      ...Object.values(profile.skills).flat().slice(0, 20)
    ],
    icons: { icon: '/cv-icon.svg' },
    metadataBase: new URL(
      profile.website ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        'https://yusufdevhub.vercel.app'
    ),
    title: `${profile.name} | ${profile.title}`,
    description: profile.summary,
    alternates: { canonical: profile.website },
    openGraph: {
      url: profile.website,
      title: `${profile.name} | ${profile.title}`,
      description: profile.summary
    },
    twitter: {
      card: 'summary',
      title: `${profile.name} | ${profile.title}`,
      description: profile.summary
    }
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const platform = await isPlatformPage()
  const snapshot = platform ? null : await getActiveProfile()
  const path = (await headers()).get('x-profile-path') ?? '/'
  const {
    profile,
    documentLanguage,
    storageKey,
    appearance,
    portfolioTheme,
    example
  } = getPagePresentation(path, platform, snapshot)
  const structuredData = getProfileStructuredData(example ? undefined : profile)
  const themeScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(storageKey)});var d=${JSON.stringify(appearance.defaultTheme)};var t=s==='light'||s==='dark'?s:d==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):d;document.documentElement.dataset.theme=t}catch(e){}})()`
  return (
    <html
      lang={documentLanguage}
      data-theme={appearance.defaultTheme === 'light' ? 'light' : 'dark'}
      data-accent={appearance.accent}
      data-portfolio-theme={portfolioTheme}
      style={getPublicThemeStyle(portfolioTheme, appearance.accent)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c')
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledEngineProvider injectFirst>
          <ThemeProvider
            storageKey={storageKey}
            portfolioTheme={portfolioTheme}
            defaultTheme={appearance.defaultTheme}
            accent={appearance.accent}
          >
            <NotificationProvider>{children}</NotificationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </body>
    </html>
  )
}
