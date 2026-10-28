import '@shared/ui/globals.css'
import { StyledEngineProvider } from '@mui/material'
import { copy } from '@shared/content'
import { NotificationProvider } from '@shared/ui/context'
import { ThemeProvider } from '@shared/ui/theme'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { getPublishedProfile } from '../lib/published-profile'

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
  const { profile } = await getPublishedProfile()
  return {
    ...copy.metadata,
    metadataBase: new URL(profile.website),
    title: `${profile.name} | ${profile.title}`,
    description: profile.summary,
    alternates: { canonical: profile.website },
    openGraph: {
      ...copy.metadata.openGraph,
      url: profile.website,
      title: `${profile.name} | ${profile.title}`,
      description: profile.summary
    },
    twitter: {
      ...copy.metadata.twitter,
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
  const { profile } = await getPublishedProfile()
  const appearance = profile.appearance ?? {
    accent: 'cyan',
    defaultTheme: 'dark'
  }
  const structuredData = {
    ...copy.structuredData,
    name: profile.name,
    url: profile.website,
    jobTitle: profile.title,
    description: profile.summary,
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: Object.values(profile.skills).flat(),
    alumniOf: profile.education.map((item) => ({
      '@type': 'CollegeOrUniversity',
      name: item.institution
    })),
    worksFor: profile.experiences.find((item) => !item.end)
      ? {
          '@type': 'Organization',
          name: profile.experiences.find((item) => !item.end)?.company
        }
      : undefined
  }
  const themeScript = `(function(){try{var s=localStorage.getItem('devhub-theme');var d=${JSON.stringify(appearance.defaultTheme)};var t=s==='light'||s==='dark'?s:d==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):d;document.documentElement.dataset.theme=t}catch(e){}})()`
  return (
    <html
      lang="en"
      data-theme={appearance.defaultTheme === 'light' ? 'light' : 'dark'}
      data-accent={appearance.accent}
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Script contains only a validated enum; applies theme before paint.
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Serialized profile is validated and HTML characters are escaped.
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
