import { HeroSurface } from '@shared/components/hero-surface'
import {
  copy,
  getPortfolioCopy,
  type PortfolioProfile,
  type SectionRendererId,
  selectPortfolioContent
} from '@shared/content'
import { getPortfolioResources } from '@shared/lib/portfolio'
import {
  AboutMeSection,
  ChatSection,
  EducationsSection,
  ExperienceSection,
  Footer,
  Header,
  ProjectsSection,
  ReferralSection,
  ScrollButton,
  Section,
  SkillSection,
  SummarySection
} from '@shared/ui/components'
import type { ComponentProps, ReactNode } from 'react'
import { handleSendMessageAction } from '../../app/actions'
import { RegisteredSections } from './registered-sections'

export function EngineerPortfolio({
  profile,
  ownerLink,
  referrals = [],
  extras = false
}: {
  profile: PortfolioProfile
  ownerLink?: ReactNode
  referrals?: ComponentProps<typeof ReferralSection>['referrals']
  extras?: boolean
}) {
  const canonicalProfile = profile
  profile = selectPortfolioContent(profile)
  const { experiences, projects, skills, educations } =
    getPortfolioResources(profile)
  const text = getPortfolioCopy(profile.portfolioLanguage)
  const renderers: Partial<Record<SectionRendererId, ReactNode>> = {
    'about-card': <AboutMeSection profile={profile} />,
    timeline: experiences.length > 0 && (
      <ExperienceSection
        language={profile.portfolioLanguage}
        experiences={experiences}
      />
    ),
    'project-cards': projects.length > 0 && (
      <ProjectsSection
        language={profile.portfolioLanguage}
        projects={projects}
      />
    ),
    'skill-groups': Object.keys(skills).length > 0 && (
      <SkillSection language={profile.portfolioLanguage} skills={skills} />
    ),
    'education-timeline': educations.length > 0 && (
      <EducationsSection
        language={profile.portfolioLanguage}
        educations={educations}
      />
    ),
    'language-list': profile.languages.length > 0 && (
      <Section
        sectionId="languages"
        title={text.spokenLanguages}
        eyebrow={text.spokenLanguages}
        subtitle=""
      >
        <p>
          {profile.languages
            .map((item) => `${item.language} (${item.proficiency})`)
            .join(' · ')}
        </p>
      </Section>
    )
  }
  return (
    <>
      <Header profile={profile} />
      {ownerLink}
      <main id="main-content" className="portfolio-main">
        <div className="portfolio-inner">
          <HeroSurface
            media={profile.hero}
            labels={{ play: text.playBackground, pause: text.pauseBackground }}
          >
            <SummarySection profile={profile} />
          </HeroSurface>
          <RegisteredSections
            profile={canonicalProfile}
            renderers={renderers}
          />
          {extras && (
            <ReferralSection
              language={profile.portfolioLanguage}
              referrals={referrals}
            />
          )}
        </div>
      </main>
      {extras && (
        <>
          <ScrollButton
            sectionIds={Object.values(copy.navbar).map(
              (item) => item.id.split('#')[1] ?? ''
            )}
          />
          <ChatSection handleSendMessage={handleSendMessageAction} />
        </>
      )}
      <Footer profile={profile} />
    </>
  )
}
