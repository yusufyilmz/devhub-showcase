import type { PortfolioProfile } from "@shared/config";

import type { Json, SupabaseDbClient } from "../../types/index";
import type { ManagedPortfolioAdmin } from "../../types/portfolio";
import { ProfileAccessError, ProfileSetupError, ProfileUsernameError } from "../profile/contract";
import { SupabaseProfileRepository } from "../profile/index";

export async function isPortfolioAdmin(client: SupabaseDbClient) {
  const { data, error } = await client.rpc("is_portfolio_admin", {});
  return !error && data === true;
}

export async function findManagedPortfolio(id: string, admin: ManagedPortfolioAdmin) {
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

export async function createManaged(
  admin: ManagedPortfolioAdmin,
  username: string,
  profile: PortfolioProfile,
) {
  const { data, error } = await admin.client
    .from("portfolio_profiles")
    .insert({
      document: profile as unknown as Json,
      managed_by: admin.user.id,
      owner_id: null,
      username,
    })
    .select("id")
    .single();
  if (error?.code === "23505") throw new ProfileUsernameError();
  if (error || !data) throw new ProfileSetupError();
  return data;
}
