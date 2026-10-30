import { logger } from "@shared/lib/logger";
import { getPortfolioResources } from "@shared/lib/portfolio";
import { ReferralService } from "@shared/lib/services";
import { createServerClient } from "@shared/lib/supabase";
import type { PageResources } from "@shared/lib/types";

import { getPublishedProfile } from "./published-profile";

export const loadPageResources = async (): Promise<PageResources> => {
  const { profile } = await getPublishedProfile();
  const resources = getPortfolioResources(profile);
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  )
    return resources;
  try {
    const client = await createServerClient();
    resources.referrals = await new ReferralService(logger, client).getAll();
  } catch (error) {
    logger.warn({ error }, "Testimonials are temporarily unavailable");
  }
  return resources;
};
