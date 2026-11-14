import { studioButtonClass } from "../../buttons/button/StudioButton";

export const menuItemsStyles = {
  element1: "text-main-white border-none whitespace-pre",
} as const;

export const mobileMenuStyles = {
  element1: "md:hidden",
  element2: "bg-main-dark h-full flex flex-col justify-start p-4 align-middle",
  element3: studioButtonClass.primary,
} as const;

export const navbarStyles = {
  element1:
    "portfolio-nav [display:flex] [gap:24px] [align-items:center] [justify-content:space-between] [max-width:1280px] [min-height:78px] [padding:14px_40px] [margin:auto] max-[767px]:[min-height:68px] [padding:12px_22px]",
  element2:
    "brand-mark text-[32px] leading-none font-[750] tracking-[-0.12em] text-foreground no-underline [&_span]:text-primary",
  element3:
    "nav-links [display:flex] [gap:4px] [&_a]:[padding:9px] [font-size:10px] [font-weight:500] [letter-spacing:0.06em] [box-shadow:none] max-[1050px]:[&_a]:[padding:6px] [font-size:9px] max-[767px]:[display:none]",
  element4: "nav-tools [display:flex] [gap:18px] [align-items:center]",
  element5:
    "nav-contact [font-size:12px] [color:var(--primary)] [white-space:nowrap] max-[1050px]:[display:none]",
} as const;
