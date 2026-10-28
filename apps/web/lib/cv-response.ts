import { renderCv } from '@shared/cv'
import template from '@shared/cv/template.hbs'
import type { ProfileSnapshot } from '@shared/lib/profile-errors'
export async function cvResponse(snapshot: ProfileSnapshot) {
  const pdf = await renderCv(snapshot.profile, template)
  const name =
    snapshot.profile.name
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_|_$/g, '') || 'Profile'
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${name}_CV.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Profile-Revision': String(snapshot.revision)
    }
  })
}
