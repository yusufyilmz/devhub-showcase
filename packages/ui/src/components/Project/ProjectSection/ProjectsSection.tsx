import { ProjectItem } from '../ProjectItem'
import { Grid2 } from '@mui/material'
import { Project } from '@prisma/client'
import { PageHeader } from '../../ui/PageHeader'

interface ProjectsSectionProps {
  projects: Project[]
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects
}) => {
  return (
    <section className="w-full px-page-px" id="projects">
      <div className="text-center">
        <PageHeader
          title="Projects & Contributions"
          subtitle="Notable Work and Open-Source Contributions"
        />
        <Grid2
          container
          alignItems="stretch"
          spacing={4}
          className="w-full"
          alignContent="stretch"
        >
          {projects.map(project => (
            <Grid2 key={project.id} size={{ md: 6, sm: 12, xl: 6 }}>
              <ProjectItem project={project} />
            </Grid2>
          ))}
        </Grid2>
      </div>
    </section>
  )
}
