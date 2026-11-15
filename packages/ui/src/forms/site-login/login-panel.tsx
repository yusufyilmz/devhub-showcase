"use client";

import "../login-form/auth-login.css";

import { type ReactNode, useState } from "react";

import { cn } from "cn";
import { ArrowUpRight, Eye, EyeOff, FileText, LockKeyhole } from "lucide-react";

import { Button as LibraryButton } from "../../buttons/button/Button";
import { Alert, AlertDescription } from "../../feedback/alert";
import { Input as LibraryInput } from "../input/Input";
import { Label as LibraryLabel } from "../label/Label";

function LoginVisualPreview() {
  return (
    <div aria-hidden="true" className="login-preview-stage">
      <div className="login-preview-portfolio">
        <div className="login-preview-browser">
          <span />
          <span />
          <span />
        </div>
        <div className="login-preview-profile">
          <span className="login-preview-avatar" />
          <span className="login-preview-lines" />
        </div>
        <div className="login-preview-projects">
          <span />
          <span />
        </div>
      </div>
      <div className="login-preview-cv">
        <FileText size={22} />
        <span>CV</span>
        <span className="login-preview-lines" />
      </div>
    </div>
  );
}

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
  animateVisual = false,
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
  animateVisual?: boolean;
}) {
  const [error, showError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const panel = (
    <main
      className={cn(
        "auth-login grid min-w-0 content-start gap-md p-lg text-card-foreground md:p-xl",
        !brand && "mx-auto my-lg max-w-md rounded-xl border border-border/75 bg-card shadow-sm",
      )}
      id={contentId}
    >
      <div className="grid gap-xs">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground">{eyebrow}</p>
        <h1 className="text-3xl leading-tight font-semibold tracking-tight wrap-anywhere sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <form
        action={googleAction}
        className="google-login-form grid gap-sm"
        method="post"
        onSubmit={() => {
          showError("");
          setBusy(true);
        }}
      >
        <LibraryButton className="min-h-11 w-full" disabled={busy} type="submit" variant="outline">
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
        <span className="login-separator flex items-center gap-sm text-center text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border/75 after:h-px after:flex-1 after:bg-border/75">
          or sign in with email
        </span>
      </form>
      <form
        className="grid gap-sm"
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
        <LibraryLabel className="grid gap-xs">
          Email
          <LibraryInput
            autoComplete="username"
            className="h-11 text-base sm:text-sm"
            name="email"
            required
            type="email"
          />
        </LibraryLabel>
        <div className="auth-password relative">
          <LibraryLabel className="grid gap-xs">
            Password
            <LibraryInput
              autoComplete="current-password"
              className="h-11 pe-12 text-base sm:text-sm"
              name="password"
              required
              type={showPassword ? "text" : "password"}
            />
          </LibraryLabel>
          <LibraryButton
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute end-1.5 bottom-1.5"
            onClick={() => setShowPassword(!showPassword)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </LibraryButton>
        </div>
        <LibraryButton className="min-h-11 w-full" disabled={busy} type="submit">
          {busy ? "Signing in…" : submitLabel}
        </LibraryButton>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
      {localTestLogin && (
        <div className="local-test-login grid gap-xs">
          <LibraryButton
            className="min-h-11 w-full"
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
            variant="outline"
          >
            {busy ? "Signing in…" : "Continue as local test user"}
          </LibraryButton>
          <p className="text-xs text-muted-foreground">
            Development only · Uses your local Supabase test account
          </p>
        </div>
      )}
      <a
        className="w-fit rounded-sm text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        href={backHref}
      >
        {backLabel}
      </a>
    </main>
  );

  if (!brand) {
    return panel;
  }

  return (
    <div className="login-page mx-auto my-[clamp(1rem,6vh,4rem)] w-[calc(100%-2rem)] max-w-md text-foreground min-[761px]:max-w-5xl">
      <div className="login-brand mb-sm flex flex-wrap items-center justify-between gap-sm">
        <span className="login-brand-name flex min-w-0 items-center gap-xs text-sm font-semibold tracking-tight">
          <span className="login-brand-mark grid size-8 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <ArrowUpRight aria-hidden="true" size={18} />
          </span>
          {brand}
        </span>
        {brandActions}
      </div>
      <div className="login-layout grid overflow-hidden rounded-xl border border-border/75 bg-card shadow-sm min-[761px]:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        {panel}
        <aside
          aria-label="Workspace access"
          className={cn(
            "login-visual hidden min-w-0 items-end border-s border-border/75 bg-linear-to-br from-muted/60 to-primary/10 p-xl min-[761px]:grid",
            animateVisual && "grid-rows-[minmax(10rem,1fr)_auto] gap-lg",
          )}
        >
          {animateVisual && <LoginVisualPreview />}
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
