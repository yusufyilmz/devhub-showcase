"use client";
import { type ReactNode, useState } from "react";
export function LoginPanel({
  initialError = "",
  googleAction,
  sessionEndpoint,
  successPath,
  title,
  description,
  eyebrow = "WELCOME BACK",
  submitLabel = "Sign in",
  backHref = "/",
  backLabel = "← Back",
  contentId = "auth-content",
}: {
  initialError?: string;
  googleAction: string;
  sessionEndpoint: string;
  successPath: string;
  title: ReactNode;
  description: ReactNode;
  eyebrow?: string;
  submitLabel?: string;
  backHref?: string;
  backLabel?: string;
  contentId?: string;
}) {
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  return (
    <main className="auth-login" id={contentId}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <form
        action={googleAction}
        className="google-login-form"
        method="post"
        onSubmit={() => {
          setError("");
          setBusy(true);
        }}
      >
        <button className="studio-google" disabled={busy} type="submit">
          <svg aria-hidden="true" height="20" viewBox="0 0 24 24" width="20">
            <path
              d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
              fill="#4285F4"
            />
            <path
              d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.12H3.04v2.59A10 10 0 0 0 12 22Z"
              fill="#34A853"
            />
            <path
              d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.11-1.31.31-1.92V7.49H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.51l3.35-2.59Z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.96c1.47 0 2.79.51 3.82 1.5l2.86-2.86A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.96 5.49l3.35 2.59C7.18 7.72 9.39 5.96 12 5.96Z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
        <span className="login-separator">or sign in with email</span>
      </form>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setBusy(true);
          const fields = new FormData(event.currentTarget);
          try {
            const response = await fetch(sessionEndpoint, {
              body: JSON.stringify({
                email: fields.get("email"),
                password: fields.get("password"),
              }),
              headers: { "Content-Type": "application/json" },
              method: "POST",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            window.location.assign(successPath);
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not sign in.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Email
          <input autoComplete="username" name="email" required type="email" />
        </label>
        <label>
          Password
          <input autoComplete="current-password" name="password" required type="password" />
        </label>
        <button className="studio-primary" disabled={busy} type="submit">
          {busy ? "Signing in…" : submitLabel}
        </button>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
      <a href={backHref}>{backLabel}</a>
    </main>
  );
}
