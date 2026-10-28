import type { ProfileSnapshot } from '@shared/lib/profile-errors'
import { editCvPath } from '@shared/lib/username'
import { redirect } from 'next/navigation'
import { requireWorkspace } from '../../lib/admin-auth'
export default async function AdminPage() {
  let snapshot: ProfileSnapshot | null
  try {
    const { repository } = await requireWorkspace()
    snapshot = await repository.read()
  } catch {
    redirect('/admin/login')
  }
  if (!snapshot?.username) redirect('/admin/login?error=setup')
  redirect(editCvPath(snapshot.username))
}
