import type { CSSProperties } from "react";

import type { PortfolioPreviewInlineStyle1Values } from "./types";

export const capabilitiesStyles = {
  element1:
    "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-capabilities [display:flex] [gap:16px] [align-items:center] [justify-content:space-between] [padding-block:26px] [font-size:12px] [color:var(--muted-foreground)] [border-block:1px_solid_color-mix(in_srgb,_var(--border)_70%,_transparent)] [&_>_:where(span):first-child]:[font:9px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] [letter-spacing:0.1em] [&_:where(i)]:[font-size:15px] [font-style:normal] [color:color-mix(in_srgb,_var(--primary)_55%,_transparent)] max-[760px]:[flex-wrap:wrap] [gap:15px] [justify-content:flex-start] [padding-block:23px] [font-size:10px] max-[760px]:[&_>_:where(span):first-child]:[width:100%] [font-size:8px] max-[760px]:[&_:where(i)]:[font-size:11px]",
} as const;

export const chatLauncherStyles = {
  element1:
    "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-chat-launcher [display:grid] [gap:var(--spacing-md)] [justify-items:center] [padding-block:var(--spacing-3xl,_4.5rem)] [text-align:center] [&_h2]:[font-size:clamp(var(--text-2xl),_3vw,_calc(var(--text-3xl)_*_1.25))] [font-weight:500] [letter-spacing:-0.04em] [&_.studio-chat-composer]:[width:min(100%,_800px)] [color:var(--foreground)] [background:var(--card)] [border-color:var(--border)] [&_>_p:last-child]:[font-size:var(--text-xs)] [color:var(--muted-foreground)] [&_.studio-chat-send]:[color:var(--background)] [background:var(--foreground)]",
  element2:
    "home-eyebrow [display:flex] [gap:9px] [align-items:center] [font:500_10px_/_1.6_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_>_:where(span)]:[width:5px] [height:5px] [background:currentColor] [border-radius:50%] [box-shadow:0_0_12px_color-mix(in_srgb,_var(--primary)_50%,_transparent)]",
} as const;

