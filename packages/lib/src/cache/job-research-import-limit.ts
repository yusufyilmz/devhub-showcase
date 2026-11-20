import { Redis } from "@upstash/redis";

import { env } from "@shared/env";

export const jobResearchImportLimitScript = `
local personal = redis.call('INCR', KEYS[1])
if personal == 1 then redis.call('EXPIRE', KEYS[1], 3600) end
if personal > 20 then return 0 end
local total = redis.call('INCR', KEYS[2])
if total == 1 then redis.call('EXPIRE', KEYS[2], 86400) end
if total > 500 then return 0 end
return 1`;

export async function allowJobResearchImport(userId: string) {
  const hosted = env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "production";
  if (!env.REDIS_URL || !env.REDIS_TOKEN) return !hosted;
  const redis = new Redis({ token: env.REDIS_TOKEN, url: env.REDIS_URL });
  const result = await redis.eval(
    jobResearchImportLimitScript,
    [`jobs-chatgpt-import:user:${userId}`, "jobs-chatgpt-import:global"],
    [],
  );
  return result === 1;
}
