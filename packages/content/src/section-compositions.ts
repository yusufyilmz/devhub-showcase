export const sectionCompositions = {
  custom: { name: 'Custom', title: 'New section', renderer: 'list' },
  services: { name: 'Services', title: 'Services', renderer: 'cards' },
  testimonials: {
    name: 'Testimonials',
    title: 'What people say',
    renderer: 'cards'
  },
  faq: {
    name: 'FAQs',
    title: 'Frequently asked questions',
    renderer: 'accordion'
  },
  statistics: {
    name: 'Statistics',
    title: 'By the numbers',
    renderer: 'cards'
  },
  cta: {
    name: 'Call to action',
    title: 'Let’s work together',
    renderer: 'cards'
  },
  youtube: {
    name: 'YouTube work',
    title: 'Films and videos',
    renderer: 'cards'
  },
  instagram: {
    name: 'Instagram work',
    title: 'Instagram work',
    renderer: 'cards'
  },
  pinterest: {
    name: 'Pinterest work',
    title: 'Pinterest work',
    renderer: 'cards'
  }
} as const
export type SectionComposition = keyof typeof sectionCompositions
export const sectionCompositionIds = [
  'custom',
  'services',
  'testimonials',
  'faq',
  'statistics',
  'cta',
  'youtube',
  'instagram',
  'pinterest'
] as const
export function getSocialWork(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password)
      return null
    const host = parsed.hostname.toLowerCase()
    let video: string | null = null
    if (host === 'youtu.be') video = parsed.pathname.split('/')[1] ?? null
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host))
      video =
        parsed.pathname === '/watch'
          ? parsed.searchParams.get('v')
          : (/^\/(shorts|embed|live)\/([^/]+)\/?$/.exec(parsed.pathname)?.[2] ??
            null)
    if (video && /^[a-zA-Z0-9_-]{11}$/.test(video))
      return { provider: 'youtube' as const, id: video }
    if (
      ['instagram.com', 'www.instagram.com'].includes(host) &&
      /^\/(p|reel|tv)\/[a-zA-Z0-9_-]+\/?$/.test(parsed.pathname)
    )
      return { provider: 'instagram' as const, id: parsed.pathname }
    if (
      ['pinterest.com', 'www.pinterest.com'].includes(host) &&
      /^\/pin\/[0-9]+\/?$/.test(parsed.pathname)
    )
      return { provider: 'pinterest' as const, id: parsed.pathname }
  } catch {
    /* Invalid drafts are never embedded. */
  }
  return null
}
