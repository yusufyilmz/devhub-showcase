/** Presence only: this does not probe providers or prove working credentials. */
export function premiumAiConfigured() {
  return Boolean(
    process.env.OPENAI_API_KEY &&
      process.env.REDIS_URL &&
      process.env.REDIS_TOKEN &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
