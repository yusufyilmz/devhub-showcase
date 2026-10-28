import type { PortfolioProfile } from '@shared/content'
import { z } from 'zod'

const text = (max = 200) =>
  z.string().trim().min(1, 'This field is required').max(max)
const safeUrl = z
  .url()
  .refine((value) => /^https?:\/\//i.test(value), 'Use an http or https URL')
const optionalUrl = safeUrl.nullable()
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
  .refine((value) => {
    const parsed = new Date(value)
    return (
      Number.isFinite(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    )
  }, 'Enter a valid date')
const id = text(100).regex(
  /^[a-zA-Z0-9_-]+$/,
  'Use letters, numbers, underscores or hyphens for IDs'
)
const dated = { start: date, end: date.nullable() }
const chronological = (value: { start: string; end: string | null }) =>
  !value.end || value.end >= value.start

export const profileSchema = z
  .object({
    name: text(),
    title: text(),
    location: text(),
    email: z.email(),
    phone: z.string().trim().max(80),
    website: safeUrl,
    github: safeUrl,
    linkedin: safeUrl,
    summary: text(3000),
    about: z.array(text(6000)).max(30),
    cvUrl: z.union([safeUrl, z.literal('/cv.pdf')]).default('/cv.pdf'),
    appearance: z
      .object({
        accent: z.enum(['cyan', 'violet', 'emerald']),
        defaultTheme: z.enum(['system', 'light', 'dark'])
      })
      .default({ accent: 'cyan', defaultTheme: 'dark' }),
    experiences: z
      .array(
        z
          .object({
            id,
            company: text(),
            companyUrl: safeUrl,
            position: text(),
            ...dated,
            achievements: z.array(text(3000)).max(50)
          })
          .refine(chronological, {
            message: 'End date must follow the start date',
            path: ['end']
          })
      )
      .max(60),
    projects: z
      .array(
        z.object({
          id,
          name: text(),
          company: text(),
          experienceId: id.nullable(),
          url: optionalUrl,
          sourceUrl: optionalUrl,
          description: text(5000),
          skills: z.array(text(100)).max(60),
          public: z.boolean()
        })
      )
      .max(100),
    education: z
      .array(
        z
          .object({
            id,
            degree: text(),
            field: text(),
            institution: text(),
            url: safeUrl,
            start: date,
            end: date
          })
          .refine(chronological, {
            message: 'End date must follow the start date',
            path: ['end']
          })
      )
      .max(30),
    skills: z
      .record(
        text(80).refine(
          (key) => !['__proto__', 'constructor', 'prototype'].includes(key)
        ),
        z.array(text(100)).max(100)
      )
      .refine(
        (groups) => Object.keys(groups).length <= 30,
        'Use at most 30 skill groups'
      ),
    languages: z
      .array(z.object({ id, language: text(100), proficiency: text(100) }))
      .max(30)
  })
  .superRefine((value, ctx) => {
    for (const key of [
      'experiences',
      'projects',
      'education',
      'languages'
    ] as const) {
      const ids = value[key].map((item) => item.id)
      if (new Set(ids).size !== ids.length)
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: 'Each item needs a unique ID'
        })
    }
    const employers = new Set(value.experiences.map((item) => item.id))
    value.projects.forEach((project, index) => {
      if (project.experienceId && !employers.has(project.experienceId))
        ctx.addIssue({
          code: 'custom',
          path: ['projects', index, 'experienceId'],
          message: 'Choose an existing experience or Personal'
        })
    })
  })
export type EditableProfile = z.infer<typeof profileSchema>
export function validateProfile(value: unknown): PortfolioProfile {
  return profileSchema.parse(value)
}
export const saveProfileSchema = z.object({
  revision: z.number().int().min(1),
  profile: profileSchema
})
