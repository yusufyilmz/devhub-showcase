import { SitesConfigFileSchema } from "./schema";
import rawConfig from "./sites-config.json";
import type { SitesConfigFile } from "./types";

/**
 * Utility: coerce env values into correct type (boolean/number/string)
 */
function coerceEnvValue<T extends string | number | boolean>(defaultVal: T, envVal: string): T {
  if (typeof defaultVal === "boolean") {
    return (envVal === "true" || envVal === "1") as T;
  }
  if (typeof defaultVal === "number") {
    const num = Number(envVal);
    return (isNaN(num) ? defaultVal : num) as T;
  }
  return envVal as T;
}

/**
 * Apply environment variable overrides to any config section
 */
export function applyEnvOverrides<T extends Record<string, any>>(obj: T): T {
  const merged: any = { ...obj };
  for (const key of Object.keys(merged)) {
    const envVal = process.env[key] ?? process.env[`NEXT_PUBLIC_${key}`];
    if (envVal !== undefined) {
      merged[key] = coerceEnvValue(merged[key], envVal);
    }
  }
  return merged;
}

/**
 * Singleton SiteConfigManager
 */
class SiteConfigManager {
  private config: SitesConfigFile;

  constructor() {
    const parsedConfig = SitesConfigFileSchema.parse(rawConfig as unknown as SitesConfigFile);
    this.config = parsedConfig as SitesConfigFile;
  }

  /**
   * Proxy getter so you can do siteConfig.KEY
   */
  // public get<K extends keyof SiteConfig>(key: K): SiteConfig[K] {
  //   return this.merged[key]
  // }

  /**
   * Direct access (dot notation, e.g. siteConfig.environment.API_URL)
   */

  public get branding() {
    return this.config.shared.environment;
  }
  public get environment() {
    return this.config.shared.environment;
  }
}

// ---- EXPORT SINGLETON ----
// You can pick siteName dynamically (from DOMAIN, subdomain, etc.)
export const siteConfigManager = new SiteConfigManager();
