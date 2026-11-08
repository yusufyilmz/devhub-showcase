export const radioButtonStyles = {
  element1: "size-4 accent-[var(--primary)]",
} as const;

export function radioButtonClassName(...values: unknown[]): string {
  return `inline-flex items-center gap-3 text-sm ${values[0]}`;
}
