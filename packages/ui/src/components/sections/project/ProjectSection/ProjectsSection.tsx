import { getPortfolioCopy, type Language } from '@shared/content'
import type { ProjectWithCompanyAndSkills } from '@shared/lib/types'
import type React from 'react'
import { List, ListItem, Section } from '../../../../components'
import { ProjectItem } from '../ProjectItem'

interface ProjectsSectionProps {
  projects: ProjectWithCompanyAndSkills[]
  language?: Language
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = [],
  language = 'en'
}) => {
  const text = getPortfolioCopy(language)
  return (
    <Section
      className="mt-8"
      sectionId="projects"
      title={text.projects}
      subtitle={text.projectsSubtitle}
      eyebrow={text.projects}
    >
      <div className="flex h-full no-scrollbar">
        <List
          divider
          className="overflow-y-auto mt-2 md:mt-8 no-scrollbar w-full"
        >
          {projects.map((project) => (
            <ListItem key={project.id} className="pl-0 md:pl-4 py-8">
              <ProjectItem project={project} language={language} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  )
}
