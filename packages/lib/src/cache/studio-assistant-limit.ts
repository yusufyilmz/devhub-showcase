import { Redis } from "@upstash/redis";

import { env } from "@shared/env";

export const studioLimitScript = `
local personal=redis.call('INCR',KEYS[1])
if personal==1 then redis.call('EXPIRE',KEYS[1],3600) end
if personal>10 then return 0 end
local total=redis.call('INCR',KEYS[2])
if total==1 then redis.call('EXPIRE',KEYS[2],86400) end
if total>100 then return 0 end
return 1`;
async function allowAssistant(scope: string, account: string) {
  const redis = new Redis({ token: env.REDIS_TOKEN, url: env.REDIS_URL });
  return (
    (await redis.eval(studioLimitScript, [`${scope}:user:${account}`, `${scope}:global`], [])) === 1
  );
}

export function allowStudioAssistant(account: string) {
  return allowAssistant("studio-assistant", account);
}

export function allowFitnessAssistant(account: string) {
  return allowAssistant("fitness-assistant", account);
}
