'use client'

import { Typography } from '@mui/material'
import { useNotification } from '@shared/ui/hooks'
import { useState } from 'react'
import { siteCopy } from '@shared/content'
import { useRouter } from 'next/navigation'
import type { Prisma, Project } from '@prisma/client'
import { apiClient } from '@shared/lib'
import type { ServerResponse } from '@shared/lib'
import { ProjectForm } from '@shared/ui/components'

const { errors, success } = siteCopy.notifications

export default function AddProjectPage(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setSuccess, setError } = useNotification()
  const router = useRouter()

  const handleSubmit = async (
    formData: Prisma.ProjectUpdateInput
  ): Promise<void> => {
    setIsSubmitting(true)
    try {
      const res = await apiClient.post<ServerResponse<Project>>(
        '/api/projects',
        {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      )

      if (res.status === 200 && res.data.success) {
        setSuccess(success.projectAdded)
        router.replace('/projects')
      } else {
        setError(errors.projectAddFailed)
      }
    } catch (error) {
      setError(errors.projectAddError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Typography className="mb-6" variant="h4">
        {siteCopy.cta.addProject}
      </Typography>

      <ProjectForm
        action={isSubmitting ? 'Adding...' : 'Add Project'}
        isSubmitting={isSubmitting}
        onSubmit={formData => {
          void handleSubmit(formData)
        }}
      />
    </div>
  )
}
