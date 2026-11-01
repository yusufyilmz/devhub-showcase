"use client";

import { createClient } from "@shared/auth/client";

import { supabaseConfigured } from "./config";

let client: ReturnType<typeof createClient> | undefined;

/** Cookie session shared with MyDevStudio. The cookie name comes from the Supabase project URL. */
export function browserAuth() {
  if (typeof window === "undefined")
    throw new Error("Browser auth is only available in the browser.");
  if (!client) client = createClient();
  return client;
}

export async function authorizationHeaders(): Promise<Record<string, string>> {
  if (!supabaseConfigured()) return {};
  const { data, error } = await browserAuth().auth.getSession();
  if (error) throw new Error("Could not restore your session. Sign in again.");
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

export function watchSession(onChange: () => void) {
  if (!supabaseConfigured() || typeof window === "undefined") return () => undefined;
  let initial = true;
  const { data } = browserAuth().auth.onAuthStateChange(() => {
    if (initial) {
      initial = false;
      return;
    }
    onChange();
  });
  return () => data.subscription.unsubscribe();
}

export async function signOut() {
  const response = await fetch("/api/auth/session", { method: "DELETE" });
  if (!response.ok) {
    const result = await response
      .json()
      .catch(() => ({ error: "Could not sign out. Please try again." }));
    throw new Error(
      typeof result.error === "string" ? result.error : "Could not sign out. Please try again.",
    );
  }
  const { error } = await browserAuth().auth.signOut({ scope: "local" });
  if (error) throw new Error("Could not sign out. Please try again.");
}
