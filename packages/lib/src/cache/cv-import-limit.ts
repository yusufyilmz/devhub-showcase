import { Redis } from "@upstash/redis";

// Atomic counters with expiry; no CV content is stored in Redis.
export const cvImportLimitScript = `
local personal = redis.call('INCR', KEYS[1])
if personal == 1 then redis.call('EXPIRE', KEYS[1], 3600) end
if personal > 3 then return 0 end
local total = redis.call('INCR', KEYS[2])
if total == 1 then redis.call('EXPIRE', KEYS[2], 86400) end
if total > tonumber(ARGV[1]) then return 0 end
return 1`;
export async function allowCvImport(userId: string) {
  const redis = new Redis({ token: process.env.REDIS_TOKEN, url: process.env.REDIS_URL });
  const configured = Number(process.env.CV_IMPORT_DAILY_LIMIT || 100);
  const dailyLimit = Number.isInteger(configured) && configured > 0 ? configured : 100;
  const result = await redis.eval(
    cvImportLimitScript,
    [`cv-import:user:${userId}`, "cv-import:global"],
    [dailyLimit],
  );
  return result === 1;
}
