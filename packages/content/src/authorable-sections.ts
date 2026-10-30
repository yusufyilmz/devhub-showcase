/** Explicit, portable metadata; no component paths or executable configuration. */
export const authorableSections = {
  'about-hero': { name: 'About Hero', view: 'hero', sources: ['about'] },
  about: { name: 'About', view: 'about', sources: ['about'] },
  accordion: { name: 'Accordion', view: 'accordion', sources: [] },
  awards: { name: 'Awards', view: 'awards', sources: [] },
  'blog-page': { name: 'Blog Page', view: 'posts', sources: [] },
  cta: { name: 'CTA', view: 'cards', sources: [] },
  'calendar-link': { name: 'Calendar Link', view: 'links', sources: [] },
  careers: { name: 'Careers', view: 'careers', sources: [] },
  clients: { name: 'Clients', view: 'clients', sources: [] },
  'contact-form': { name: 'Contact Form', view: 'contact', sources: [] },
  'contact-info': { name: 'Contact Info', view: 'links', sources: [] },
  faq: { name: 'FAQ', view: 'accordion', sources: [] },
  features: {
    name: 'Features',
    view: 'cards',
    sources: ['projects', 'skills']
  },
  'gallery-grid': {
    name: 'Gallery Grid',
    view: 'gallery',
    sources: ['projects']
  },
  heading: { name: 'Heading', view: 'heading', sources: [] },
  hero: { name: 'Hero', view: 'hero', sources: [] },
  'how-to': { name: 'How To', view: 'steps', sources: [] },
  'legal-text': { name: 'Legal Text', view: 'text', sources: [] },
  map: { name: 'Map', view: 'map', sources: [] },
  menu: { name: 'Menu', view: 'menu', sources: [] },
  newsletter: { name: 'Newsletter', view: 'newsletter', sources: [] },
  plans: { name: 'Plans', view: 'pricing', sources: [] },
  'posts-grid': { name: 'Posts Grid', view: 'posts', sources: [] },
  pricing: { name: 'Pricing', view: 'pricing', sources: [] },
  profile: { name: 'Profile', view: 'profile', sources: [] },
  projects: { name: 'Projects', view: 'projects', sources: ['projects'] },
  property: { name: 'Property', view: 'property', sources: [] },
  quickstart: { name: 'Quickstart', view: 'steps', sources: [] },
  'shop-items': { name: 'Shop Items', view: 'shop', sources: [] },
  showcase: { name: 'Showcase', view: 'gallery', sources: ['projects'] },
  'social-links': { name: 'Social Links', view: 'links', sources: [] },
  stats: { name: 'Stats', view: 'statistics', sources: [] },
  studies: { name: 'Studies', view: 'timeline', sources: ['education'] },
  'table-of-contents': { name: 'Table Of Contents', view: 'toc', sources: [] },
  tabs: { name: 'Tabs', view: 'tabs', sources: [] },
  team: { name: 'Team', view: 'team', sources: [] },
  'technical-skills': {
    name: 'Technical Skills',
    view: 'skills',
    sources: ['skills']
  },
  testimonials: { name: 'Testimonials', view: 'quotes', sources: [] },
  text: { name: 'Text', view: 'text', sources: ['about'] },
  timeline: {
    name: 'Timeline',
    view: 'timeline',
    sources: ['experiences', 'education']
  },
  video: { name: 'Video', view: 'video', sources: [] },
  'work-experience': {
    name: 'Work Experience',
    view: 'timeline',
    sources: ['experiences']
  },
  custom: {
    name: 'Custom',
    view: 'list',
    sources: [
      'projects',
      'experiences',
      'skills',
      'education',
      'languages',
      'about'
    ]
  },
  services: { name: 'Services', view: 'cards', sources: [] },
  youtube: { name: 'YouTube', view: 'video', sources: [] },
  instagram: { name: 'Instagram', view: 'gallery', sources: [] },
  pinterest: { name: 'Pinterest', view: 'gallery', sources: [] }
} as const
export type AuthorableSectionType = keyof typeof authorableSections
export const authorableSectionTypes = [
  'about-hero',
  'about',
  'accordion',
  'awards',
  'blog-page',
  'cta',
  'calendar-link',
  'careers',
  'clients',
  'contact-form',
  'contact-info',
  'faq',
  'features',
  'gallery-grid',
  'heading',
  'hero',
  'how-to',
  'legal-text',
  'map',
  'menu',
  'newsletter',
  'plans',
  'posts-grid',
  'pricing',
  'profile',
  'projects',
  'property',
  'quickstart',
  'shop-items',
  'showcase',
  'social-links',
  'stats',
  'studies',
  'table-of-contents',
  'tabs',
  'team',
  'technical-skills',
  'testimonials',
  'text',
  'timeline',
  'video',
  'work-experience',
  'custom',
  'services',
  'youtube',
  'instagram',
  'pinterest'
] as const
export type SectionSourceField =
  | 'projects'
  | 'experiences'
  | 'education'
  | 'skills'
  | 'languages'
  | 'about'
export type SectionSource = {
  type: 'profile'
  field: SectionSourceField
  itemIds?: string[]
}
export type SectionOptions = {
  description?: string
  alignment?: 'left' | 'center' | 'right'
  columns?: 1 | 2 | 3 | 4
  email?: string
  actionUrl?: string
  latitude?: number
  longitude?: number
  mediaUrl?: string
  posterUrl?: string
}

export function getSectionRenderers(type: AuthorableSectionType) {
  if (type === 'custom')
    return [
      'list',
      'cards',
      'gallery',
      'masonry',
      'carousel',
      'accordion',
      'tabs',
      'timeline',
      'steps',
      'text'
    ] as const
  const view = authorableSections[type].view
  if (['contact', 'map', 'toc', 'hero', 'heading', 'newsletter'].includes(view))
    return ['list'] as const
  if (['gallery', 'clients'].includes(view))
    return ['gallery', 'masonry', 'carousel', 'cards'] as const
  if (view === 'timeline') return ['timeline', 'list', 'cards'] as const
  if (view === 'steps') return ['steps', 'list', 'cards'] as const
  if (view === 'accordion') return ['accordion', 'cards', 'list'] as const
  if (view === 'tabs') return ['tabs', 'accordion', 'list'] as const
  if (view === 'text') return ['text', 'list'] as const
  return ['cards', 'list', 'gallery', 'carousel', 'accordion', 'tabs'] as const
}
export const MAX_CUSTOM_SECTIONS = 60
