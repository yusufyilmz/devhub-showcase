import { Redis } from "@upstash/redis";

const script = `
local visitor = redis.call('INCR', KEYS[1])
if visitor == 1 then redis.call('EXPIRE', KEYS[1], 60) end
if visitor > 10 then return 0 end
local portfolio = redis.call('INCR', KEYS[2])
if portfolio == 1 then redis.call('EXPIRE', KEYS[2], 3600) end
if portfolio > 100 then return 0 end
local global = redis.call('INCR', KEYS[3])
if global == 1 then redis.call('EXPIRE', KEYS[3], 86400) end
if global > 500 then return 0 end
return 1`;
export async function allowPortfolioChat(profileId: string, sessionId: string) {
  const redis = new Redis({ token: process.env.REDIS_TOKEN, url: process.env.REDIS_URL });
  return (
    (await redis.eval(
      script,
      [
        `mydevstudio:chat:${profileId}:${sessionId}`,
        `mydevstudio:chat:${profileId}`,
        "mydevstudio:chat:global",
      ],
      [],
    )) === 1
  );
}
