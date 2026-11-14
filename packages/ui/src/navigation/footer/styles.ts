export const footerStyles = {
  element1:
    "site-footer [display:flex] [gap:30px] [justify-content:space-between] [max-width:1200px] [padding:38px_40px] [margin:0_auto] [font-size:12px] [color:var(--muted-foreground)] [border-top:1px_solid_var(--border)] [&_>_div]:[display:flex] [gap:22px] [align-items:center] [&_p]:[margin:0] max-[767px]:[flex-direction:column] [padding:30px_22px_90px] max-[767px]:[&_>_div]:[flex-wrap:wrap] [gap:18px]",
  element2:
    "brand-mark text-[32px] leading-none font-[750] tracking-[-0.12em] text-foreground no-underline [&_span]:text-primary",
} as const;