export const featuresStyles = {
  element1:
    "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-features [padding-block:105px_0] max-[760px]:[padding-top:65px]",
  element2:
    "home-section-intro [&_:where(h2)]:[margin-block:17px_20px] [font-size:clamp(34px,_4vw,_51px)] [font-weight:500] [line-height:1.16] [letter-spacing:-0.045em] [&_:where(h2)_>_:where(span)]:[color:var(--muted-foreground)] [&_>_:where(p):not(.home-eyebrow)]:[max-width:510px] [font-size:14px] [line-height:1.9] [color:var(--muted-foreground)] max-[760px]:[&_:where(h2)]:[font-size:36px] max-[760px]:[&_>_:where(p):not(.home-eyebrow)]:[font-size:13px]",
  element3:
    "home-eyebrow [display:flex] [gap:9px] [align-items:center] [font:500_10px_/_1.6_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_>_:where(span)]:[width:5px] [height:5px] [background:currentColor] [border-radius:50%] [box-shadow:0_0_12px_color-mix(in_srgb,_var(--primary)_50%,_transparent)]",
  element4:
    "home-feature-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:20px] [margin-top:40px] max-[760px]:[grid-template-columns:1fr] [gap:15px] [margin-top:29px]",
  element5:
    "home-feature-card [padding:35px] [border-radius:12px] [&_:where(h3)]:[margin-block:21px_15px] [font-size:26px] [font-weight:500] [line-height:1.25] [letter-spacing:-0.04em] [&_:where(p)]:[max-width:390px] [font-size:12px] [line-height:1.85] [color:var(--muted-foreground)] max-[1000px]:[padding:26px] max-[760px]:[padding:25px] max-[760px]:[&_:where(h3)]:[font-size:25px] [&.ui-card]:[border-radius:14px] [&.reveal-card]:[align-self:start] [padding:32px] [&_.reveal-heading_h3]:[font-size:clamp(26px,_3vw,_36px)] [&_.home-url-demo]:[padding:20px] [margin-block:24px] [&_.home-style-demo]:[padding:15px_5px] [&_.reveal-brief]:[display:block] [max-height:none] [&_.reveal-toggle]:[margin-top:20px] [&_.reveal-details-inner_p]:[max-width:56ch] [font-size:14px] [line-height:1.65] [color:var(--foreground)] [&_.reveal-details-inner_ul]:[max-width:56ch] [font-size:14px] [line-height:1.65] [color:var(--foreground)] max-[700px]:[&.reveal-card]:[padding:24px] home-feature-main [display:flex] [flex-direction:column] [justify-content:space-between]",
  element7:
    "home-url-demo [display:flex] [gap:16px] [align-items:center] [padding:20px] [margin-top:40px] [background:color-mix(in_srgb,_var(--background)_40%,_transparent)] [border:1px_solid_var(--border)] [border-radius:7px] [&_>_:where(span)]:[font-size:25px] [color:var(--primary)] [&_>_:where(div)]:[min-width:0] [&_:where(small)]:[font:7px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] [letter-spacing:0.12em] [&_:where(p)]:[margin-top:5px] [font:10px_/_1.7_var(--font-geist-mono),_monospace] [overflow-wrap:anywhere] [&_:where(strong)]:[font-weight:400] [color:var(--primary)]",
  element8:
    "home-feature-details [display:grid] [gap:6px] [padding-inline-start:20px] [margin-top:12px] [list-style:disc] [&_li::marker]:[color:var(--primary)]",
  element9:
    "home-feature-card [padding:35px] [border-radius:12px] [&_:where(h3)]:[margin-block:21px_15px] [font-size:26px] [font-weight:500] [line-height:1.25] [letter-spacing:-0.04em] [&_:where(p)]:[max-width:390px] [font-size:12px] [line-height:1.85] [color:var(--muted-foreground)] max-[1000px]:[padding:26px] max-[760px]:[padding:25px] max-[760px]:[&_:where(h3)]:[font-size:25px] [&.ui-card]:[border-radius:14px] [&.reveal-card]:[align-self:start] [padding:32px] [&_.reveal-heading_h3]:[font-size:clamp(26px,_3vw,_36px)] [&_.home-url-demo]:[padding:20px] [margin-block:24px] [&_.home-style-demo]:[padding:15px_5px] [&_.reveal-brief]:[display:block] [max-height:none] [&_.reveal-toggle]:[margin-top:20px] [&_.reveal-details-inner_p]:[max-width:56ch] [font-size:14px] [line-height:1.65] [color:var(--foreground)] [&_.reveal-details-inner_ul]:[max-width:56ch] [font-size:14px] [line-height:1.65] [color:var(--foreground)] max-[700px]:[&.reveal-card]:[padding:24px]",
  element11:
    "home-style-demo [position:relative] [display:flex] [gap:8px] [align-items:center] [height:127px] [padding:15px_5px] [&_>_:where(span)]:[width:24px] [height:24px] [background:#67d8e7] [border-radius:50%] [box-shadow:0_0_0_5px_#67d8e710] [&_>_:where(span):nth-child(2)]:[background:#b8a5ff] [box-shadow:0_0_0_5px_#b8a5ff10] [&_>_:where(span):nth-child(3)]:[background:#62dcb7] [box-shadow:0_0_0_5px_#62dcb710] [&_>_:where(div)]:[margin-left:auto] [font-size:57px] [font-weight:400] [line-height:1] [color:color-mix(in_srgb,_var(--muted-foreground)_70%,_transparent)] [letter-spacing:-5px] [&_>_:where(div)_:where(span)]:[display:block] [margin-top:-4px] [font-size:37px] [color:var(--primary)] [letter-spacing:-3px]",
  element12:
    "home-feature-details [display:grid] [gap:6px] [padding-inline-start:20px] [margin-top:12px] [list-style:disc] [&_li::marker]:[color:var(--primary)]",
  element13:
    "home-feature-cv [display:flex] [gap:22px] [align-items:center] [&_:where(h3)]:[margin-top:12px] max-[760px]:[&_:where(h3)]:[font-size:22px]",
  element14:
    "home-file-icon [display:flex] [flex-shrink:0] [align-items:flex-end] [justify-content:space-between] [width:70px] [height:90px] [padding:12px] [font-size:20px] [color:var(--primary)] [background:color-mix(in_srgb,_var(--primary)_6%,_transparent)] [border:1px_solid_color-mix(in_srgb,_var(--primary)_45%,_transparent)] [border-radius:5px_15px_5px_5px] [&_>_:where(span)]:[font:12px_var(--font-geist-mono),_monospace] max-[760px]:[width:48px] [height:65px] [padding:8px] [font-size:14px] max-[760px]:[&_>_:where(span)]:[font-size:9px]",
} as const;

