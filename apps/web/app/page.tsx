import {
  ProjectsSection,
  ExperienceSection,
  ChatSection,
  EducationsSection,
  ReferralSection,
  SummarySection,
  ScrollButton,
  SkillSection,
  AboutMeSection,
} from '@shared/ui/components'
import { Box, Divider } from '@mui/material'
import type { PageResources } from '@shared/lib/types'
import type { Redirect } from 'next'
import { ResourceManager } from '@shared/lib/services'
import { logger } from '@shared/lib/logger'
import { handleSendMessageAction } from './actions'

const sections = [
  'summary',
  'aboutMe',
  'experiences',
  'projects',
  'skills',
  'educations',
  'referrals'
]

export const getPageResources = async (): Promise<
  | PageResources
  | {
      redirect: Redirect
    }
> => {
  try {
    const resources = await new ResourceManager(logger).getAllResources()

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
  const { experiences, projects, educations, referrals, skills } =
    (await getPageResources()) as PageResources

  return (
    <>
      <main className="w-full bg-main-primary  flex flex-col justify-center items-center">
        <Box className="max-w-[100vw] flex flex-col gap-2">
          <SummarySection />
          <AboutMeSection />
          <ExperienceSection experiences={experiences} />
          <Divider />
          <ProjectsSection projects={projects} />
          <SkillSection skills={skills} />
          <EducationsSection educations={educations} />
          <ReferralSection referrals={referrals} />
        </Box>
      </main>
      <ScrollButton sectionIds={sections} />
      <ChatSection handleSendMessage={handleSendMessageAction} />
    </>
  )
}
