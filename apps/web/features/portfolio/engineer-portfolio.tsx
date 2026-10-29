import { copy, type PortfolioProfile } from '@shared/content'
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
  SkillSection,
  SummarySection
} from '@shared/ui/components'
import type { ComponentProps, ReactNode } from 'react'
import { handleSendMessageAction } from '../../app/actions'

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
  const { experiences, projects, skills, educations } =
    getPortfolioResources(profile)
  return (
    <>
      <Header profile={profile} />
      {ownerLink}
      <main id="main-content" className="portfolio-main">
        <div className="portfolio-inner">
          <SummarySection profile={profile} />
          <AboutMeSection profile={profile} />
          {experiences.length > 0 && (
            <ExperienceSection
              language={profile.portfolioLanguage}
              experiences={experiences}
            />
          )}
          {projects.length > 0 && (
            <ProjectsSection
              language={profile.portfolioLanguage}
              projects={projects}
            />
          )}
          {Object.keys(skills).length > 0 && (
            <SkillSection
              language={profile.portfolioLanguage}
              skills={skills}
            />
          )}
          {educations.length > 0 && (
            <EducationsSection
              language={profile.portfolioLanguage}
              educations={educations}
            />
          )}
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
