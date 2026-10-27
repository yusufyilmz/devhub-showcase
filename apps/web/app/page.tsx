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
import { loadPageResources } from '../lib/portfolio-resources'
import { handleSendMessageAction } from './actions'

const sections = Object.values(copy.navbar).map(
  ({ id }) => id.split('#')[1]
) as string[]

export default async function Home(): Promise<React.JSX.Element> {
  const { experiences, projects, educations, referrals, skills } =
    await loadPageResources()

  return (
    <>
      <main className="w-full bg-main-primary  flex flex-col justify-center items-center mt-16">
        <div className="max-w-[100vw] flex flex-col gap-2">
          <SummarySection />
          <AboutMeSection />
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
