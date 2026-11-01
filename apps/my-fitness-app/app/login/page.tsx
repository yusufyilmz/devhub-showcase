import { LoginPanel } from "@shared/auth/components";

import { ThemeToggle } from "@/features/theme/theme-toggle";

const errors: Record<string, string> = {
  google_failed: "Google sign in did not complete. Try again or use your password.",
  setup: "Sign in is unavailable. Check setup or try again.",
  unconfirmed: "Confirm your account before continuing.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="login-page">
      <div className="login-brand">
        <span className="brand">↗ Fitness OS</span>
        <ThemeToggle />
      </div>
      <LoginPanel
        backHref="/"
        backLabel="View the shared workspace →"
        description="Sign in with the same Google account as MyDevStudio. This browser keeps that session, so opening either app continues where you left off."
        eyebrow="A LITTLE BETTER, EVERY DAY"
        googleAction="/api/auth/google"
        initialError={error ? errors[error] : undefined}
        sessionEndpoint="/api/auth/session"
        submitLabel="Open my day →"
        successPath="/"
        title={
          <>
            Welcome back,
            <br />
            Yusuf.
          </>
        }
      />
    </div>
  );
}
