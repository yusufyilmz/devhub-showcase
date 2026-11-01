import type { SupabaseClient } from "@supabase/supabase-js";

import { convertV1Workspace } from "./convert-v1-workspace";
import { stateSchema } from "./v1-model";
export async function loadLegacyWorkspace(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("fitness_workspaces")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (error.code === "PGRST205" || error.code === "42P01") return null;
    throw new Error(
      "Could not check the previous workspace. Import stopped to avoid losing history.",
    );
  }
  return data ? convertV1Workspace(stateSchema.parse(data.data)) : null;
}
