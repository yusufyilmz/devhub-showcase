import { createPublicationHandlers } from "@shared/lib/portfolio-publication";

import { requireWorkspace, sameOrigin } from "@/features/admin/admin-auth";
import { managedRepository } from "@/features/management/managed-portfolios";

import { portfolioAccessServer } from "../../[username]/access/_session";

export const { publicationStatus, changePublication } = createPublicationHandlers({
  portfolioAccessServer,
  sameOrigin,
  workspace: (id) => (id ? managedRepository(id) : requireWorkspace()),
});
