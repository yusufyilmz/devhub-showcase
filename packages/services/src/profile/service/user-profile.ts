import { createEmptyProfile } from "@shared/lib/profiles";
import type { Json, SupabaseDbClient } from "@shared/lib/types";

import { ProfileSetupError } from "../repository";
import { SupabaseProfileRepository } from "../repository/supabase";

/** Resolve identity from the verified session, never from a request body or email. */
export async function ensureUserProfile(
  client: SupabaseDbClient,
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> },
) {
  const find = () =>
    client.from("portfolio_profiles").select("id").eq("owner_id", user.id).maybeSingle();
  const existing = await find();
  if (existing.error) throw new ProfileSetupError();
  if (existing.data) return new SupabaseProfileRepository(client, existing.data.id);
  const id = crypto.randomUUID();
  const { error } = await client.from("portfolio_profiles").insert({
    document: createEmptyProfile(user) as unknown as Json,
    id,
    owner_id: user.id,
  });
  if (error) {
    // A parallel callback/tab may have created this user's unique profile first.
    if (error.code !== "23505") throw new ProfileSetupError();
    const winner = await find();
    if (winner.error || !winner.data) throw new ProfileSetupError();
    return new SupabaseProfileRepository(client, winner.data.id);
  }
  return new SupabaseProfileRepository(client, id);
}
