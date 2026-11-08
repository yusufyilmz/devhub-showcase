import type { Logger } from "@shared/utils/logger";

import type { PageResources } from "../../types/index";
import type { PortfolioAccessServer, PortfolioWorkspace } from "../../types/portfolio";
import { ReferralService } from "../studio/index";
import { getPortfolioResources } from "./index";

export function createPortfolioResourceLoader({
  getPublishedProfile,
  portfolioAccessServer,
  configured,
  logger,
}: {
  getPublishedProfile: PortfolioWorkspace["repository"]["read"];
  portfolioAccessServer: () => PortfolioAccessServer;
  configured: () => boolean;
  logger: Logger;
}) {
  const loadPageResources = async (): Promise<PageResources> => {
    const snapshot = await getPublishedProfile();
    if (!snapshot) throw new Error("Profile unavailable.");
    const { profile } = snapshot;
    const resources = getPortfolioResources(profile);
    if (!configured()) return resources;
    try {
      const { client } = portfolioAccessServer();
      resources.referrals = await new ReferralService(logger, client).getAll();
    } catch (error) {
      logger.warn({ error }, "Testimonials are temporarily unavailable");
    }
    return resources;
  };

  return loadPageResources;
}
