import { createProfileHistory } from "@shared/lib/profile-history";

import { requireWorkspace } from "@/features/admin/admin-auth";
import { managedRepository } from "@/features/management/managed-portfolios";

export const { readProfileHistory } = createProfileHistory({
  workspace: (id) => (id ? managedRepository(id) : requireWorkspace()),
});
