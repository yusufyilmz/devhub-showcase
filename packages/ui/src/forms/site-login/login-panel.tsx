"use client";

import "../../styles/components/forms/login-form/auth-login.css";

import { type ReactNode, useState } from "react";

import { ArrowUpRight, Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Button as LibraryButton } from "../../buttons/button/Button";
import { Input as LibraryInput } from "../input/Input";
import { Label as LibraryLabel } from "../label/Label";

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
  brand,
  brandActions,
  localTestLogin = false,
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
  brand?: string;
  brandActions?: ReactNode;
  localTestLogin?: boolean;
}) {
  const [error, showError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const panel = (
    <main className="auth-login" id={contentId}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <form
        action={googleAction}
        className="google-login-form"
        method="post"
        onSubmit={() => {
          showError("");
          setBusy(true);
        }}
      >
        <LibraryButton className="studio-google" disabled={busy} type="submit" variant="unstyled">
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
        </LibraryButton>
        <span className="login-separator">or sign in with email</span>
      </form>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          showError("");
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
            showError(reason instanceof Error ? reason.message : "Could not sign in.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <LibraryLabel unstyled>
          Email
          <LibraryInput autoComplete="username" name="email" required type="email" unstyled />
        </LibraryLabel>
        <div className="auth-password">
          <LibraryLabel unstyled>
            Password
            <LibraryInput
              autoComplete="current-password"
              name="password"
              required
              type={showPassword ? "text" : "password"}
              unstyled
            />
          </LibraryLabel>
          <LibraryButton
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1 bottom-1"
            onClick={() => setShowPassword(!showPassword)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </LibraryButton>
        </div>
        <LibraryButton className="studio-primary" disabled={busy} type="submit" variant="unstyled">
          {busy ? "Signing in…" : submitLabel}
        </LibraryButton>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
      {localTestLogin && (
        <div className="local-test-login">
          <LibraryButton
            className="studio-primary"
            disabled={busy}
            onClick={async () => {
              showError("");
              setBusy(true);
              try {
                const response = await fetch("/api/auth/local-test", { method: "POST" });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                window.location.assign(successPath);
              } catch (reason) {
                showError(reason instanceof Error ? reason.message : "Local login failed.");
                setBusy(false);
              }
            }}
            type="button"
            variant="unstyled"
          >
            {busy ? "Signing in…" : "Continue as local test user"}
          </LibraryButton>
          <p>Development only · Uses your local Supabase test account</p>
        </div>
      )}
      <a href={backHref}>{backLabel}</a>
    </main>
  );

  if (!brand) {
    return panel;
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <span className="login-brand-name">
          <span className="login-brand-mark">
            <ArrowUpRight aria-hidden="true" size={18} />
          </span>
          {brand}
        </span>
        {brandActions}
      </div>
      <div className="login-layout">
        {panel}
        <aside aria-label="Workspace access" className="login-visual">
          <div className="relative grid gap-md">
            <LockKeyhole aria-hidden="true" className="size-8 text-primary" />
            <p className="text-sm font-semibold tracking-wide text-primary">{brand}</p>
            <p className="max-w-xs text-3xl leading-tight font-semibold tracking-tight">
              Pick up where you left off.
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sign in to access your saved work and manage your account.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
