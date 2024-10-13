'use client'

import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Typography } from '@mui/material'
import { useNotification } from '@shared/ui/hooks'
import { copy } from '@shared/content'
import type { Prisma, Project } from '@prisma/client'
import type { ServerResponse } from '@shared/lib'
import { apiClient, fetcher } from '@shared/lib'
import { ProjectForm } from '@shared/ui/components'

interface PageProps {
  params: {
    projectId: string
  }
}

const { errors, success } = copy.notifications
const { cta } = copy

export default function UpdateProjectPage({ params }: PageProps): JSX.Element {
  const { setError, setSuccess } = useNotification()
  const router = useRouter()

  const { data: projectResponse } = useSWR<ServerResponse<Project>>(
    `/api/projects/${params.projectId}`,
    fetcher,
    {
      onError: () => {
        setError(errors.fetchProjectError)
      }
    }
  )

  useEffect(() => {
    if (projectResponse?.error) {
      setError(errors.fetchProjectError)
    }
  }, [projectResponse, setError])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (
    formData: Prisma.ProjectUpdateInput
  ): Promise<void> => {
    setIsSubmitting(true)

    try {
      const res = await apiClient.put<ServerResponse<Project>>(
        `/api/projects/${params.projectId}`,
        {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      )

      if (res.status === 200 && res.data.success) {
        setSuccess(success.projectUpdated)
        router.push('/projects')
      } else {
        setError(errors.updateProjectError)
      }
    } catch {
      setError(errors.updateProjectError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Typography className="mb-6" variant="h4">
        {cta.updateProject}
      </Typography>

      <ProjectForm
        action={isSubmitting ? 'Updating...' : 'Update Project'}
        initialData={projectResponse?.data ?? undefined}
        isSubmitting={isSubmitting}
        onSubmit={formData => {
          void handleSubmit(formData)
        }}
      />
    </div>
  )
}