export const portfolioPreviewStyles = {
  element1:
    "home-preview-wrap [position:relative] [min-width:0] max-[760px]:[width:min(100%,_510px)] [margin-inline:auto] [transform:none]",
  element2:
    "home-preview-tools [display:flex] [align-items:center] [justify-content:space-between] [margin-bottom:12px]",
  element3:
    "home-preview-tabs [display:flex] [padding:3px] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:7px] [&_:where(button)]:[padding:6px_15px] [font-size:10px] [color:var(--foreground)] [background:transparent] [border:0] [border-radius:4px] [&_:where(button):hover]:[color:var(--foreground)] [background:var(--secondary)] [&_:where(button)[aria-selected='true']]:[color:var(--foreground)]",
  element4:
    "home-preview-caption [font:10px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] max-[1000px]:[display:none] max-[760px]:[display:inline] max-[380px]:[font-size:8px]",
  element5:
    "home-preview-browser [overflow:hidden] [color:var(--foreground)] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:var(--portfolio-radius,_12px)] [box-shadow:0_30px_90px_color-mix(in_srgb,_var(--foreground)_30%,_transparent)] [&[data-portfolio-theme]]:[--background:rgb(var(--portfolio-bg-dark))] [:root[data-theme='light']_&[data-portfolio-theme]]:[--background:rgb(var(--portfolio-bg-light))] [&[data-portfolio-theme]_.home-sample-intro_h2]:[font-family:var(--portfolio-display)] [&[data-portfolio-theme]_.home-cv-paper_h2]:[font-family:var(--portfolio-display)]",
  element6:
    "home-preview-chrome [display:flex] [gap:10px] [align-items:center] [justify-content:space-between] [padding:14px_15px] [font:8px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] [background:var(--secondary)] [border-bottom:1px_solid_var(--border)] max-[380px]:[font-size:6px]",
  element7:
    "home-window-dots [display:flex] [gap:4px] [&_:where(i)]:[width:5px] [height:5px] [background:var(--muted-foreground)] [border-radius:50%]",
  element8: "home-preview-panel [min-height:484px] max-[760px]:[min-height:484px]",
  element9:
    "home-sample-site [padding:20px_28px_18px] max-[1000px]:[padding-inline:21px] max-[760px]:[padding-inline:28px] max-[380px]:[padding-inline:20px]",
  element10:
    "home-sample-nav [display:flex] [align-items:center] [justify-content:space-between] [&_>_:where(strong)]:[font-size:21px] [letter-spacing:-1px] [&_:where(strong)_span]:[color:var(--primary)] [&_>_:where(span)]:[font-size:8px] [color:var(--muted-foreground)]",
  element11:
    "home-sample-intro [&_:where(h2)_:where(span)]:[color:var(--primary)] [position:relative] [padding-block:36px_24px] [&_>_:where(p):first-of-type]:[margin-bottom:8px] [font:8px_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_:where(h2)]:[margin:0_0_10px] [font-size:39px] [font-weight:500] [line-height:1.2] [letter-spacing:-2px] [&_:where(button)]:[display:flex] [gap:25px] [align-items:center] [padding:8px_12px] [font-size:9px] [font-weight:600] [color:var(--card)] [background:var(--primary)] [border:0] [border-radius:6px] max-[1000px]:[&_:where(h2)]:[font-size:34px] max-[760px]:[&_:where(h2)]:[font-size:39px]",
  element12:
    "home-sample-avatar [position:absolute] [top:55px] [right:6px] [display:grid] [place-items:center] [width:68px] [height:68px] [font-size:23px] [font-weight:300] [color:var(--primary)] [background:radial-gradient(_circle_at_70%_20%,_color-mix(in_srgb,_var(--primary)_17%,_transparent),_transparent_)] [border:1px_solid_color-mix(in_srgb,_var(--primary)_40%,_transparent)] [border-radius:50%] max-[1000px]:[right:0] [width:48px] [height:48px] max-[760px]:[width:64px] [height:64px] max-[380px]:[width:45px] [height:45px]",
  element13:
    "home-sample-role [margin-block:7px] [font-size:10px] max-[1000px]:[max-width:185px] max-[380px]:[font-size:9px]",
  element14: "home-sample-bio [font-size:9px] [line-height:1.8] [color:var(--muted-foreground)]",
  element15:
    "home-sample-work [display:flex] [justify-content:space-between] [padding-block:13px] [font:7px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] [letter-spacing:0.1em] [border-top:1px_solid_var(--border)]",
  element16:
    "home-sample-projects [display:grid] [grid-template-columns:1fr_1fr] [gap:12px] [&_:where(strong)]:[display:block] [font-size:9px] [font-weight:500] [&_:where(small)]:[display:block] [margin-top:4px] [font-size:7px] [color:var(--muted-foreground)]",
  element17:
    "home-project-art [object-fit:cover] [position:relative] [display:flex] [align-items:center] [justify-content:center] [height:91px] [margin-bottom:10px] [overflow:hidden] [border-radius:5px]",
  element18:
    "home-project-art [object-fit:cover] [position:relative] [display:flex] [align-items:center] [justify-content:center] [height:91px] [margin-bottom:10px] [overflow:hidden] [border-radius:5px]",
  element19:
    "home-sample-footer [display:flex] [justify-content:space-between] [padding-top:12px] [margin-top:21px] [font-size:7px] [color:var(--muted-foreground)] [border-top:1px_solid_var(--border)]",
  element20: "home-sample-cv [padding:22px]",
  element21:
    "home-cv-paper [min-height:440px] [padding:27px_31px] [font-size:8px] [color:var(--foreground)] [background:var(--card)] [border-radius:min(var(--portfolio-radius,_2px),_16px)] [box-shadow:0_10px_35px_#0004] [&_:where(h2)]:[margin-bottom:4px] [font-size:25px] [font-weight:600] [letter-spacing:-1px] [&_:where(h3)]:[padding-bottom:4px] [margin-block:18px_7px] [font-size:9px] [font-weight:650] [color:var(--primary)] [border-bottom:1px_solid_var(--border)] [&_p]:[line-height:1.6] [&_:where(li)]:[line-height:1.6] [&_:where(ul)]:[padding-left:12px] [margin-top:6px] max-[380px]:[padding:23px]",
  element22:
    "home-cv-label [margin-bottom:14px] [font:6px_var(--font-geist-mono),_monospace] [color:#637180] [letter-spacing:0.15em]",
  element23:
    "home-cv-contact [padding-bottom:15px] [margin-top:10px] [font-size:7px] [color:#637180] [border-bottom:1px_solid_#d9dfe7]",
  element24:
    "home-cv-role [display:flex] [justify-content:space-between] [&_>_:where(span)]:[color:#637180]",
  element25:
    "home-cv-footnote [padding-top:10px] [margin-top:24px] [font-size:6px] [color:#637180] [border-top:1px_solid_#d9dfe7]",
  element26:
    "home-preview-bottom [display:flex] [flex-wrap:wrap] [gap:11px] [align-items:center] [margin-top:17px] [font-size:10px] [color:var(--muted-foreground)]",
  element27:
    "home-preview-colors [display:flex] [flex-wrap:wrap] [gap:6px] [min-width:0] [padding:0] [margin:0] [border:0] home-preview-accents [flex:1_1_12rem] [max-width:100%]",
  element28: "sr-only",
  element29:
    "home-accent [display:grid] [place-items:center] [width:19px] [height:19px] [font-size:10px] [color:#101929] [border-radius:50%] [&[aria-pressed='true']]:[outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]:1px_solid_var(--muted-foreground)]",
  element30:
    "home-preview-colors [display:flex] [flex-wrap:wrap] [gap:6px] [min-width:0] [padding:0] [margin:0] [border:0] home-preview-themes [margin-left:4px]",
  element31: "sr-only",
  element32: "home-preview-note [margin-left:auto] [font:8px_var(--font-geist-mono),_monospace]",
} as const;

