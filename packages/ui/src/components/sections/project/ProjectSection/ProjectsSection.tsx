import { ProjectItem } from '../ProjectItem'
import { Box, List, ListItem } from '@mui/material'
import { Section } from '../../../ui/Section'

import { ProjectWithCompanyAndSkills } from '@shared/lib/types'
import { useMemo } from 'react'
import { copy } from '@shared/content'

interface ProjectsSectionProps {
  projects: ProjectWithCompanyAndSkills[]
}

const { id, title, subtitle } = copy.header.sections.projects

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects
}) => {
  const ProjectList = useMemo(() => {
    const projectList = projects.sort((a, b) =>
      b.public && !a.public ? -1 : 1
    )

    if (projectList.length === 0) {
      return <p>No projects available at the moment.</p>
    }

    return (
      <Box className="flex h-full md:pl-40 no-scrollbar">
        <List className="overflow-y-auto mt-2 md:mt-8 no-scrollbar w-full">
          {projectList.map(project => (
            <ListItem key={project.id} className="mb-8 pl-0 md:pl-4">
              <ProjectItem project={project} />
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }, [projects])

  return (
    <Section className="mt-8" sectionId={id} title={title} subtitle={subtitle}>
      {ProjectList}
    </Section>
  )
}
