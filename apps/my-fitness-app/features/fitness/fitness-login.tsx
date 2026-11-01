"use client";

import { LoginPanel } from "@shared/auth/components";

import { ThemeToggle } from "@/features/theme/theme-toggle";

export function FitnessLogin({ initialError = "" }: { initialError?: string }) {
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
        initialError={initialError}
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
