import { createMainPortfolioChat } from "@shared/assistant/chat";

import { env } from "@/env";

export const { requireMainPortfolioChat, assertCurrentPublication } = createMainPortfolioChat({
  configured: () => Boolean(env.OPENAI_API_KEY && env.REDIS_URL && env.REDIS_TOKEN),
});
