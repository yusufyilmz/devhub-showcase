"use client";
import { useState } from "react";

import { ThemeToggle } from "@/features/theme/theme-toggle";
import { rememberSession } from "@/lib/supabase/browser";
export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main className="login">
      <div className="login-brand">
        <span className="brand">↗ Fitness OS</span>
        <ThemeToggle />
      </div>
      <p className="eyebrow">A LITTLE BETTER, EVERY DAY</p>
      <h1>
        Welcome back,
        <br />
        Yusuf.
      </h1>
      <p>Sign in to edit your workspace. Your login will be remembered on this device.</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const r = await fetch("/api/session", {
              body: JSON.stringify({
                email: new FormData(e.currentTarget).get("email"),
                password: new FormData(e.currentTarget).get("password"),
              }),
              headers: { "Content-Type": "application/json" },
              method: "POST",
            });
            const result = await r.json();
            if (r.ok) {
              await rememberSession(result.session);
              location.href = "/";
            } else setError(result.error);
          } catch (error) {
            setError(
              error instanceof Error ? error.message : "Could not connect. Please try again.",
            );
          }
          setBusy(false);
        }}
      >
        <label>
          Email
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label>
          Password
          <input autoComplete="current-password" name="password" required type="password" />
        </label>
        <button className="primary" disabled={busy} type="submit">
          {busy ? "Opening…" : "Open my day →"}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
      <a className="text-btn space-top" href="/">
        View the shared workspace →
      </a>
    </main>
  );
}
