import { profile } from "@shared/content";
import { createClient } from "@supabase/supabase-js";
import { validateProfile } from "../domain/profile";
import { usernameSchema } from "../domain/username";
import {
  ProfileNotFoundError,
  ProfileSetupError,
  type ProfileSnapshot,
} from "../repositories/profile-repository";
import { SupabaseProfileRepository } from "../repositories/supabase-profile-repository";
import type { Database } from "../types";

/** Public read only: the same source is used by the website, PDF and Plop. */
export async function readPublishedProfile(): Promise<ProfileSnapshot> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url && !key)
    return { profile: validateProfile(profile), revision: 0, updatedAt: "" };
  if (!url || !key) throw new ProfileSetupError();
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
  const published = await new SupabaseProfileRepository(client).read();
  if (!published) throw new ProfileNotFoundError();
  return published;
}

/** Named public profiles never fall back to somebody else's data. */
export async function readPublicProfile(
  id: string,
): Promise<ProfileSnapshot | null> {
  if (
    id !== "main" &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
  const snapshot = await new SupabaseProfileRepository(client, id).read();
  return snapshot?.isPublic ? snapshot : null;
}

/** Named public profiles never fall back to somebody else's data. */
export async function readPublicProfileByUsername(
  username: string,
): Promise<ProfileSnapshot | null> {
  if (!usernameSchema.safeParse(username).success) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
  const { data, error } = await client
    .from("portfolio_profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (error) throw new ProfileSetupError();
  if (!data) return null;
  const snapshot = await new SupabaseProfileRepository(client, data.id).read();
  return snapshot?.isPublic ? snapshot : null;
}

/** Anonymous discovery reads only published URL fields, never profile documents. */
export async function listPublishedPortfolioLinks(): Promise<
  Array<{ username: string; updatedAt: string }>
> {
  const client = discoveryClient();
  if (!client) return [];
  const links: Array<{ username: string; updatedAt: string }> = [];
  // Leave one of the XML sitemap's 50,000 slots for the homepage.
  for (let offset = 0; offset < 50000; offset += 1000) {
    const { data, error } = await client
      .from("portfolio_profiles")
      .select("username, updated_at")
      .eq("is_public", true)
      .order("username")
      .range(offset, offset + 999);
    if (error) throw new ProfileSetupError();
    for (const row of data ?? []) {
      if (usernameSchema.safeParse(row.username).success)
        links.push({
          username: row.username as string,
          updatedAt: row.updated_at,
        });
    }
    if ((data?.length ?? 0) < 1000) return links;
  }
  // Fail visibly rather than silently dropping published portfolios.
  throw new Error(
    "Sitemap needs partitioning before 50,000 published portfolios.",
  );
}

function discoveryClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url && !key) return null;
  if (!url || !key) throw new ProfileSetupError();
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
  return client;
}
