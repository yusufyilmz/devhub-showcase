export const sizes = { l: "size-3", m: "size-2.5", s: "size-2" };
const palette = {
  blue: "bg-sky-600 dark:bg-sky-400",
  gray: "bg-slate-600 dark:bg-slate-400",
  green: "bg-emerald-600 dark:bg-emerald-400",
  orange: "bg-orange-600 dark:bg-orange-400",
  red: "bg-red-600 dark:bg-red-400",
  yellow: "bg-amber-600 dark:bg-amber-400",
};

export const colors: Record<string, string> & typeof palette = palette;

export function statusIndicatorClassName(size: string, color: string): string {
  return `inline-block shrink-0 rounded-full ${size} ${color}`;
}
