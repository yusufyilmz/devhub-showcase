export const portfolioTypes = [
  {
    id: 'engineer',
    name: 'Engineer',
    description: 'A detailed career timeline, technical skills and projects.',
    audience: 'Software engineers and technical specialists',
    cvLayout: 'classic'
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'A bold introduction and a visual gallery of selected work.',
    audience: 'Designers, photographers and visual creators',
    cvLayout: 'editorial'
  },
  {
    id: 'consultant',
    name: 'Consultant',
    description:
      'A personal introduction alongside experience and client work.',
    audience: 'Consultants, freelancers and business professionals',
    cvLayout: 'classic'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description:
      'A quiet, single column page that lets your story do the talking.',
    audience: 'Writers, researchers and anyone who prefers simplicity',
    cvLayout: 'compact'
  }
] as const
export type PortfolioType = (typeof portfolioTypes)[number]['id']
export const cvLayouts = [
  { id: 'classic', name: 'Classic', description: 'The original balanced CV.' },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'A larger name and generous spacing.'
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Tighter spacing for a longer career.'
  }
] as const
export type CvLayout = (typeof cvLayouts)[number]['id']
