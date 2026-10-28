import { copy } from '@shared/content'
import {
  AboutMeSection,
  ChatSection,
  EducationsSection,
  ExperienceSection,
  ProjectsSection,
  ReferralSection,
  ScrollButton,
  SkillSection,
  SummarySection
} from '@shared/ui/components'
import { loadPageResources } from '../../lib/portfolio-resources'
import { getPublishedProfile } from '../../lib/published-profile'
import { handleSendMessageAction } from '../actions'

const sections = Object.values(copy.navbar).map(
  ({ id }) => id.split('#')[1]
) as string[]

export default async function Home(): Promise<React.JSX.Element> {
  const { profile } = await getPublishedProfile()
  const { experiences, projects, educations, referrals, skills } =
    await loadPageResources()

  return (
    <>
      <main id="main-content" className="portfolio-main">
        <div className="portfolio-inner">
          <SummarySection profile={profile} />
          <AboutMeSection profile={profile} />
          <ExperienceSection experiences={experiences} />
          <ProjectsSection projects={projects} />
          <SkillSection skills={skills} />
          <EducationsSection educations={educations} />
          <ReferralSection referrals={referrals} />
        </div>
      </main>
      <ScrollButton sectionIds={sections} />
      <ChatSection handleSendMessage={handleSendMessageAction} />
    </>
  )
}