export const heroStyles = {
  element6:
    "home-button [display:inline-flex] [gap:30px] [align-items:center] [justify-content:center] [min-height:48px] [padding:14px_20px] [font-size:12px] [font-weight:650] [text-decoration:none] [border-radius:6px] [transition:transform_0.2s,_box-shadow_0.2s] hover:[box-shadow:0_7px_24px_color-mix(in_srgb,_var(--primary)_15%,_transparent)] [transform:translateY(-2px)] motion-reduce:[transition:none] motion-reduce:hover:[transform:none] home-button-primary [color:var(--background)] [background:var(--primary)]",
  element7:
    "home-example-link [display:inline-flex] [gap:12px] [align-items:center] [padding-block:9px] [font-size:12px] [text-decoration:none] [border-bottom:1px_solid_var(--border)] hover:[color:var(--primary)]",
} as const;

export const libraryPickerStyles = {
  element1:
    "home-library-demo [min-width:0] [margin-top:40px] [overflow:hidden] [border:1px_solid_var(--border)] [border-radius:22px] [&.ui-card]:[display:grid] [grid-template-columns:minmax(180px,_0.8fr)_minmax(0,_2fr)] [padding:8px] [border-radius:18px] [&_>_.home-sample-note]:[grid-column:1_/_-1] [padding:16px_24px] [margin:0] [border-top:1px_solid_color-mix(in_srgb,_var(--border)_50%,_transparent)] max-[700px]:[&.ui-card]:[grid-template-columns:1fr]",
  element2:
    "home-library-buttons [display:flex] [flex-wrap:wrap] [gap:10px] [padding:20px] [background:var(--card)] [&_button]:[min-height:44px] [padding:12px_18px] [border:1px_solid_var(--border)] [border-radius:24px] [&_button[aria-pressed='true']]:[color:var(--background)] [&_button[aria-pressed='true']]:[color:var(--foreground)]",
  element3: "sr-only",
  element4:
    "home-library-number [align-self:flex-start] [padding-top:2px] [font:10px_var(--font-geist-mono),_monospace] [color:var(--primary)]",
  element5:
    "home-library-preview [min-height:330px] [max-height:480px] [padding:24px] [overflow:auto] [&[hidden]]:[display:none]",
  element6:
    "home-library-preview-bar [display:flex] [gap:16px] [align-items:center] [padding:16px_20px] [font:9px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] [letter-spacing:0.1em] [border-bottom:1px_solid_color-mix(in_srgb,_var(--border)_60%,_transparent)] [&_>_span:first-child]:[display:flex] [gap:5px] [&_i]:[width:6px] [height:6px] [background:color-mix(in_srgb,_var(--muted-foreground)_35%,_transparent)] [border-radius:50%]",
  element7: "home-library-preview-content [padding:24px] max-[700px]:[padding:16px]",
  element8: "home-sample-note [padding:12px_20px] [font-size:12px] [color:var(--muted-foreground)]",
} as const;

