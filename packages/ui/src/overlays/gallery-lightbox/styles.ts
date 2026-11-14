export const galleryLightboxStyles = {
  element1:
    "gallery-lightbox [&[data-slot='dialog-content']]:[--gallery-preview-scale:0.5] [&_.gallery-lightbox-thumbnail[aria-pressed='true']]:[outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]:2px_solid_var(--primary)] max-[600px]:[&[data-slot='dialog-content']]:[gap:0]",
  element2:
    "gallery-lightbox-heading [&_[data-slot='dialog-title']]:[font-size:22px] [&_[data-slot='dialog-description']]:[margin-top:4px]",
  element3:
    "gallery-lightbox-eyebrow [display:block] [margin-bottom:7px] [font-size:9px] [color:var(--muted-foreground)] [letter-spacing:0.22em]",
  element4: "gallery-lightbox-close",
  element5:
    "gallery-lightbox-stage [display:grid] [place-items:center] [min-height:0] [overflow:auto] [&_>_img]:[width:100%] [height:100%] [object-fit:contain] [&_>_iframe]:[width:100%] [height:100%] [background:var(--background)] [border:0]",
  element6:
    "gallery-lightbox-controls [display:flex] [flex-wrap:wrap] [gap:12px] [align-items:center] [justify-content:center] [&_.ui-button]:[min-height:34px] [color:var(--secondary-foreground)] [background:var(--secondary)] [border:1px_solid_var(--border)] [border-radius:999px] [&_.ui-button:hover]:[color:var(--accent-foreground)] [background:var(--accent)]",
  element7: "gallery-lightbox-thumbnails [display:flex] [gap:8px] [padding:4px] [overflow-x:auto]",
  element8:
    "gallery-lightbox-thumbnail [&.ui-button]:[flex:0_0_100px] [height:64px] [padding:4px] [overflow:hidden] [white-space:normal] [&[aria-pressed='true']]:[outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]:2px_solid_var(--primary)]",
  element9:
    "gallery-lightbox-thumbnail-art [position:absolute] [inset:0] [overflow:hidden] [&_.example-thumbnail]:[width:400px] [min-width:400px] [height:265px] [transform:scale(0.34)] [transform-origin:top_left]",
  element10:
    "gallery-lightbox-thumbnail-name [position:absolute] [inset:auto_0_0] [padding:16px_8px_7px] [overflow:hidden] [text-overflow:ellipsis] [font-size:10px] [color:var(--foreground)] [white-space:nowrap] [background:linear-gradient(transparent,_var(--background)_52%)]",
} as const;
