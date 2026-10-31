import { Redis } from "@upstash/redis";
export const studioLimitScript = `
local personal=redis.call('INCR',KEYS[1])
if personal==1 then redis.call('EXPIRE',KEYS[1],3600) end
if personal>10 then return 0 end
local total=redis.call('INCR',KEYS[2])
if total==1 then redis.call('EXPIRE',KEYS[2],86400) end
if total>100 then return 0 end
return 1`;
export async function allowStudioAssistant(account: string) {
  const redis = new Redis({ token: process.env.REDIS_TOKEN, url: process.env.REDIS_URL });
  return (
    (await redis.eval(
      studioLimitScript,
      [`studio-assistant:user:${account}`, "studio-assistant:global"],
      [],
    )) === 1
  );
}
