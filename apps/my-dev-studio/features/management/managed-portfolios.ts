import { requireConfirmedUser } from "@shared/auth";
import { createManagedPortfolioService, isPortfolioAdmin } from "@shared/lib/managed-portfolios";
import { ProfileAccessError } from "@shared/lib/profile";
import { createServerClient } from "@shared/lib/supabase";

export { isPortfolioAdmin, managedId } from "@shared/lib/managed-portfolios";

export async function requirePortfolioAdmin() {
  const client = await createServerClient();
  const user = await requireConfirmedUser(client, () => new ProfileAccessError());
  if (!(await isPortfolioAdmin(client))) throw new ProfileAccessError();
  return { client, user };
}

export const { managedRepository, saveManaged, createManaged } =
  createManagedPortfolioService(requirePortfolioAdmin);
