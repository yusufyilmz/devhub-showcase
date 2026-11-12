import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const text = z.string().min(1).optional();
const url = z.url().optional();
const flag = z.enum(["true", "false"]).optional();
const positiveInteger = z
  .string()
  .regex(/^[1-9]\d*$/)
  .optional();

const redisToken = z.string().trim().min(1, "Set REDIS_TOKEN to the Redis REST token.");
const redisUrl = z.url({
  error: "Set REDIS_URL to the HTTPS Redis REST URL.",
  protocol: /^https$/,
});

const client = {
  NEXT_PUBLIC_API_URL: url,
  NEXT_PUBLIC_APP_NAME: text,
  NEXT_PUBLIC_CHAT_V2_DEBUG: text,
  NEXT_PUBLIC_ENABLE_LOGGING: flag,
  NEXT_PUBLIC_LOG_LEVEL: text,
  NEXT_PUBLIC_LOG_PREFIX: text,
  NEXT_PUBLIC_LOG_STRING_OUTPUT: flag,
  NEXT_PUBLIC_PROJECT_URL: url,
  NEXT_PUBLIC_SITE_URL: url,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: text,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: text,
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_TRELLO_API_KEY: text,
  NEXT_PUBLIC_TRELLO_API_TOKEN: text,
};
const server = {
  ADZUNA_APP_ID: text,
  ADZUNA_APP_KEY: text,
  ADZUNA_CACHE_TTL_SECONDS: z.string().regex(/^\d+$/).optional(),
  ADZUNA_DAILY_LIMIT: positiveInteger,
  APP_URL: url,
  APPLICATION_NAME: text,
  CHAT_V2_DEBUG: text,
  CI: text,
  CRON_SECRET: text,
  CV_IMPORT_DAILY_LIMIT: positiveInteger,
  ENVIRONMENT: text,
  FITNESS_ADDITIONAL_ORIGIN: url,
  GITHUB_EVENT_NAME: text,
  GITHUB_EVENT_PATH: text,
  GITHUB_OUTPUT: text,
  GITHUB_SHA: text,
  GITHUB_STEP_SUMMARY: text,
  GOOGLE_PROFILE_CLIENT_ID: text,
  JOB_ALERT_DOMAIN: text,
  JOB_ALERT_RELAY_SECRET: text,
  JOB_PUSH_PRIVATE_KEY: text,
  JOB_PUSH_PUBLIC_KEY: text,
  JOB_PUSH_SUBJECT: text,
  JOOBLE_COUNTRY_KEYS: text,
  JOOBLE_DAILY_LIMIT: positiveInteger,
  LOCAL_TEST_EMAIL: z.email().optional(),
  LOCAL_TEST_LOGIN: flag,
  LOCAL_TEST_PASSWORD: text,
  LOG_LEVEL: text,
  OPENAI_API_KEY: text,
  OPENAI_CHAT_AGENT_ID: text,
  OPENAI_CHAT_INSTRUCTIONS: text,
  OPENAI_CHAT_MODEL: text,
  OPENAI_CV_AGENT_ID: text,
  OPENAI_CV_INSTRUCTIONS: text,
  OPENAI_CV_MODEL: text,
  OPENAI_EDITOR_AGENT_ID: text,
  OPENAI_EDITOR_INSTRUCTIONS: text,
  OPENAI_EDITOR_MODEL: text,
  OPENAI_FITNESS_AGENT_ID: text,
  OPENAI_FITNESS_INSTRUCTIONS: text,
  OPENAI_FITNESS_MODEL: text,
  OPENAI_JOB_AGENT_ID: text,
  OPENAI_JOB_INSTRUCTIONS: text,
  OPENAI_JOB_MODEL: text,
  OPENAI_MODEL: text,
  OPENAI_NOTIFICATIONS_AGENT_ID: text,
  OPENAI_NOTIFICATIONS_INSTRUCTIONS: text,
  OPENAI_NOTIFICATIONS_MODEL: text,
  REDIS_TOKEN: redisToken.optional(),
  REDIS_URL: redisUrl.optional(),
  SITE: text,
  STRIPE_PRO_CHAT_LIMIT: positiveInteger,
  STRIPE_PRO_EDITOR_LIMIT: positiveInteger,
  STRIPE_PRO_PRICE_ID: text,
  STRIPE_SECRET_KEY: text,
  STRIPE_WEBHOOK_SECRET: text,
  SUPABASE_DB_URL: url,
  SUPABASE_SERVICE_ROLE_KEY: text,
  TRELLO_API_KEY: text,
  TRELLO_API_TOKEN: text,
  VERCEL_ENV: text,
  WEB_PUSH_PRIVATE_KEY: text,
  WEB_PUSH_PUBLIC_KEY: text,
  WEB_PUSH_SUBJECT: text,
};

export function createAppEnv({ requireHostedRedis = false } = {}) {
  const deployment = process.env.VERCEL_ENV;
  const redisRequired =
    requireHostedRedis && (deployment === "preview" || deployment === "production");
  return createEnv({
    client,
    emptyStringAsUndefined: true,
    experimental__runtimeEnv: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_CHAT_V2_DEBUG: process.env.NEXT_PUBLIC_CHAT_V2_DEBUG,
      NEXT_PUBLIC_ENABLE_LOGGING: process.env.NEXT_PUBLIC_ENABLE_LOGGING,
      NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
      NEXT_PUBLIC_LOG_PREFIX: process.env.NEXT_PUBLIC_LOG_PREFIX,
      NEXT_PUBLIC_LOG_STRING_OUTPUT: process.env.NEXT_PUBLIC_LOG_STRING_OUTPUT,
      NEXT_PUBLIC_PROJECT_URL: process.env.NEXT_PUBLIC_PROJECT_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_TRELLO_API_KEY: process.env.NEXT_PUBLIC_TRELLO_API_KEY,
      NEXT_PUBLIC_TRELLO_API_TOKEN: process.env.NEXT_PUBLIC_TRELLO_API_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
    },
    server: {
      ...server,
      REDIS_TOKEN: redisRequired ? redisToken : server.REDIS_TOKEN,
      REDIS_URL: redisRequired ? redisUrl : server.REDIS_URL,
    },
    shared: { NODE_ENV: z.enum(["development", "test", "production"]).default("development") },
  });
}

type AppEnv = ReturnType<typeof createAppEnv>;
let current: AppEnv | undefined;
const readAgain = process.env.NODE_ENV === "test";

// App entry points validate immediately. Shared libraries resolve settings on first use.
export const env: AppEnv = new Proxy({} as AppEnv, {
  get(_target, key: keyof AppEnv) {
    if (readAgain) return createAppEnv()[key];
    current ??= createAppEnv();
    return current[key];
  },
});
