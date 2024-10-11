'use client'

import { ProjectItem } from './ProjectItem'
import { ProjectItemSkeleton } from './ProjectItemSkeleton'
import { Grid2, Typography } from '@mui/material'
import { Project } from '@prisma/client'

interface ProjectsSectionProps {
  projects: Project[]
  isLoading: boolean
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isLoading,
}) => {
  const skeletonCount = 4

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-12 text-black">My Projects</h2>
      <Grid2 container spacing={4} className='w-full'>
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <Grid2
                key={index}
                size={6}
              >
                <ProjectItemSkeleton />
              </Grid2>
            ))
          : projects.length > 0
          ? projects.map((project) => (
              <Grid2
                key={project.id}
                size={6}
              >
                <ProjectItem project={project} />
              </Grid2>
            ))
          : (
            <Typography
              variant="h6"
              component="p"
              className="text-gray-600"
              sx={{ mt: 4, width: '100%' }}
            >
              No projects found.
            </Typography>
          )}
      </Grid2>
    </div>
  )
}
