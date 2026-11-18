import { createPortfolioResourceLoader } from "@shared/lib/portfolio-resources";
import { logger } from "@shared/utils/logger";

import { env } from "@/env";
import { getPublishedProfile } from "@/services/cv/get-published-profile";
import { portfolioAccessServer } from "@/services/portfolio/get-access-session";

export const loadPageResources = createPortfolioResourceLoader({
  configured: () => Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  getPublishedProfile,
  logger,
  portfolioAccessServer,
});
