import type { ProfileSnapshot } from '@shared/lib/profile-errors'
import { redirect } from 'next/navigation'
import { ProfileEditor } from '../../features/admin/profile-editor'
import { requireAdmin } from '../../lib/admin-auth'
export default async function AdminPage() {
  let snapshot: ProfileSnapshot | null
  try {
    const { repository } = await requireAdmin()
    snapshot = await repository.read()
  } catch {
    redirect('/admin/login')
  }
  if (!snapshot) redirect('/admin/login')
  return <ProfileEditor initial={snapshot} />
}
