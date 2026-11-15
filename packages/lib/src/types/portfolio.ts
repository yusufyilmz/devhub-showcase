import type { ProfileRepository } from "../repositories/profile/contract";
import type { SupabaseDbClient } from "./index";

export type PortfolioWorkspace = {
  client: SupabaseDbClient;
  repository: Pick<ProfileRepository, "read">;
};
export type PortfolioAccessServer = { client: SupabaseDbClient; secret: string };

export type ManagedPortfolioAdmin = { client: SupabaseDbClient; user: { id: string } };
