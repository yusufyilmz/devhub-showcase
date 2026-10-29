import {
  getPortfolioSections,
  type PortfolioProfile,
  type SectionRendererId
} from '@shared/content'
import { Fragment, type ReactNode } from 'react'

/** Server component: only explicit React implementations can render saved content. */
export function RegisteredSections({
  profile,
  renderers
}: {
  profile: PortfolioProfile
  renderers: Partial<Record<SectionRendererId, ReactNode>>
}) {
  return getPortfolioSections(profile).map((section) => {
    if (!Object.hasOwn(renderers, section.renderer))
      throw new Error(`Missing portfolio renderer: ${section.renderer}`)
    return section.settings.visible ? (
      <Fragment key={section.id}>{renderers[section.renderer]}</Fragment>
    ) : null
  })
}
