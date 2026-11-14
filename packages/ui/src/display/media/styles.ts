export const workMediaStyles = {
  action: "border-primary/25 bg-primary/10 text-foreground hover:bg-primary/20",
  element1:
    "work-media [min-width:0] [&_img]:[display:block] [width:100%] [max-width:100%] [height:auto] [aspect-ratio:4_/_3] [object-fit:cover] [border-radius:8px] [&_iframe]:[display:block] [width:100%] [max-width:100%] [height:auto] [aspect-ratio:4_/_3] [object-fit:cover] [border-radius:8px] [[data-slot='masonry-grid']_&_img]:[aspect-ratio:auto_4_/_3] [&_[role='status']]:[margin:10px_0]",
} as const;
