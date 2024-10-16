import {
  ProjectsSection,
  ExperienceSection,
  CVSection,
  ChatSection,
  EducationsSection,
  ReferralSection
} from '@shared/ui/components'
import { Box } from '@mui/material'
import type { PageResources } from '@shared/lib/types'
import type { Redirect } from 'next'
import { ResourceManager } from '@shared/lib/services'
import { logger } from '@shared/lib/logger'
import { handleSendMessageAction } from './actions'

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
  const { experiences, projects, educations, referrals } =
    (await getPageResources()) as PageResources

  return (
    <>
      <Box
        className="max-w-[100vw]"
        sx={{ flexDirection: 'column', display: 'flex', gap: 8 }}
      >
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projects} />
        <EducationsSection educations={educations} />
        <ReferralSection referrals={referrals} />
        <CVSection />
      </Box>
      <ChatSection
        className="fixed bottom-4 right-4 z-10"
        handleSendMessage={handleSendMessageAction}
        key="cv"
        type="cv"
      />
      <ChatSection
        className="fixed bottom-4 left-4 z-10"
        handleSendMessage={handleSendMessageAction}
        key="referral"
        type="referral"
      />
    </>
  )
}
