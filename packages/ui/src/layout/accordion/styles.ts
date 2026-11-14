export const accordionStyles = {
  accordionContent: "px-sm pb-sm leading-relaxed text-muted-foreground wrap-anywhere",
  accordionItem: "border-b border-border/60 last:border-b-0",
  accordionTrigger:
    "flex min-h-11 flex-1 items-start justify-between gap-sm rounded-md px-sm py-3 text-left text-sm font-medium leading-snug wrap-anywhere outline-none hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2 disabled:pointer-events-none disabled:text-muted-foreground data-[state=open]:bg-muted/40 [&[data-state=open]>svg]:rotate-180 motion-safe:transition-colors",
  element1: "flex",
  element2:
    "pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground motion-safe:transition-transform",
  element3:
    "overflow-hidden pt-2 text-sm data-[state=closed]:pt-0 motion-safe:data-[state=closed]:animate-accordion-up motion-safe:data-[state=open]:animate-accordion-down",
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
