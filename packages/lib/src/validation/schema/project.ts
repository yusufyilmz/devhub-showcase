import { z } from 'zod'

export const addProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  link: z.string().url('Invalid URL'),
  skills: z.array(z.string()).optional().default([]),
  role: z.string()
})

export const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  link: z.string().url('Invalid URL').optional(),
  skills: z.array(z.string()).optional().default([]),
  role: z.string().optional()
})
