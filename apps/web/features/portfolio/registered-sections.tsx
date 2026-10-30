import {
  getPortfolioSections,
  type PortfolioProfile,
  type SectionRendererId
} from '@shared/content'
import { Fragment, type ReactNode } from 'react'
import { ConfiguredSection } from './configured-section'

/** Server component: only explicit React implementations can render saved content. */
export function RegisteredSections({
  profile,
  renderers
}: {
  profile: PortfolioProfile
  renderers: Partial<Record<SectionRendererId, ReactNode>>
}) {
  return getPortfolioSections(profile).map((section) => {
    if (!section.settings.visible) return null
    if (profile.sectionSettings?.[section.kind]?.renderer)
      return (
        <ConfiguredSection
          key={section.id}
          profile={profile}
          section={section}
        />
      )
    if (!Object.hasOwn(renderers, section.renderer))
      throw new Error(`Missing portfolio renderer: ${section.renderer}`)
    return section.settings.visible ? (
      <Fragment key={section.id}>{renderers[section.renderer]}</Fragment>
    ) : null
  })
}
