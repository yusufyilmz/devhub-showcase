import { LoginPanel } from "@shared/auth/components";

const errors: Record<string, string> = {
  google_failed: "Google sign in did not complete. Try again or use your password.",
  not_owner: "Please sign in with a confirmed Google account.",
  setup: "Portfolio storage is not ready. Complete the Supabase migration first.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const initialError =
    typeof error === "string" && Object.hasOwn(errors, error) ? (errors[error] ?? "") : "";

  return (
    <LoginPanel
      backLabel="← Back to portfolio"
      contentId="admin-content"
      description="Sign in to create your portfolio and downloadable CV. Your information stays private until you publish it."
      eyebrow="YOUR CONTENT, YOUR CONTROL"
      googleAction="/api/login/google"
      initialError={initialError}
      sessionEndpoint="/api/login/session"
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
