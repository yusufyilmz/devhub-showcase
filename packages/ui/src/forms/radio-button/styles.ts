export const radioButtonStyles = {
  element1:
    "size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
} as const;

export function radioButtonClassName(...values: unknown[]): string {
  return `inline-flex items-center gap-s text-sm ${values[0]}`;
}
