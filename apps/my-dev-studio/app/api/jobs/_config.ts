import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { RedisCacheClient } from "@shared/lib/cache";
import type { Database } from "@shared/lib/types";

import { env } from "../../../env";

export function jobsServiceClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Job storage unavailable.");
  }
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function jobProviders() {
  return {
    adzuna:
      env.ADZUNA_APP_ID && env.ADZUNA_APP_KEY
        ? { appId: env.ADZUNA_APP_ID, key: env.ADZUNA_APP_KEY }
        : undefined,
    joobleKeys: z
      .record(z.string().regex(/^[a-z]{2}$/), z.string().min(1))
      .parse(JSON.parse(env.JOOBLE_COUNTRY_KEYS ?? "{}")),
  };
}

export function jobsPushConfig() {
  const {
    JOB_PUSH_SUBJECT: subject,
    JOB_PUSH_PUBLIC_KEY: publicKey,
    JOB_PUSH_PRIVATE_KEY: privateKey,
  } = env;
  return subject && publicKey && privateKey ? { privateKey, publicKey, subject } : null;
}

export function providerDailyLimit(source: "adzuna" | "jooble") {
  return Math.min(
    100_000,
    Number((source === "adzuna" ? env.ADZUNA_DAILY_LIMIT : env.JOOBLE_DAILY_LIMIT) ?? 100),
  );
}

export function jobAlertConfig() {
  const domain = env.JOB_ALERT_DOMAIN?.trim().toLowerCase();
  const secret = env.JOB_ALERT_RELAY_SECRET;
  return domain &&
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain) &&
    secret &&
    secret.length >= 32
    ? { domain, secret }
    : null;
}

export function adzunaCacheTtl() {
  return Math.min(86_400, Number(env.ADZUNA_CACHE_TTL_SECONDS ?? 14_400));
}

export function adzunaCache() {
  if (!env.REDIS_URL || !env.REDIS_TOKEN || !adzunaCacheTtl()) return null;
  return new RedisCacheClient("mydevstudio:jobs:adzuna:v1");
}
