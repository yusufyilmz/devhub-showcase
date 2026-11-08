import { z } from "zod";

import { profile, projectPublicProfile } from "@shared/config";

import { discoveryClient } from "../../db/supabase";
import {
  ProfileNotFoundError,
  ProfileSetupError,
  type ProfileSnapshot,
} from "../../repositories/profile/contract";
import {
  usernameSchema,
  validateProfile,
  validatePublicProfile,
} from "../../schemas/profile/index";

type PublicSurface = "website" | "cv";

/** Reads only explicit published snapshots. Configured storage failures never fall back. */
export async function readPublishedProfile(
  surface: PublicSurface = "website",
): Promise<ProfileSnapshot> {
  if (!discoveryClient())
    return {
      profile: projectPublicProfile(validateProfile(profile), surface),
      revision: 0,
      updatedAt: "",
    };
  const published = await readPublicProfile("main", surface);
  if (!published) throw new ProfileNotFoundError();
  return published;
}

export async function readPublicProfile(
  id: string,
  surface: PublicSurface = "website",
): Promise<ProfileSnapshot | null> {
  if (id !== "main" && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
    return null;
  return readSnapshot("id", id, surface);
}

export async function readPublicProfileByUsername(
  username: string,
  surface: PublicSurface = "website",
): Promise<ProfileSnapshot | null> {
  if (!usernameSchema.safeParse(username).success) return null;
  return readSnapshot("username", username, surface);
}

async function readSnapshot(
  field: "id" | "username",
  value: string,
  surface: PublicSurface,
): Promise<ProfileSnapshot | null> {
  const client = discoveryClient();
  if (!client) return null;
  const { data, error } = await client
    .from(surface === "cv" ? "portfolio_public_cvs" : "portfolio_publications")
    .select("id, username, document, revision, updated_at")
    .eq(field, value)
    .maybeSingle();
  if (error) throw new ProfileSetupError();
  return data
    ? {
        id: data.id,
        isPublic: true,
        profile: validatePublicProfile(data.document),
        revision: data.revision,
        updatedAt: data.updated_at,
        username: data.username,
      }
    : null;
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
      .from("portfolio_publications")
      .select("username, updated_at")
      .eq("visibility", "public")
      .order("username")
      .range(offset, offset + 999);
    if (error) throw new ProfileSetupError();
    for (const row of data ?? []) {
      if (usernameSchema.safeParse(row.username).success)
        links.push({
          updatedAt: row.updated_at,
          username: row.username as string,
        });
    }
    if ((data?.length ?? 0) < 1000) return links;
  }
  // Fail visibly rather than silently dropping published portfolios.
  throw new Error("Sitemap needs partitioning before 50,000 published portfolios.");
}

/** Alias lookup never reads a draft or returns an unpublished destination. */
export async function resolvePublishedUsername(
  username: string,
): Promise<{ id: string; username: string } | null> {
  if (!usernameSchema.safeParse(username).success) return null;
  const client = discoveryClient();
  if (!client) return null;
  const { data, error } = await client.rpc("resolve_published_username", {
    requested_username: username,
  });
  if (error) throw new ProfileSetupError();
  const resolved = data?.[0];
  if (!resolved || !usernameSchema.safeParse(resolved.username).success) return null;
  return resolved;
}

/** Only the existence of an explicitly published password gate is public. */
export async function readPortfolioAccessStatus(
  username: string,
): Promise<{ id: string; username: string } | null> {
  if (!usernameSchema.safeParse(username).success) return null;
  const client = discoveryClient();
  if (!client) return null;
  const { data, error } = await client.rpc("portfolio_access_status", {
    requested_username: username,
  });
  if (error) throw new ProfileSetupError();
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    typeof data.id !== "string" ||
    (data.id !== "main" && !z.uuid().safeParse(data.id).success) ||
    data.username !== username
  )
    return null;
  return { id: data.id, username };
}
