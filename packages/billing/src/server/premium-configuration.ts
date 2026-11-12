import { env } from "@shared/env";
/** Presence only: this does not probe providers or prove working credentials. */
export function premiumAiConfigured() {
  return Boolean(
    env.OPENAI_API_KEY && env.REDIS_URL && env.REDIS_TOKEN && env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
