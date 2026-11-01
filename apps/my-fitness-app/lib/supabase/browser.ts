"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { supabaseConfig, supabaseConfigured } from "./config";

let client: SupabaseClient | undefined;
export function browserAuth() {
  if (typeof window === "undefined")
    throw new Error("Browser auth is only available in the browser.");
  if (!client) {
    const { url, key } = supabaseConfig();
    client = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
        storage: window.localStorage,
        storageKey: "fitness-os-session",
      },
    });
  }
  return client;
}
export async function authorizationHeaders(): Promise<Record<string, string>> {
  if (!supabaseConfigured()) return {};
  const { data, error } = await browserAuth().auth.getSession();
  if (error) throw new Error("Could not restore your session. Sign in again.");
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}
export async function rememberSession(session: { access_token: string; refresh_token: string }) {
  const { error } = await browserAuth().auth.setSession(session);
  if (error) throw new Error("Could not remember your session. Please sign in again.");
}
export async function signOut() {
  const { error } = await browserAuth().auth.signOut({ scope: "local" });
  if (error) throw new Error("Could not sign out. Please try again.");
}
