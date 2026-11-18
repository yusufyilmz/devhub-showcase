import { createPublicationHandlers } from "@shared/lib/portfolio-publication";

import { requireWorkspace, sameOrigin } from "@/services/admin/get-auth";
import { managedRepository } from "@/services/management/get-portfolios";
import { portfolioAccessServer } from "@/services/portfolio/get-access-session";

export const { publicationStatus, changePublication } = createPublicationHandlers({
  portfolioAccessServer,
  sameOrigin,
  workspace: (id) => (id ? managedRepository(id) : requireWorkspace()),
});
