export const sizes = { l: "size-3", m: "size-2.5", s: "size-2" };
export const colors: Record<string, string> = {
  blue: "bg-sky-500",
  gray: "bg-slate-400",
  green: "bg-emerald-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  yellow: "bg-amber-400",
};

export function statusIndicatorClassName(...values: unknown[]): string {
  return `inline-block rounded-full ${values[0]} ${values[1]}`;
}
