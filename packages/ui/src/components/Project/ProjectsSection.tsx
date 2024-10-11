'use client'

import { ProjectItem } from './ProjectItem'
import { Project } from '@prisma/client'
import { ProjectItemSkeleton } from './ProjectItemSkeleton'

interface ProjectsSectionProps {
  projects: Project[]
  isLoading: boolean
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isLoading
}) => {
  const skeletonCount = 4

  return (
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-12 text-black">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <ProjectItemSkeleton key={index} />
            ))
          : projects?.map(project => (
              <ProjectItem key={project.id} project={project} />
            ))}
      </div>
    </div>
  )
}
