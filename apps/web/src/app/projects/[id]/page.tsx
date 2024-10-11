'use client'

import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Typography } from '@mui/material'
import { useNotification } from '@shared/ui/hooks'
import { siteCopy } from '@shared/content'
import { Prisma, Project } from '@prisma/client'
import { apiClient, fetcher } from '@shared/utils'
import { ServerResponse } from '@/types/api'
import { HttpStatusCode } from 'axios'
import { ProjectForm } from '@shared/ui/components'

interface UpdateProjectPageProps {
  params: {
    projectId: string
  }
}

const { errors, success } = siteCopy.notifications
const { cta } = siteCopy

export const UpdateProjectPage: React.FC<UpdateProjectPageProps> = ({
  params
}) => {
  const { setError, setSuccess } = useNotification()
  const router = useRouter()

  const { data: projectResponse, error } = useSWR<ServerResponse<Project>>(
    `/api/projects/${params.projectId}`,
    fetcher,
    {
      onError: () => setError(errors.fetchProjectError)
    }
  )

  useEffect(() => {
    if (error || !projectResponse || projectResponse.error) {
      setError(errors.fetchProjectError)
    }
  }, [error, projectResponse, setError])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: Prisma.ProjectUpdateInput) => {
    setIsSubmitting(true)

    try {
      const res = await apiClient.put(`/api/projects/${params.projectId}`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.status === HttpStatusCode.Ok && res.data.success) {
        setSuccess(success.projectUpdated)
        router.push('/projects')
      } else {
        setError(errors.updateProjectError)
      }
    } catch (error) {
      setError(errors.updateProjectError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" className="mb-6">
        {cta.updateProject}
      </Typography>

      <ProjectForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialData={projectResponse?.data ?? undefined}
        action={isSubmitting ? 'Updating...' : 'Update Project'}
      />
    </div>
  )
}

export default UpdateProjectPage