export const sectionCatalogStyles = {
  element1:
    "home-library-catalog [padding-block:24px] [border-bottom:1px_solid_var(--border)] section-catalog [padding:var(--spacing-md)] [margin-block:32px] [&_.section-catalog-grid]:[display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:var(--spacing-md)] [padding:0] [list-style:none] max-[1000px]:[&_.section-catalog-grid]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[767px]:[&_.section-catalog-grid]:[grid-template-columns:minmax(0,_1fr)]",
  element2:
    "section-catalog-heading [display:flex] [flex-wrap:wrap] [gap:20px] [align-items:start] [justify-content:space-between] [&_h3]:[margin-block:8px_12px] [font-size:clamp(24px,_3vw,_32px)] [line-height:1.2] [&_p]:[max-width:58ch] [line-height:1.7] [color:var(--muted-foreground)]",
  element3:
    "home-eyebrow [display:flex] [gap:9px] [align-items:center] [font:500_10px_/_1.6_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_>_:where(span)]:[width:5px] [height:5px] [background:currentColor] [border-radius:50%] [box-shadow:0_0_12px_color-mix(in_srgb,_var(--primary)_50%,_transparent)]",
  element4: "section-catalog-search [display:grid] [gap:8px] [max-width:520px] [margin-top:24px]",
  element5:
    "section-catalog-filters [display:flex] [flex-wrap:wrap] [gap:6px] [padding:0] [margin-block:20px_12px] [border:0]",
  element6: "sr-only",
  element7:
    "section-catalog-count [margin-block:12px] [font-size:13px] [color:var(--muted-foreground)]",
  element8:
    "section-catalog-grid [&[data-expanded='false']_>_li:nth-child(n_+_10)]:[display:none] max-[1000px]:[&[data-expanded='false']_>_li:nth-child(n_+_7)]:[display:none] max-[767px]:[&[data-expanded='false']_>_li:nth-child(n_+_4)]:[display:none]",
  element9: "section-catalog-icon",
  element10: "section-catalog-reveal [width:100%] [margin-top:var(--spacing-sm)]",
  element11:
    "section-catalog-empty [display:grid] [gap:12px] [justify-items:start] [padding-block:24px]",
} as const;

