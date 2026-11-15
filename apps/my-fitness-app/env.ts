import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const text = z.string().min(1).optional();
const url = z.url().optional();
const flag = z.enum(["true", "false"]).optional();

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
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
  server: {
    APP_URL: url,
    APPLICATION_NAME: text,
    CHAT_V2_DEBUG: text,
    CRON_SECRET: text,
    FITNESS_ADDITIONAL_ORIGIN: url,
    LOG_LEVEL: text,
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    OPENAI_API_KEY: text,
    OPENAI_FITNESS_AGENT_ID: text,
    OPENAI_FITNESS_INSTRUCTIONS: text,
    OPENAI_FITNESS_MODEL: text,
    OPENAI_NOTIFICATIONS_AGENT_ID: text,
    OPENAI_NOTIFICATIONS_INSTRUCTIONS: text,
    OPENAI_NOTIFICATIONS_MODEL: text,
    REDIS_TOKEN: text,
    REDIS_URL: url,
    SUPABASE_DB_URL: url,
    WEB_PUSH_PRIVATE_KEY: text,
    WEB_PUSH_PUBLIC_KEY: text,
    WEB_PUSH_SUBJECT: text,
  },
});
