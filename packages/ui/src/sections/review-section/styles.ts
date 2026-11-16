export const reviewSectionStyles = {
  card: "flex h-full flex-col overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-xl border-border bg-card shadow-none",
  empty: "rounded-xl border border-dashed border-border bg-card p-6",
  label: "text-xs font-medium text-muted-foreground",
  quote: "mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed",
} as const;