export const libraryStyles = {
  element1:
    "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-library [padding-block:90px] max-[700px]:[padding-block:55px]",
  element2:
    "home-library-header [display:grid] [grid-template-columns:minmax(0,_1.5fr)_minmax(0,_0.7fr)] [gap:48px] [align-items:center] max-[700px]:[grid-template-columns:1fr] [gap:24px]",
  element3:
    "home-section-intro [&_:where(h2)]:[margin-block:17px_20px] [font-size:clamp(34px,_4vw,_51px)] [font-weight:500] [line-height:1.16] [letter-spacing:-0.045em] [&_:where(h2)_>_:where(span)]:[color:var(--muted-foreground)] [&_>_:where(p):not(.home-eyebrow)]:[max-width:510px] [font-size:14px] [line-height:1.9] [color:var(--muted-foreground)] max-[760px]:[&_:where(h2)]:[font-size:36px] max-[760px]:[&_>_:where(p):not(.home-eyebrow)]:[font-size:13px]",
  element4:
    "home-eyebrow [display:flex] [gap:9px] [align-items:center] [font:500_10px_/_1.6_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_>_:where(span)]:[width:5px] [height:5px] [background:currentColor] [border-radius:50%] [box-shadow:0_0_12px_color-mix(in_srgb,_var(--primary)_50%,_transparent)]",
  element5:
    "home-library-count [padding-left:32px] [border-left:1px_solid_color-mix(in_srgb,_var(--primary)_40%,_transparent)] [&_strong]:[display:flex] [gap:16px] [align-items:baseline] [font-size:clamp(64px,_7vw,_96px)] [font-weight:500] [line-height:1] [color:var(--primary)] [letter-spacing:-0.07em] [&_strong_span]:[font-size:14px] [color:var(--foreground)] [letter-spacing:0] [&_p]:[max-width:24ch] [margin-block:16px_24px] [font-size:18px] [line-height:1.6] [&_>_span]:[font-size:9px] [color:var(--muted-foreground)] [letter-spacing:0.12em] max-[700px]:[padding-left:20px] max-[700px]:[&_p]:[max-width:none] [margin-block:10px] [font-size:15px]",
  element6:
    "home-library-workflows [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:24px] [margin-top:40px] [&_article]:[padding:30px] [border:1px_solid_var(--border)] [border-radius:22px] [&_h3]:[margin-block:20px] [font-size:clamp(24px,_3vw,_36px)] [&_p]:[line-height:1.8] [&_li]:[line-height:1.8] [&_.home-button]:[display:inline-flex] [margin-top:20px] max-[700px]:[grid-template-columns:1fr] [&_article.ui-card]:[border-radius:14px]",
  element7:
    "home-feature-index [font:9px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] [letter-spacing:0.1em]",
  element8:
    "home-button [display:inline-flex] [gap:30px] [align-items:center] [justify-content:center] [min-height:48px] [padding:14px_20px] [font-size:12px] [font-weight:650] [text-decoration:none] [border-radius:6px] [transition:transform_0.2s,_box-shadow_0.2s] hover:[box-shadow:0_7px_24px_color-mix(in_srgb,_var(--primary)_15%,_transparent)] [transform:translateY(-2px)] motion-reduce:[transition:none] motion-reduce:hover:[transform:none] home-button-primary [color:var(--background)] [background:var(--primary)]",
  element9: "home-sample-note [padding:12px_20px] [font-size:12px] [color:var(--muted-foreground)]",
  element10:
    "home-feature-index [font:9px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] [letter-spacing:0.1em]",
  element11: "home-text-link",
} as const;

