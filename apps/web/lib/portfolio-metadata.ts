import type { PortfolioProfile } from '@shared/content'
import type { Metadata } from 'next'
import { portfolioUrl, siteUrl } from './site-url'

export function portfolioMetadata(
  profile: PortfolioProfile,
  username: string
): Metadata {
  const canonical = portfolioUrl(username)
  const title = `${profile.name} | ${profile.title}`
  const images = [
    { url: `${canonical}/share.png`, width: 1200, height: 630, alt: title }
  ]
  return {
    metadataBase: new URL(siteUrl),
    title,
    description: profile.summary,
    keywords: [
      profile.name,
      profile.title,
      'portfolio',
      'CV',
      ...Object.values(profile.skills).flat().slice(0, 20)
    ],
    alternates: { canonical },
    icons: {
      icon: [{ url: `${canonical}/icon.svg`, type: 'image/svg+xml' }],
      shortcut: `${canonical}/icon.svg`
    },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: profile.summary,
      url: canonical,
      type: 'profile',
      siteName: 'MyDevStudio',
      images,
      locale: { en: 'en_US', es: 'es_ES', tr: 'tr_TR' }[
        profile.portfolioLanguage ?? 'en'
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: profile.summary,
      images
    }
  }
}
