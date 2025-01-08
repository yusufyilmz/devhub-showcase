import { copy } from '@shared/content'
import { logger } from '@shared/lib/logger'
import { ResourceManager } from '@shared/lib/services'
import { createServerClient } from '@shared/lib/supabase'
import type { PageResources, SupabaseDbClient } from '@shared/lib/types'
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
import type { Redirect } from 'next'
import { handleSendMessageAction } from './actions'

const sections = Object.values(copy.navbar).map(
  ({ id }) => id.split('#')[1]
) as string[]

export const getPageResources = async (supabase: SupabaseDbClient): Promise<
  | PageResources
  | {
    redirect: Redirect
  }
> => {
  try {
    const resources = await new ResourceManager(logger, supabase).getAllResources()

    return resources
  } catch (error) {
    logger.error(
      { message: (error as Error).message, stack: (error as Error).stack },
      'Error fetching page resources'
    )

    return {
      redirect: {
        destination: '/error',
        permanent: false
      }
    }
  }
}


export default async function Home(): Promise<JSX.Element> {
  const supabase = await createServerClient()
  const { experiences, projects, educations, referrals, skills } =
    (await getPageResources(supabase)) as PageResources

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
