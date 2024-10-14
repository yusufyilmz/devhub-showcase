import { ProjectItem } from '../ProjectItem'
import { Grid2 } from '@mui/material'
import { PageHeader } from '../../ui/PageHeader'
import { ProjectWithCompany } from '@shared/lib/types'

interface ProjectsSectionProps {
  projects: ProjectWithCompany[]
}

const ProjectList = ({ projects }: ProjectsSectionProps) => {
  if (projects.length === 0) {
    return <p>No projects available at the moment.</p>
  }

  return (
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
  )
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects
}) => {
  const publicProjects = projects.filter(project => project.public)
  const notPublicProjects = projects.filter(project => !project.public)

  return (
    <section className="w-full px-page-px" id="projects">
      <div className="text-center">
        <PageHeader
          title="Projects & Contributions"
          subtitle="Notable Work and Open-Source Contributions"
        />
        <ProjectList projects={notPublicProjects} />

        <h2 className="text-xl py-8 font-bold my-4">Public Projects</h2>
        <ProjectList projects={publicProjects} />
      </div>
    </section>
  )
}
