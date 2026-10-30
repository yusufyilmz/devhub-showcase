import { type PortfolioSectionId, sectionRegistry } from '@shared/content'
import { z } from 'zod'

function definition<Kind extends PortfolioSectionId>(kind: Kind) {
  return z
    .object({
      id: z.literal(kind),
      kind: z.literal(kind),
      renderer: z.enum(sectionRegistry[kind].renderers),
      source: z
        .object({
          type: z.literal('profile'),
          field: z.literal(sectionRegistry[kind].source)
        })
        .strict(),
      settings: z.object({ visible: z.boolean() }).strict()
    })
    .strict()
}
/** Validates normalized built-in definitions with fixed source bindings. */
export const portfolioSectionSchema = z.discriminatedUnion('kind', [
  definition('about'),
  definition('experience'),
  definition('projects'),
  definition('skills'),
  definition('education'),
  definition('languages')
])

function preferences<const Renderers extends readonly [string, ...string[]]>(
  renderers: Renderers
) {
  return z
    .object({
      renderer: z.enum(renderers).optional(),
      visible: z.boolean().optional(),
      itemIds: z
        .array(z.string().min(1).max(200))
        .max(100)
        .refine(
          (ids) => new Set(ids).size === ids.length,
          'Select each item once'
        )
        .optional()
    })
    .strict()
    .optional()
}
export const sectionSettingsSchema = z
  .object({
    about: preferences(sectionRegistry.about.renderers),
    experience: preferences(sectionRegistry.experience.renderers),
    projects: preferences(sectionRegistry.projects.renderers),
    skills: preferences(sectionRegistry.skills.renderers),
    education: preferences(sectionRegistry.education.renderers),
    languages: preferences(sectionRegistry.languages.renderers)
  })
  .strict()
