export const accordionStyles = {
  accordionContent: "pt-0 pb-4",
  accordionItem: "border-b last:border-b-0",
  accordionTrigger:
    "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
  element1: "flex",
  element2:
    "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
  element3:
    "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] text-sm",
} as const;

export function accordionBodyClassName(...values: unknown[]): string {
  return `${values[0]} p-5 ${values[1]}`;
}

export function accordionHeaderClassName(...values: unknown[]): string {
  return `flex items-center flex-row justify-between w-full font-medium text-main-white border-b border-main-light-slate ${values[0]}`;
}

export function accordionHeaderClassName2(...values: unknown[]): string {
  return `transform transition-transform ${values[0]}`;
}
