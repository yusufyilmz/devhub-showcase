import { CacheService } from '@shared/cache'
import { copy } from '@shared/content'

export class RateLimiter {
  constructor(
    private readonly cacheClient: CacheService = new CacheService(),
    private readonly limit: number = 10,
    private readonly windowSeconds: number = 60
  ) {
    this.cacheClient = cacheClient
    this.limit = limit
    this.windowSeconds = windowSeconds
  }

  public async isAllowed(userId: string): Promise<void> {
    const key = `rate_limit:${userId}`

    const currentCountStr = await this.cacheClient.has(key)

    if (!currentCountStr) {
      await this.cacheClient.set(key, '1', this.windowSeconds)

      return
    }

    const newCount = await this.cacheClient.incr(key)

    if (newCount > this.limit) {
      throw new Error(copy.notifications.errors.tooManyRequests)
    }
  }
}
