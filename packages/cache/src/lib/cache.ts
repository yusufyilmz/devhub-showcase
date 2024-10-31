import { CacheClient } from '../types'

type CacheValue = string | number | Buffer

export default class CacheStore {
  constructor(private readonly cacheClient: CacheClient) {}

  public async set(
    key: string,
    value: CacheValue,
    ttl: number | false = false
  ): Promise<void> {
    await this.cacheClient.set(key, value)

    if (ttl) {
      await this.cacheClient.expire(key, ttl)
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.cacheClient.get(key)
  }
}
