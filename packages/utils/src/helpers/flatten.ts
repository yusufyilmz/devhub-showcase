/**
 * Flatten utility functions for arrays and objects
 *
 * Usage examples:
 * - flattenArray([1, [2, [3, 4]]]) → [1, 2, 3, 4]
 * - flattenObject({a: {b: 1}}) → {'a.b': 1}
 * - flatten() - works with both arrays and objects
 *
 * Useful for:
 * - Environment variable processing
 * - Menu navigation flattening
 * - Configuration debugging
 * - API response transformation
 */

/**
 * Flatten a nested array into a single-level array
 * @param arr - The nested array to flatten
 * @param depth - Maximum depth to flatten (default: Infinity for complete flattening)
 * @returns Flattened array
 */
export function flattenArray<T>(arr: unknown[], depth: number = Number.POSITIVE_INFINITY): T[] {
  const result: T[] = [];

  function flatten(items: unknown[], currentDepth: number): void {
    for (const item of items) {
      if (Array.isArray(item) && currentDepth > 0) {
        flatten(item, currentDepth - 1);
      } else {
        result.push(item as T);
      }
    }
  }

  flatten(arr, depth);
  return result;
}

/**
 * Flatten a nested object into a single-level object with dot notation keys
 * @param obj - The nested object to flatten
 * @param prefix - Prefix for keys (used internally for recursion)
 * @param separator - Separator for nested keys (default: '.')
 * @returns Flattened object
 */
export function flattenObject(
  obj: Record<string, any>,
  prefix = "",
  separator = ".",
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}${separator}${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(result, flattenObject(value, newKey, separator));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * Unflatten a flattened object back to nested structure
 * @param obj - The flattened object to unflatten
 * @param separator - Separator used in keys (default: '.')
 * @returns Nested object
 */
export function unflattenObject(obj: Record<string, any>, separator = "."): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split(separator);
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (k && !(k in current)) {
        current[k] = {};
      }
      current = k ? (current[k] ?? {}) : {};
    }

    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      current[lastKey] = value;
    }
  }

  return result;
}

/**
 * Flatten environment variables (useful for your multi-tenant setup)
 * Converts nested env config to flat structure
 */
export function flattenEnvVars(envConfig: Record<string, any>): Record<string, string> {
  const flattened = flattenObject(envConfig, "", "_");
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(flattened)) {
    // Convert to uppercase and ensure string values
    const envKey = key.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    result[envKey] = String(value);
  }

  return result;
}

/**
 * Flatten menu items (useful for your navigation structure)
 * Extracts all menu items from nested menu structure
 */
export function flattenMenuItems(menuItems: any[]): any[] {
  const result: any[] = [];

  function extractItems(items: any[]): void {
    for (const item of items) {
      result.push({
        href: item.href,
        icon: item.icon,
        id: item.id,
        title: item.title,
      });

      if (item.children && Array.isArray(item.children)) {
        extractItems(item.children);
      }
    }
  }

  extractItems(menuItems);
  return result;
}

/**
 * Flatten tenant configuration (specific to your multi-tenant setup)
 * Useful for debugging or logging all config values
 */
export function flattenTenantConfig(tenantConfig: Record<string, any>): Record<string, any> {
  return flattenObject(tenantConfig, "TENANT", "_");
}

// Advanced flatten with custom key transformation
export function flattenWithTransform<T = any>(
  obj: Record<string, any>,
  keyTransform?: (key: string, path: string[]) => string,
  valueTransform?: (value: any, path: string[]) => any,
): Record<string, T> {
  const result: Record<string, T> = {};

  function flatten(current: any, path: string[] = []): void {
    for (const [key, value] of Object.entries(current)) {
      const currentPath = [...path, key];

      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        flatten(value, currentPath);
      } else {
        const transformedKey = keyTransform
          ? keyTransform(key, currentPath)
          : currentPath.join(".");
        const transformedValue = valueTransform ? valueTransform(value, currentPath) : value;

        result[transformedKey] = transformedValue as T;
      }
    }
  }

  flatten(obj);
  return result;
}

// Export a default flatten that works with both arrays and objects
export function flatten<T>(
  input: T[] | Record<string, any>,
  options?: {
    depth?: number;
    separator?: string;
    keyTransform?: (key: string, path: string[]) => string;
    valueTransform?: (value: any, path: string[]) => any;
  },
): any {
  if (Array.isArray(input)) {
    return flattenArray(input, options?.depth);
  }

  if (typeof input === "object" && input !== null) {
    return options?.keyTransform || options?.valueTransform
      ? flattenWithTransform(input, options.keyTransform, options.valueTransform)
      : flattenObject(input, "", options?.separator);
  }

  return input;
}

export { flatten as flattenFlat } from "flat";
