import { logger } from '@shared/lib/logger'
import { getPortfolioResources } from '@shared/lib/portfolio'
import { ProjectService, ReferralService } from '@shared/lib/services'
import { createServerClient } from '@shared/lib/supabase'
import type { PageResources } from '@shared/lib/types'

export const loadPageResources = async (): Promise<PageResources> => {
  const resources = getPortfolioResources()
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  )
    return resources
  try {
    const client = await createServerClient()
    const [referrals, projects] = await Promise.allSettled([
      new ReferralService(logger, client).getAll(),
      new ProjectService(client).getAll()
    ])
    if (referrals.status === 'fulfilled') resources.referrals = referrals.value
    else logger.warn('Testimonials are temporarily unavailable')
    if (projects.status === 'fulfilled') {
      const titles = new Set(
        resources.projects.map((item) => item.title.toLowerCase().trim())
      )
      resources.projects.push(
        ...projects.value.filter(
          (item) => item.public && !titles.has(item.title.toLowerCase().trim())
        )
      )
    } else
      logger.warn('Additional project examples are temporarily unavailable')
  } catch (error) {
    logger.warn({ error }, 'Testimonials are temporarily unavailable')
  }
  return resources
}
