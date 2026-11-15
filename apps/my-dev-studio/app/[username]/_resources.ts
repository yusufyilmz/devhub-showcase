import { createPortfolioResourceLoader } from "@shared/lib/portfolio-resources";
import { logger } from "@shared/utils/logger";

import { env } from "@/env";

import { getPublishedProfile } from "../cv.pdf/_profile";
import { portfolioAccessServer } from "./access/_session";

export const loadPageResources = createPortfolioResourceLoader({
  configured: () => Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  getPublishedProfile,
  logger,
  portfolioAccessServer,
});
