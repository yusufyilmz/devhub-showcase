'use client'

import { ServerResponse } from '@/types/api'
import { Project } from '@prisma/client'
import { siteCopy } from '@shared/content'
import { ProjectsSection, CVSection } from '@shared/ui/components'
import { useNotification } from '@shared/ui/hooks'
import { fetcher } from '@shared/utils'
import { useEffect } from 'react'
import useSWR from 'swr'

const { errors } = siteCopy.notifications

export default function Home() {
  const { setError } = useNotification()
  const {
    data: projects,
    error,
    isLoading
  } = useSWR<ServerResponse<Project[]>>(`/api/projects`, fetcher, {
    onError: () => setError(errors.fetchProjectError)
  })

  useEffect(() => {
    if (error) {
      setError(errors.fetchProjectError)
    }
  }, [error, setError])

  return (
    <div className="min-h-screen text-main-white">
      <section id="projects">
        <ProjectsSection
          projects={projects?.success ? projects.data : []}
          isLoading={isLoading}
        />
      </section>
      <section id="cv" className="py-16 bg-main-light">
        <CVSection />
      </section>
    </div>
  )
}
