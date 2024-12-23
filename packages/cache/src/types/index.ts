export type CacheValue = string | number | Buffer

export interface CacheClient {
  set: (key: string, value: CacheValue) => Promise<void>
  get: (key: string) => Promise<string | null>
  expire: (key: string, ttl: number) => Promise<void>
}
