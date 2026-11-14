export const heroSurfaceStyles = {
  element1:
    "hero-surface-plain relative isolate before:pointer-events-none before:absolute before:top-[4%] before:right-0 before:-z-10 before:aspect-square before:w-[min(48vw,640px)] before:rounded-full before:border before:border-[color-mix(in_srgb,var(--primary)_8%,transparent)] before:shadow-[0_0_0_64px_color-mix(in_srgb,var(--primary)_3%,transparent),0_0_0_128px_color-mix(in_srgb,var(--primary)_2%,transparent)] before:content-[''] max-[767px]:before:top-[15%] max-[767px]:before:w-[60vw] max-[767px]:before:opacity-60 [&_.hero-orbit]:hidden",
  element2:
    "hero-surface relative isolate overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-3xl bg-card [&_.hero-orbit]:hidden",
  element3: "hero-surface-media pointer-events-none absolute inset-0 size-full object-cover",
  element4: "hero-surface-media pointer-events-none absolute inset-0 size-full object-cover",
  element5:
    "hero-surface-media pointer-events-none absolute inset-0 size-full object-cover hero-surface-video",
  element6:
    "hero-surface-shade pointer-events-none absolute inset-0 size-full bg-black/68 [[data-overlay=strong]_&]:bg-black/80",
  element7: "hero-surface-content relative px-[clamp(20px,4vw,56px)] text-foreground",
  element8:
    "hero-surface-toggle relative mt-0 mr-5 mb-5 ml-5 cursor-pointer rounded-lg border border-border bg-card px-4 py-2.5 text-foreground",
} as const;
