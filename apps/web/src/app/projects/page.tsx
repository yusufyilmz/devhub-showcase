'use client'

import { useFetchProjects } from '@/hooks/use-fetch-projects'
import { AddProjectButton, ProjectsSection } from '@shared/ui/components'

export default function ProjectsPage() {
  const { projects, isLoading } = useFetchProjects()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <AddProjectButton />
      </div>
      <ProjectsSection projects={projects} isLoading={isLoading} />
    </div>
  )
}
