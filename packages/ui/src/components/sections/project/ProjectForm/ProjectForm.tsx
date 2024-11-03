'use client'

import React from 'react'
import { ProjectUpdateInput, Project } from '@shared/lib/types'
import { useState, useEffect } from 'react'
import { Button, TextField } from '../../../../components'

interface ProjectFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (_e: ProjectUpdateInput) => void
  isSubmitting: boolean
  initialData?: Project
  action: string
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isSubmitting,
  action,
  initialData = { title: '', description: '', link: '' }
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: ''
  })

  useEffect(() => {
    setFormData({
      ...initialData,
      link: initialData.link ?? ''
    })
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-lg shadow-lg"
    >
      <TextField
        label="Project Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        className="mb-4"
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        rows={4}
        className="mb-4"
      />
      <TextField
        label="Project Link"
        name="link"
        value={formData.link}
        onChange={handleChange}
        required
        className="mb-4"
      />
      <Button
        aria-label={action}
        variant="contained"
        fullWidth
        disabled={isSubmitting}
      >
        {action}
      </Button>
    </form>
  )
}
