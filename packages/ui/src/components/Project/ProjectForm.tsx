'use client'

import { Button, TextField } from '@mui/material'
import { Prisma, Project } from '@prisma/client'
import { useState, useEffect } from 'react'

interface ProjectFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (_e: Prisma.ProjectUpdateInput) => void
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
    setFormData(initialData)
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
        fullWidth
        className="mb-4"
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        fullWidth
        multiline
        rows={4}
        className="mb-4"
      />
      <TextField
        label="Project Link"
        name="link"
        value={formData.link}
        onChange={handleChange}
        required
        fullWidth
        className="mb-4"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting}
      >
        {action}
      </Button>
    </form>
  )
}
