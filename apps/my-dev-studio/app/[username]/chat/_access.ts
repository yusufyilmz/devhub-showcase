import { createPremiumPortfolioChat } from "@shared/assistant/premium-chat";

import { env } from "@/env";

export const { premiumChatAccount, premiumChatAvailable, answerPremiumChat } =
  createPremiumPortfolioChat({
    configured: () => Boolean(env.OPENAI_API_KEY && env.REDIS_URL && env.REDIS_TOKEN),
  });
