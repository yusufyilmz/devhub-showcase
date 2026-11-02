export const segmentedControlStyles = {
  element1: "inline-flex rounded-xl border border-main-lightest bg-backgroundColor-card p-1",
} as const;

export function segmentedControlClassName(...values: unknown[]): string {
  return `rounded-lg px-3 py-1.5 text-sm ${values[0]}`;
}
