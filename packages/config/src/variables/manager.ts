/**
 * Utility: coerce env values into correct type (boolean/number/string)
 */
function coerceEnvValue<T extends string | number | boolean>(defaultVal: T, envVal: string): T {
  if (typeof defaultVal === "boolean") {
    return (envVal === "true" || envVal === "1") as T;
  }
  if (typeof defaultVal === "number") {
    const num = Number(envVal);
    return (Number.isNaN(num) ? defaultVal : num) as T;
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
