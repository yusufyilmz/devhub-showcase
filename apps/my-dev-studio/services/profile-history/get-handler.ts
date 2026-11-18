import { createProfileHistory } from "@shared/lib/profile-history";

import { requireWorkspace } from "@/services/admin/get-auth";
import { managedRepository } from "@/services/management/get-portfolios";

export const { readProfileHistory } = createProfileHistory({
  workspace: (id) => (id ? managedRepository(id) : requireWorkspace()),
});
