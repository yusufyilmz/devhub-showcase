import { ProjectItem } from '../ProjectItem'
import { Grid2 } from '@mui/material'
import { PageHeader } from '../../ui/PageHeader'
import { ProjectWithCompanyAndSkills } from '@shared/lib/types'
import { useMemo } from 'react'

interface ProjectsSectionProps {
  projects: ProjectWithCompanyAndSkills[]
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects
}) => {
  const PublicProjectList = useMemo(() => {
    const publicProjects = projects.filter(project => project.public)

    if (publicProjects.length === 0) {
      return <p>No public projects available at the moment.</p>
    }

    return (
      <Grid2
        container
        alignItems="stretch"
        spacing={4}
        className="w-full"
        alignContent="stretch"
      >
        {publicProjects.map(project => (
          <Grid2 key={project.id} size={{ md: 6, sm: 12, xl: 6 }}>
            <ProjectItem project={project} />
          </Grid2>
        ))}
      </Grid2>
    )
  }, [projects])

  const ProjectList = useMemo(() => {
    const notPublicProjects = projects.filter(project => !project.public)

    if (notPublicProjects.length === 0) {
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
        {notPublicProjects.map(project => (
          <Grid2 key={project.id} size={{ md: 6, sm: 12, xl: 6 }}>
            <ProjectItem project={project} />
          </Grid2>
        ))}
      </Grid2>
    )
  }, [projects])

  return (
    <section className="w-full px-page-px-sm md:px-page-px" id="projects">
      <div className="text-center">
        <PageHeader
          title="Projects & Contributions"
          subtitle="Notable Work and Open-Source Contributions"
        />
        {ProjectList}
        <h2 className="text-xl py-8 font-bold my-4">Public Projects</h2>
        {PublicProjectList}
      </div>
    </section>
  )
}
