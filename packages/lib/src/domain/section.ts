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
/** Reserved for trusted normalized definitions; the profile write API is unchanged. */
export const portfolioSectionSchema = z.discriminatedUnion('kind', [
  definition('about'),
  definition('experience'),
  definition('projects'),
  definition('skills'),
  definition('education'),
  definition('languages')
])
