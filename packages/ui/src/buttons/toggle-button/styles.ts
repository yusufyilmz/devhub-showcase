export function toggleButtonClassName(...values: unknown[]): string {
  return `rounded-lg px-3 py-1.5 text-sm ${values[0]}`;
}