export const optionsStyles = {
  element1:
    "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-options [padding-block:5rem] [&_h3]:[margin-bottom:0.7rem] [font-size:1.4rem] [&_p]:[line-height:1.8] [color:var(--muted-foreground)] max-[700px]:[padding-block:3rem]",
  element2:
    "home-section-intro [&_:where(h2)]:[margin-block:17px_20px] [font-size:clamp(34px,_4vw,_51px)] [font-weight:500] [line-height:1.16] [letter-spacing:-0.045em] [&_:where(h2)_>_:where(span)]:[color:var(--muted-foreground)] [&_>_:where(p):not(.home-eyebrow)]:[max-width:510px] [font-size:14px] [line-height:1.9] [color:var(--muted-foreground)] max-[760px]:[&_:where(h2)]:[font-size:36px] max-[760px]:[&_>_:where(p):not(.home-eyebrow)]:[font-size:13px]",
  element3:
    "home-eyebrow [display:flex] [gap:9px] [align-items:center] [font:500_10px_/_1.6_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_>_:where(span)]:[width:5px] [height:5px] [background:currentColor] [border-radius:50%] [box-shadow:0_0_12px_color-mix(in_srgb,_var(--primary)_50%,_transparent)]",
  element4:
    "home-options-grid [&_>_.ui-card]:[padding:clamp(24px,_3vw,_36px)] [border-radius:14px] [display:grid] [grid-template-columns:1fr_1fr] [gap:4rem] [margin-top:3rem] max-[700px]:[grid-template-columns:1fr] [gap:2rem]",
  element5:
    "home-theme-list [padding:0] [margin-top:2rem] [list-style:none] [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:10px_12px] [margin-top:1rem] [&_li]:[display:flex] [gap:8px] [align-items:center] [min-width:0] [font-size:0.875rem] [overflow-wrap:anywhere] [&_small]:[display:block] [margin-top:0.25rem] [color:var(--muted-foreground)]",
  element6:
    "home-format-list [padding:0] [margin-top:2rem] [list-style:none] [&_li]:[display:flex] [gap:1rem] [justify-content:space-between] [padding-block:0.85rem] [font-size:0.85rem] [border-bottom:1px_solid_var(--border)] [&_li_span]:[color:var(--muted-foreground)] [text-align:right]",
  element7: "home-language-note [margin-top:2rem]",
  element8:
    "home-eyebrow [display:flex] [gap:9px] [align-items:center] [font:500_10px_/_1.6_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_>_:where(span)]:[width:5px] [height:5px] [background:currentColor] [border-radius:50%] [box-shadow:0_0_12px_color-mix(in_srgb,_var(--primary)_50%,_transparent)]",
} as const;

