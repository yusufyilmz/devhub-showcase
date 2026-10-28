import { LoginPanel } from '@shared/components/login'
export function AdminLogin({ initialError = '' }: { initialError?: string }) {
  return (
    <LoginPanel
      initialError={initialError}
      googleAction="/api/admin/google"
      sessionEndpoint="/api/admin/session"
      successPath="/admin"
      contentId="admin-content"
      eyebrow="YOUR CONTENT, YOUR CONTROL"
      title={
        <>
          Welcome to your
          <br />
          <span>portfolio studio.</span>
        </>
      }
      description="Sign in to create your portfolio and downloadable CV. Your information stays private until you publish it."
      submitLabel="Open studio →"
      backLabel="← Back to portfolio"
    />
  )
}
