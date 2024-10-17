import { Redis } from 'ioredis'

type CacheValue = string | number | Buffer

type CacheStoreOptions = {
  ttl: number
}

export class CacheStore {
  ttl: number
  private readonly redisClient: Redis
  constructor({
    ttl
  }: CacheStoreOptions) {
    this.redisClient = new Redis(process.env.REDIS_URL, {
      keyPrefix: 'tag-resources-'
    })
    this.ttl = ttl
  }

  public async set(
    key: string,
    value: CacheValue,
  ): Promise<void> {
    await this.redisClient.set(key, value)

    if (this.ttl) {
      await this.redisClient.expire(key, this.ttl)
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key)
  }
}
