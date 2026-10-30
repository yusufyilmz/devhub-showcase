import { requireConfirmedUser } from "@shared/auth";
import type { PortfolioProfile } from "@shared/content";
import { saveProfileSchema } from "@shared/lib/profile";
import {
  ProfileAccessError,
  ProfileConflictError,
  ProfileSetupError,
  ProfileUsernameError,
} from "@shared/lib/profile-errors";
import { SupabaseProfileRepository } from "@shared/lib/profile-repository";
import { createServerClient } from "@shared/lib/supabase";
import type { Json, SupabaseDbClient } from "@shared/lib/types";
import { z } from "zod";

export const managedId = z.uuid();
export async function isPortfolioAdmin(client: SupabaseDbClient) {
  const { data, error } = await client.rpc("is_portfolio_admin", {});
  return !error && data === true;
}
export async function requirePortfolioAdmin() {
  const client = await createServerClient();
  const user = await requireConfirmedUser(
    client,
    () => new ProfileAccessError(),
  );
  if (!(await isPortfolioAdmin(client))) throw new ProfileAccessError();
  return { client, user };
}
export async function managedRepository(
  id: string,
  provided?: Awaited<ReturnType<typeof requirePortfolioAdmin>>,
) {
  managedId.parse(id);
  const admin = provided ?? (await requirePortfolioAdmin());
  const { data, error } = await admin.client
    .from("portfolio_profiles")
    .select("id")
    .eq("id", id)
    .eq("managed_by", admin.user.id)
    .is("owner_id", null)
    .maybeSingle();
  if (error) throw new ProfileSetupError();
  if (!data) throw new ProfileAccessError();
  return {
    ...admin,
    repository: new SupabaseProfileRepository(admin.client, id),
  };
}
export async function saveManaged(id: string, input: unknown) {
  const { repository } = await managedRepository(id);
  const data = saveProfileSchema.parse(input);
  const saved = await repository.save(
    data.profile,
    data.revision,
    data.isPublic,
    data.username,
  );
  if (!saved) throw new ProfileConflictError();
  return saved;
}
export async function createManaged(
  admin: Awaited<ReturnType<typeof requirePortfolioAdmin>>,
  username: string,
  profile: PortfolioProfile,
) {
  const { data, error } = await admin.client
    .from("portfolio_profiles")
    .insert({
      owner_id: null,
      managed_by: admin.user.id,
      username,
      document: profile as unknown as Json,
    })
    .select("id")
    .single();
  if (error?.code === "23505") throw new ProfileUsernameError();
  if (error || !data) throw new ProfileSetupError();
  return data;
}
