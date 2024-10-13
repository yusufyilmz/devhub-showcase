import { Suspense } from 'react'
import { ProjectItem } from '../ProjectItem'
import { ProjectItemSkeleton } from '../ProjectItemSkeleton'
import { Grid2 } from '@mui/material'
import { Project } from '@prisma/client'

interface ProjectsSectionProps {
  projects: Project[]
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects
}) => {
  return (
    <section className="w-full" id="projects">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-12">My Projects</h2>
        <Grid2 container alignItems="stretch" spacing={4} className="w-full">
          <Suspense fallback={<ProjectItemSkeleton />}>
            {projects.map(project => (
              <Grid2 key={project.id} size={{ md: 6, sm: 12, xl: 4 }}>
                <ProjectItem project={project} />
              </Grid2>
            ))}
          </Suspense>
        </Grid2>
      </div>
    </section>
  )
}
