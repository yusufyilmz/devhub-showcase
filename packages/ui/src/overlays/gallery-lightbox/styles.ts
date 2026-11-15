export const galleryLightboxStyles = {
  close: "absolute end-md top-md",
  controls: "flex flex-wrap items-center justify-center gap-xs",
  dialog: "min-w-0 border-border/75 sm:max-w-3xl [--gallery-preview-scale:0.5]",
  header: "flex min-w-0 flex-col gap-1 pe-10",
  stage:
    "grid min-h-0 min-w-0 place-items-center overflow-auto rounded-lg border border-border/60 bg-muted/40 [&>iframe]:h-[min(55dvh,32rem)] [&>iframe]:w-full [&>.example-preview-viewport]:h-[min(55dvh,32rem)] [&>img]:max-h-[50dvh] [&>img]:w-full [&>img]:object-contain",
  thumbnail:
    "relative isolate h-16 w-24 overflow-hidden rounded-lg border-border/60 bg-muted p-0 aria-pressed:border-primary/70 aria-pressed:bg-primary/10 focus-visible:-outline-offset-2",
  thumbnailArt:
    "absolute inset-0 grid place-items-center overflow-hidden [&_.example-thumbnail]:absolute [&_.example-thumbnail]:start-0 [&_.example-thumbnail]:top-0 [&_.example-thumbnail]:h-[265px] [&_.example-thumbnail]:w-[400px] [&_.example-thumbnail]:origin-top-left [&_.example-thumbnail]:scale-[0.24]",
  thumbnails: "flex min-w-0 gap-xs overflow-x-auto p-1",
  thumbnailTitle:
    "absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-background via-background/90 to-transparent px-1.5 pt-2 pb-1 text-xs text-foreground",
} as const;
