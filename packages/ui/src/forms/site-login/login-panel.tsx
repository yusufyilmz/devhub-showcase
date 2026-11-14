"use client";

import "../login-form/auth-login.css";

import { type ReactNode, useState } from "react";

import { ArrowUpRight, Eye, EyeOff, FileText, LockKeyhole } from "lucide-react";

import { Button as LibraryButton, StudioButton } from "../../buttons/button";
import { Eyebrow } from "../../display/typography/Eyebrow";
import { Input as LibraryInput } from "../input/Input";
import { Label as LibraryLabel } from "../label/Label";

function LoginVisualPreview() {
  return (
    <div
      aria-hidden="true"
      className="login-preview-stage [position:relative] [align-self:center] [justify-self:center] [width:min(100%,_20rem)] [height:clamp(9rem,_15vw,_12rem)]"
    >
      <div className="login-preview-portfolio [position:absolute] [background:var(--card)] [border:1px_solid_color-mix(in_srgb,_var(--primary)_28%,_var(--border))] [border-radius:var(--radius-lg)] [box-shadow:0_12px_28px_color-mix(in_srgb,_var(--primary)_16%,_transparent)] [inset:5%_auto_auto_2%] [width:74%] [overflow:hidden] [transform:rotate(-7deg)] [@media(min-width:_761px)_and_(prefers-reduced-motion:_no-preference)]:[animation:login-preview-portfolio_2.6s_cubic-bezier(0.22,_1,_0.36,_1)_both]">
        <div className="login-preview-browser [display:flex] [gap:0.25rem] [padding:0.625rem_0.75rem] [border-bottom:1px_solid_var(--border)] [&_>_:where(span)]:[width:0.3125rem] [height:0.3125rem] [background:color-mix(in_srgb,_var(--primary)_45%,_var(--card))] [border-radius:50%]">
          <span />
          <span />
          <span />
        </div>
        <div className="login-preview-profile [display:grid] [grid-template-columns:auto_minmax(0,_1fr)] [gap:0.625rem] [align-items:center] [padding:0.75rem_0.75rem_0]">
          <span className="login-preview-avatar [width:1.75rem] [height:1.75rem] [background:color-mix(in_srgb,_var(--primary)_36%,_var(--card))] [border-radius:50%]" />
          <span className="login-preview-lines [display:block] [height:0.875rem] [background:linear-gradient(var(--primary),_var(--primary))_top_left\_/\_52%_0.25rem_no-repeat,_linear-gradient(var(--border),_var(--border))_bottom_left\_/\_82%_0.1875rem_no-repeat]" />
        </div>
        <div className="login-preview-projects [display:grid] [grid-template-columns:1fr_1fr] [gap:0.375rem] [padding:0.625rem_0.75rem_0.75rem] [&_>_:where(span)]:[height:clamp(1rem,_3vw,_2.375rem)] [background:color-mix(in_srgb,_var(--primary)_13%,_var(--card))] [border-radius:var(--radius-sm)]">
          <span />
          <span />
        </div>
      </div>
      <div className="login-preview-cv [position:absolute] [background:var(--card)] [border:1px_solid_color-mix(in_srgb,_var(--primary)_28%,_var(--border))] [border-radius:var(--radius-lg)] [box-shadow:0_12px_28px_color-mix(in_srgb,_var(--primary)_16%,_transparent)] [inset:auto_2%_5%_auto] [display:grid] [gap:0.375rem] [width:39%] [padding:clamp(0.5rem,_1.5vw,_0.875rem)] [font-size:0.75rem] [font-weight:650] [color:var(--primary)] [transform:rotate(9deg)] [@media(min-width:_761px)_and_(prefers-reduced-motion:_no-preference)]:[animation:login-preview-cv_2.2s_400ms_cubic-bezier(0.22,_1,_0.36,_1)_both]">
        <FileText size={22} />
        <span>CV</span>
        <span className="login-preview-lines [display:block] [height:0.875rem] [background:linear-gradient(var(--primary),_var(--primary))_top_left\_/\_52%_0.25rem_no-repeat,_linear-gradient(var(--border),_var(--border))_bottom_left\_/\_82%_0.1875rem_no-repeat]" />
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
      className="auth-login [&_>_.eyebrow]:[margin:0_0_12px] [font:500_11px\_/\_1.6_var(--font-geist-mono,_ui-monospace),_monospace] [color:var(--primary)] [text-transform:uppercase] [letter-spacing:0.15em] [&_h1_span]:[color:var(--primary)] [&_label]:[display:grid] [gap:9px] [font-size:12px] [color:var(--muted-foreground)] [&_.google-login-form]:[padding:0] [margin-bottom:0] [background:transparent] [border:0] [&_.auth-password_input:not([type='checkbox'])]:[padding-inline-end:3rem] [&_input:not([type='checkbox'])]:[display:block] [&_input:not([type='checkbox']):focus]:[border-color:var(--primary)] max-[640px]:[&_input:not([type='checkbox'])]:[font-size:16px] mx-auto mt-[65px] max-w-[500px] px-[30px] pb-20 max-[767px]:mt-10 max-[767px]:px-[22px] max-[767px]:pb-[50px] [&_h1]:my-5 [&_h1]:text-[46px] [&_h1]:leading-[1.13] [&_h1]:tracking-[-0.05em] max-[767px]:[&_h1]:text-[40px] [&_h1_span]:text-primary [&>p:not(.eyebrow)]:text-sm [&>p:not(.eyebrow)]:leading-[1.7] [&>p:not(.eyebrow)]:text-muted-foreground [&_form]:mt-[30px] [&_form]:mb-6 [&_form]:grid [&_form]:gap-5 [&_form]:rounded-2xl [&_form]:border [&_form]:border-border [&_form]:bg-card [&_form]:p-7 max-[767px]:[&_form]:p-[22px] [&_label]:grid [&_label]:gap-[9px] [&_label]:text-xs [&_label]:text-muted-foreground [&>a]:text-xs [&>a]:text-muted-foreground"
      id={contentId}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p>{description}</p>
      <form
        action={googleAction}
        className="google-login-form !m-0 !border-0 !bg-transparent !p-0"
        method="post"
        onSubmit={() => {
          showError("");
          setBusy(true);
        }}
      >
        <LibraryButton
          className="studio-google flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#dadce0] bg-white font-medium text-[#1f1f1f] transition-colors duration-150 hover:bg-[#f3f6fc] disabled:cursor-wait disabled:opacity-60"
          disabled={busy}
          type="submit"
          variant="unstyled"
        >
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
        <span className="login-separator mt-3 flex items-center gap-3.5 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border before:content-[''] after:h-px after:flex-1 after:bg-border after:content-['']">
          or sign in with email
        </span>
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
        <div className="auth-password [position:relative]">
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
        <StudioButton disabled={busy} type="submit" variant="unstyled">
          {busy ? "Signing in…" : submitLabel}
        </StudioButton>
        {error && (
          <p className="form-error text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </form>
      {localTestLogin && (
        <div className="local-test-login">
          <StudioButton
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
          </StudioButton>
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
    <div className="login-page [width:min(100%_-_2rem,_62rem)] [margin:clamp(1rem,_7vh,_5rem)_auto] [color:var(--foreground)] [&_.auth-login]:[max-width:none] [padding:clamp(1rem,_4vw,_2rem)] [margin:0] [background:var(--card)] [border:0] [border-radius:0] [box-shadow:none] max-[760px]:[max-width:29rem] [&_.auth-login_>_.eyebrow]:[color:var(--muted-foreground)] [&_.auth-login_label]:[color:var(--muted-foreground)] [&_.auth-login_h1]:[margin:0.625rem_0] [font-size:clamp(1.625rem,_5vw,_2.125rem)] [font-weight:650] [line-height:1.12] [letter-spacing:-0.04em] [&_.auth-login_h1_span]:[color:inherit] [&_.auth-login_>_p:not(.eyebrow)]:[margin-bottom:1.25rem] [font-size:0.875rem] [line-height:1.6] [color:var(--muted-foreground)] [&_.auth-login_form]:[display:grid] [gap:0.875rem] [padding:0] [margin:1rem_0] [background:transparent] [&_.auth-login_input:not([type='checkbox'])]:[min-height:2.625rem]">
      <div className="login-brand [display:flex] [gap:0.625rem] [align-items:center] [justify-content:space-between] [margin-bottom:0.75rem] [gap:16px]">
        <span className="login-brand-name [display:flex] [gap:0.625rem] [align-items:center] [font-size:0.9375rem] [font-weight:650] [letter-spacing:-0.02em]">
          <span className="login-brand-mark [display:grid] [place-items:center] [width:2rem] [height:2rem] [color:var(--foreground)] [background:color-mix(in_srgb,_var(--primary)_18%,_var(--card))] [border:1px_solid_color-mix(in_srgb,_var(--primary)_28%,_var(--border))] [border-radius:var(--radius-md)]">
            <ArrowUpRight aria-hidden="true" size={18} />
          </span>
          {brand}
        </span>
        {brandActions}
      </div>
      <div className="login-layout [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_0.9fr)] [overflow:hidden] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:var(--radius-xl)] [box-shadow:0_12px_40px_rgb(0_0_0\_/\_0.08)] max-[760px]:[grid-template-columns:minmax(0,_1fr)]">
        {panel}
        <aside
          aria-label="Workspace access"
          className={animateVisual ? "login-visual login-visual-motion" : "login-visual"}
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
