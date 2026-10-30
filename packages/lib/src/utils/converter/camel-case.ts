export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());
}
export function keysToCamelCase<T>(obj: unknown): T {
  if (Array.isArray(obj)) return obj.map((value) => keysToCamelCase(value)) as T;
  if (obj !== null && typeof obj === "object" && Object.getPrototypeOf(obj) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [toCamelCase(key), keysToCamelCase(value)]),
    ) as T;
  }
  return obj as T;
}
