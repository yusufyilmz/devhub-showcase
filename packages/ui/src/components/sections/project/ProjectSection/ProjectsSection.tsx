import { ProjectItem } from '../ProjectItem'
import { Section, List, ListItem } from '../../../../components'

import { ProjectWithCompanyAndSkills } from '@shared/lib/types'
import { copy } from '@shared/content'

interface ProjectsSectionProps {
  projects: ProjectWithCompanyAndSkills[]
}

const { id, title, subtitle } = copy.header.sections.projects

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = []
}) => {
  return (
    <Section className="mt-8" sectionId={id} title={title} subtitle={subtitle}>
      <div className="flex h-full no-scrollbar">
        <List
          divider
          className="overflow-y-auto mt-2 md:mt-8 no-scrollbar w-full"
        >
          {projects.map(project => (
            <ListItem key={project.id} className="pl-0 md:pl-4">
              <ProjectItem project={project} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  )
}
