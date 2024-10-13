import {
  ProjectsSection,
  CVSection,
  CompanySection,
  ChatSection
} from '@shared/ui/components'
import type { Company, Project } from '@prisma/client'
import { Box } from '@mui/material'
import { handleSendMessageAction } from './actions'
import { db } from '@/lib/db'

export const getProjectsAndCompanies = async (): Promise<{
  projects: Project[]
  companies: Company[]
}> => {
  const projects = await db.project.findMany()
  const companies = await db.company.findMany()

  return {
    projects,
    companies
  }
}

export default async function Home(): Promise<JSX.Element> {
  const { projects, companies } = await getProjectsAndCompanies()

  return (
    <Box sx={{ flexDirection: 'column', display: 'flex', gap: 8 }}>
      <ProjectsSection projects={projects} />
      <CompanySection companies={companies} />
      <CVSection />
      <ChatSection handleSendMessage={handleSendMessageAction} />
    </Box>
  )
}
