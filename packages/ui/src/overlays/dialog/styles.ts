export const dialogStyles = {
  dialogContent:
    "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
  dialogDescription: "text-muted-foreground text-sm",
  dialogFooter: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  dialogHeader: "flex flex-col gap-2 text-center sm:text-left",
  dialogOverlay:
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
  dialogTitle: "text-lg leading-none font-semibold",
  element1:
    "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  element2: "sr-only",
} as const;

export const galleryLightboxStyles = {
  element1: "gallery-lightbox",
  element2: "gallery-lightbox-heading",
  element3: "gallery-lightbox-eyebrow",
  element4: "gallery-lightbox-close",
  element5: "gallery-lightbox-stage",
  element6: "gallery-lightbox-controls",
  element7: "gallery-lightbox-thumbnails",
  element8: "gallery-lightbox-thumbnail",
  element9: "gallery-lightbox-thumbnail-art",
  element10: "gallery-lightbox-thumbnail-name",
} as const;
