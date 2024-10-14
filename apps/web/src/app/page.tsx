import {
  ProjectsSection,
  CVSection,
  CompanySection,
  ChatSection,
  EducationsSection
} from '@shared/ui/components'
import type { Education } from '@prisma/client'
import { Box } from '@mui/material'
import type { CompanyWithProjects, ProjectWithCompany } from '@shared/lib'
import { CompanyWithProjectsArgs, ProjectWithCompanyArgs } from '@shared/lib'
import { db } from '@/lib/db'
import logger from '@/lib/log'
import { handleSendMessageAction } from './actions'

export const getPageResources = async (): Promise<{
  projects: ProjectWithCompany[]
  companies: CompanyWithProjects[]
  educations: Education[]
}> => {
  try {
    const projects = await db.project.findMany(ProjectWithCompanyArgs)
    const educations = await db.education.findMany()
    const companies = await db.company.findMany(CompanyWithProjectsArgs)

    return {
      projects,
      companies,
      educations
    }
  } catch (error) {
    logger.error(
      { message: (error as Error).message, stack: (error as Error).stack },
      'Error fetching page resources'
    )

    throw error
  }
}

export default async function Home(): Promise<JSX.Element> {
  const { projects, companies, educations } = await getPageResources()

  return (
    <Box
      className="max-w-[100vw]"
      sx={{ flexDirection: 'column', display: 'flex', gap: 8 }}
    >
      <CompanySection companies={companies} />
      <EducationsSection educations={educations} />
      <ProjectsSection projects={projects} />
      <CVSection />
      <ChatSection handleSendMessage={handleSendMessageAction} />
    </Box>
  )
}
