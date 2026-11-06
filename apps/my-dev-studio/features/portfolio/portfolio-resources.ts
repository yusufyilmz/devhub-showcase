import type { PageResources } from "@shared/lib/types";
import { getPortfolioResources } from "@shared/services/portfolio";
import { ReferralService } from "@shared/services/studio";
import { logger } from "@shared/utils/logger";

import { portfolioAccessServer } from "./access/server-access";
import { getPublishedProfile } from "./profiles/published-profile";

export const loadPageResources = async (): Promise<PageResources> => {
  const { profile } = await getPublishedProfile();
  const resources = getPortfolioResources(profile);
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    return resources;
  try {
    const { client } = portfolioAccessServer();
    resources.referrals = await new ReferralService(logger, client).getAll();
  } catch (error) {
    logger.warn({ error }, "Testimonials are temporarily unavailable");
  }
  return resources;
};
