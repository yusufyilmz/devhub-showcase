import { AdminLogin } from '../../../features/admin/admin-login'

const errors: Record<string, string> = {
  google_failed:
    'Google sign in did not complete. Try again or use your password.',
  not_owner:
    'This Google account cannot edit the portfolio. Choose your owner account.',
  setup: 'Admin storage is not ready. Complete the Supabase setup first.'
}
export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <AdminLogin
      initialError={typeof error === 'string' ? (errors[error] ?? '') : ''}
    />
  )
}