export const pricingStyles = {
  element1:
    "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-pricing [padding-block:5rem]",
  element2:
    "home-section-intro [&_:where(h2)]:[margin-block:17px_20px] [font-size:clamp(34px,_4vw,_51px)] [font-weight:500] [line-height:1.16] [letter-spacing:-0.045em] [&_:where(h2)_>_:where(span)]:[color:var(--muted-foreground)] [&_>_:where(p):not(.home-eyebrow)]:[max-width:510px] [font-size:14px] [line-height:1.9] [color:var(--muted-foreground)] max-[760px]:[&_:where(h2)]:[font-size:36px] max-[760px]:[&_>_:where(p):not(.home-eyebrow)]:[font-size:13px]",
  element3:
    "home-eyebrow [display:flex] [gap:9px] [align-items:center] [font:500_10px_/_1.6_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_>_:where(span)]:[width:5px] [height:5px] [background:currentColor] [border-radius:50%] [box-shadow:0_0_12px_color-mix(in_srgb,_var(--primary)_50%,_transparent)]",
  element4:
    "home-plan-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:1.5rem] [margin-top:2rem] max-[700px]:[grid-template-columns:1fr]",
  element5:
    "home-plan [display:flex] [flex-direction:column] [gap:1rem] [align-items:start] [padding:2rem] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:1.2rem] [&_h3]:[font-size:1.6rem] [&_ul]:[flex:1] [padding-left:1.3rem] [line-height:1.9] max-[700px]:[padding:1.5rem]",
  element6:
    "home-plan-price [font-size:2rem] [font-weight:700] [&_span]:[font-size:1rem] [font-weight:400]",
  element7:
    "home-button [display:inline-flex] [gap:30px] [align-items:center] [justify-content:center] [min-height:48px] [padding:14px_20px] [font-size:12px] [font-weight:650] [text-decoration:none] [border-radius:6px] [transition:transform_0.2s,_box-shadow_0.2s] hover:[box-shadow:0_7px_24px_color-mix(in_srgb,_var(--primary)_15%,_transparent)] [transform:translateY(-2px)] motion-reduce:[transition:none] motion-reduce:hover:[transform:none] home-button-secondary",
  element8:
    "home-plan [display:flex] [flex-direction:column] [gap:1rem] [align-items:start] [padding:2rem] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:1.2rem] [&_h3]:[font-size:1.6rem] [&_ul]:[flex:1] [padding-left:1.3rem] [line-height:1.9] max-[700px]:[padding:1.5rem] home-plan-pro [border-color:var(--primary)]",
  element9:
    "home-eyebrow [display:flex] [gap:9px] [align-items:center] [font:500_10px_/_1.6_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_>_:where(span)]:[width:5px] [height:5px] [background:currentColor] [border-radius:50%] [box-shadow:0_0_12px_color-mix(in_srgb,_var(--primary)_50%,_transparent)]",
  element10:
    "home-button [display:inline-flex] [gap:30px] [align-items:center] [justify-content:center] [min-height:48px] [padding:14px_20px] [font-size:12px] [font-weight:650] [text-decoration:none] [border-radius:6px] [transition:transform_0.2s,_box-shadow_0.2s] hover:[box-shadow:0_7px_24px_color-mix(in_srgb,_var(--primary)_15%,_transparent)] [transform:translateY(-2px)] motion-reduce:[transition:none] motion-reduce:hover:[transform:none] home-button-primary [color:var(--background)] [background:var(--primary)]",
  element11:
    "home-plan-note [max-width:80ch] [margin-top:1.5rem] [line-height:1.7] [color:var(--muted-foreground)]",
} as const;

export function homeOptionsSectionClassName(...values: unknown[]): string {
  return `home-theme-swatch home-theme-${values[0]}`;
}

export function portfolioPreviewClassName(...values: unknown[]): string {
  return `home-accent [&[aria-pressed='true']]:[outline:1px_solid_var(--muted-foreground)] home-accent-${values[0]}`;
}

export function portfolioPreviewInlineStyle1(
  ...values: PortfolioPreviewInlineStyle1Values
): CSSProperties {
  return { backgroundColor: values[0] };
}
