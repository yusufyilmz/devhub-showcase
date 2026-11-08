import { z } from "zod";

import { createManaged, findManagedPortfolio } from "../../repositories/management/index";
import { ProfileConflictError } from "../../repositories/profile/contract";
import { saveProfileSchema } from "../../schemas/profile/index";
import type { ManagedPortfolioAdmin } from "../../types/portfolio";

export { isPortfolioAdmin } from "../../repositories/management/index";
export type { ManagedPortfolioAdmin } from "../../types/portfolio";
export const managedId = z.uuid();

export function createManagedPortfolioService(
  requirePortfolioAdmin: () => Promise<ManagedPortfolioAdmin>,
) {
  async function managedRepository(id: string, provided?: ManagedPortfolioAdmin) {
    managedId.parse(id);
    const admin = provided ?? (await requirePortfolioAdmin());
    return findManagedPortfolio(id, admin);
  }
  async function saveManaged(id: string, input: unknown) {
    const { repository } = await managedRepository(id);
    const data = saveProfileSchema.parse(input);
    const saved = await repository.save(data.profile, data.revision, data.isPublic, data.username);
    if (!saved) throw new ProfileConflictError();
    return saved;
  }
  return { createManaged, managedRepository, saveManaged };
}
