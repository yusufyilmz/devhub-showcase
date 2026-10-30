import { Redis } from "@upstash/redis";

import type { CacheClient, CacheValue } from "../types";

export class RedisCacheClient implements CacheClient {
  private readonly client: Redis;
  private readonly keyPrefix: string;

  constructor(keyPrefix = "devhub-showcase") {
    this.client = new Redis({
      token: process.env.REDIS_TOKEN,
      url: process.env.REDIS_URL,
    });
    this.keyPrefix = keyPrefix;
  }

  private withPrefix(key: string): string {
    return `${this.keyPrefix}:${key}`;
  }

  async set(key: string, value: CacheValue, ttl = 0): Promise<void> {
    await this.client.set(this.withPrefix(key), value, ttl ? { ex: ttl } : undefined);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(this.withPrefix(key));
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.client.expire(this.withPrefix(key), ttl);
  }

  async incr(key: string): Promise<number> {
    return await this.client.incr(this.withPrefix(key));
  }
}
