import { AdminLogin } from '../../../features/admin/admin-login'

const errors: Record<string, string> = {
  google_failed:
    'Google sign in did not complete. Try again or use your password.',
  not_owner: 'Please sign in with a confirmed Google account.',
  setup: 'CV storage is not ready. Complete the Supabase migration first.'
}
export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <AdminLogin
      initialError={
        typeof error === 'string' && Object.hasOwn(errors, error)
          ? (errors[error] ?? '')
          : ''
      }
    />
  )
}
