export const aboutMeSectionStyles = {
  element1:
    "about-content [display:flex] [flex-direction:column] [align-items:flex-start] [&_p]:[font-size:15px] [line-height:1.9] [&_>_:where(div:last-child)]:[margin-top:28px]",
  element2: "flex flex-col gap-4 text-lg",
  element3: "text-main-slate",
  element4: "flex justify-center",
  element5:
    "whitespace-pre-wrap shine-effect [transition:color_160ms,_background_160ms] flex items-center text-white px-6 py-3 rounded-lg shadow-sm transition",
} as const;
