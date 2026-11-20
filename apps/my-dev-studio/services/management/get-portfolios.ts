import { requireConfirmedUser } from "@shared/auth";
import { createManagedPortfolioService, isPortfolioAdmin } from "@shared/lib/managed-portfolios";
import { ProfileAccessError } from "@shared/lib/profile";
import { createServerClient } from "@shared/lib/supabase";
import type { SupabaseDbClient } from "@shared/lib/types";

export { isPortfolioAdmin, managedId } from "@shared/lib/managed-portfolios";

/** Use a previously verified session client; never repeat the home identity lookup. */
export async function portfolioAdminStatus(client: SupabaseDbClient) {
  return isPortfolioAdmin(client);
}

export async function requirePortfolioAdmin() {
  const client = await createServerClient();
  const user = await requireConfirmedUser(client, () => new ProfileAccessError());
  if (!(await isPortfolioAdmin(client))) throw new ProfileAccessError();
  return { client, user };
}

export const { managedRepository, saveManaged, createManaged } =
  createManagedPortfolioService(requirePortfolioAdmin);
