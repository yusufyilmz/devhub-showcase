import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const text = z.string().min(1).optional();
const url = z.url().optional();
const flag = z.enum(["true", "false"]).optional();
const positiveInteger = z
  .string()
  .regex(/^[1-9]\d*$/)
  .optional();

// Missing integrations remain optional; feature code checks availability.
export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: url,
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
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
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
  },
  server: {
    APPLICATION_NAME: text,
    CHAT_V2_DEBUG: text,
    CRON_SECRET: text,
    CV_IMPORT_DAILY_LIMIT: positiveInteger,
    GOOGLE_PROFILE_CLIENT_ID: text,
    LOCAL_TEST_EMAIL: z.email().optional(),
    LOCAL_TEST_LOGIN: flag,
    LOCAL_TEST_PASSWORD: text,
    LOG_LEVEL: text,
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
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
    OPENAI_JOB_AGENT_ID: text,
    OPENAI_JOB_INSTRUCTIONS: text,
    OPENAI_JOB_MODEL: text,
    OPENAI_MODEL: text,
    REDIS_TOKEN: text,
    REDIS_URL: url,
    STRIPE_PRO_CHAT_LIMIT: positiveInteger,
    STRIPE_PRO_EDITOR_LIMIT: positiveInteger,
    STRIPE_PRO_PRICE_ID: text,
    STRIPE_SECRET_KEY: text,
    STRIPE_WEBHOOK_SECRET: text,
    SUPABASE_SERVICE_ROLE_KEY: text,
  },
});
