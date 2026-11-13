export const variants: Record<string, string> = {
  brand: "border-primary/20 bg-primary/8 text-foreground",
  danger: "border-red-500/20 bg-red-500/8 text-red-800 dark:text-red-200",
  info: "border-sky-500/20 bg-sky-500/8 text-sky-800 dark:text-sky-200",
  neutral: "border-border bg-muted text-foreground",
  success: "border-emerald-500/20 bg-emerald-500/8 text-emerald-800 dark:text-emerald-200",
  warning: "border-amber-500/20 bg-amber-500/8 text-amber-900 dark:text-amber-200",
};
export const sizes = {
  l: "px-3 py-1.5 text-sm",
  m: "px-2 py-1 text-xs",
  s: "px-1.5 py-0.5 text-xs",
};

export function tagClassName(...values: unknown[]): string {
  return `inline-flex items-center rounded-full border font-medium ${values[0]} ${values[1]}`;
}
