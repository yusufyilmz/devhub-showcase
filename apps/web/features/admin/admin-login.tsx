import { LoginPanel } from "@shared/components/login";
export function AdminLogin({ initialError = "" }: { initialError?: string }) {
  return (
    <LoginPanel
      backLabel="← Back to portfolio"
      contentId="admin-content"
      description="Sign in to create your portfolio and downloadable CV. Your information stays private until you publish it."
      eyebrow="YOUR CONTENT, YOUR CONTROL"
      googleAction="/api/admin/google"
      initialError={initialError}
      sessionEndpoint="/api/admin/session"
      submitLabel="Open studio →"
      successPath="/admin"
      title={
        <>
          Welcome to your
          <br />
          <span>portfolio studio.</span>
        </>
      }
    />
  );
}
