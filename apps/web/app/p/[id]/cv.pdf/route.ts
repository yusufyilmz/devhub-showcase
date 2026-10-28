import { readPublicProfile } from '@shared/lib/published-profile'
import { cvResponse } from '../../../../lib/cv-response'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const snapshot = await readPublicProfile((await context.params).id)
  if (!snapshot)
    return new Response('CV not found.', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' }
    })
  return cvResponse(snapshot)
}
