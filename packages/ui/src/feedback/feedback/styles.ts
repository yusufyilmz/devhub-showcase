export const variants = {
  danger: "border-red-500/40 bg-red-500/10",
  info: "border-sky-500/40 bg-sky-500/10",
  success: "border-emerald-500/40 bg-emerald-500/10",
  warning: "border-amber-400/40 bg-amber-400/10",
};

export const feedbackStyles = {
  element1: "flex-1",
  element2: "font-medium",
  element3: "text-sm text-textColor-secondary",
  element4: "text-textColor-secondary",
} as const;

export function feedbackClassName(...values: unknown[]): string {
  return `flex w-full gap-3 rounded-xl border p-4 text-textColor-primary ${values[0]}`;
}
