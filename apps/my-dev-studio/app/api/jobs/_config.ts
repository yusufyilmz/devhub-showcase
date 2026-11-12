import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

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
