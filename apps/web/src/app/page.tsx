import {
  ProjectsSection,
  CVSection,
  CompanySection,
  ChatSection,
  EducationsSection,
  ReferralSection
} from '@shared/ui/components'
import type { Education, Referral } from '@prisma/client'
import { Box } from '@mui/material'
import type { CompanyWithProjects, ProjectWithCompany } from '@shared/lib/types'
import {
  CompanyWithProjectsArgs,
  ProjectWithCompanyArgs
} from '@shared/lib/types'
import type { Redirect } from 'next'
import { db } from '@/lib/db'
import logger from '@/lib/log'
import { handleSendMessageAction } from './actions'

interface PageResources {
  projects: ProjectWithCompany[]
  companies: CompanyWithProjects[]
  educations: Education[]
  referrals: Referral[]
}

export const getPageResources = async (): Promise<
  | PageResources
  | {
      redirect: Redirect
    }
> => {
  try {
    const projects = await db.project.findMany(ProjectWithCompanyArgs)
    const educations = await db.education.findMany()
    const companies = await db.company.findMany(CompanyWithProjectsArgs)
    const referrals = await db.referral.findMany({
      where: {
        recommendation: {
          not: null
        },
        name: {
          not: null
        }
      }
    })

    return {
      projects,
      companies,
      educations,
      referrals
    }
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
  const { companies, projects, educations, referrals } =
    (await getPageResources()) as PageResources

  return (
    <>
      <Box
        className="max-w-[100vw]"
        sx={{ flexDirection: 'column', display: 'flex', gap: 8 }}
      >
        <CompanySection companies={companies} />
        <EducationsSection educations={educations} />
        <ProjectsSection projects={projects} />
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
