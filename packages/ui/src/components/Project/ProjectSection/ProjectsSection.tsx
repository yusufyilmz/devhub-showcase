import { ProjectItem } from '../ProjectItem'
import { Grid2 } from '@mui/material'
import { PageHeader } from '../../ui/PageHeader'
import { ProjectWithCompany } from '@shared/lib/types'

interface ProjectsSectionProps {
  projects: ProjectWithCompany[]
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
