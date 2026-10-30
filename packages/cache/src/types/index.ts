export type CacheValue = string | number | Buffer;

export interface CacheClient {
  expire: (key: string, ttl: number) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: CacheValue) => Promise<void>;
}
