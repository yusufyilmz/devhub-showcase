"use client";

import { createClient } from "@shared/auth/client";
import { supabaseConfigured } from "@shared/auth/config";
import { urls } from "@shared/config/urls";

let client: ReturnType<typeof createClient> | undefined;

/** Cookie session for the configured Fitness Auth project. */
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

export function watchSession(onChange: (userId: string | null) => void) {
  if (!supabaseConfigured() || typeof window === "undefined") return () => undefined;
  let previous: string | null | undefined;
  const { data } = browserAuth().auth.onAuthStateChange((_event, session) => {
    const userId = session?.user.id ?? null;
    const changed = previous !== undefined && previous !== userId;
    previous = userId;
    if (changed) onChange(userId);
  });
  return () => data.subscription.unsubscribe();
}

export async function signOut() {
  const response = await fetch(urls.auth.session(), { method: "DELETE" });
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
