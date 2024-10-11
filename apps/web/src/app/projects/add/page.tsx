'use client'

import { Typography } from '@mui/material'
import { useNotification } from '@shared/ui/hooks'
import { useState } from 'react'
import { siteCopy } from '@shared/content'
import { useRouter } from 'next/navigation'
import { Prisma } from '@prisma/client'
import { apiClient } from '@shared/utils'
import { HttpStatusCode } from 'axios'
import { ProjectForm } from '@shared/ui/components'

const { errors, success } = siteCopy.notifications

export default function AddProjectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setSuccess, setError } = useNotification()
  const { replace } = useRouter()

  const handleSubmit = async (formData: Prisma.ProjectUpdateInput) => {
    setIsSubmitting(true)
    try {
      const res = await apiClient.post('/api/projects', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.status === HttpStatusCode.Ok && res.data.success) {
        setSuccess(success.projectAdded)
        replace('/projects')
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
      <Typography variant="h4" className="mb-6">
        {siteCopy.cta.addProject}
      </Typography>

      <ProjectForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        action={isSubmitting ? 'Adding...' : 'Add Project'}
      />
    </div>
  )
}
