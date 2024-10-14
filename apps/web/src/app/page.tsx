import {
  ProjectsSection,
  CVSection,
  CompanySection,
  ChatSection,
  EducationsSection
} from '@shared/ui/components'
import type { Education, Project } from '@prisma/client'
import { Box } from '@mui/material'
import type { CompanyWithProjects } from '@shared/lib'
import { CompanyWithProjectsArgs } from '@shared/lib'
import { db } from '@/lib/db'
import { handleSendMessageAction } from './actions'

export const getPageResources = async (): Promise<{
  projects: Project[]
  companies: CompanyWithProjects[]
  educations: Education[]
}> => {
  const projects = await db.project.findMany()
  const educations = await db.education.findMany()
  const companies = await db.company.findMany(CompanyWithProjectsArgs)

  return {
    projects,
    companies,
    educations
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
