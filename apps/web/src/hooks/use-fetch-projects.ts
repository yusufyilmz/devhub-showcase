'use client'

import { ServerResponse } from '@/types/api'
import { Project } from '@prisma/client'
import { siteCopy } from '@shared/content'
import { useNotification } from '@shared/ui/hooks'
import { fetcher } from '@shared/utils'
import { useEffect } from 'react'
import useSWR from 'swr'

const { errors } = siteCopy.notifications

export const useFetchProjects = (): {
  projects: Project[]
  isLoading: boolean
} => {
  const { setError } = useNotification()

  const {
    data: fetchProjectResponse,
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

  return {
    projects: fetchProjectResponse?.success ? fetchProjectResponse.data : [],
    isLoading
  }
}
