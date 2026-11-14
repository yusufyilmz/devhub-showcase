import type { CSSProperties } from "react";

import { getPortfolioThemeVariables, getPreviewAccent } from "@shared/config";

import type { PortfolioExample } from "./data";

export function ExampleThumbnail({ item }: { item: PortfolioExample }) {
  const { profile } = item;
  const theme = profile.appearance?.theme ?? "studio";
  return (
    <div
      aria-hidden="true"
      className="example-thumbnail [height:310px] [padding:3.25rem_1.6rem_1.6rem] [overflow:hidden] [color:var(--foreground)] [pointer-events:none] [background:var(--background)] [&[data-theme='dark']]:[color:var(--foreground)] [&[data-layout='engineer']_.example-mini-work]:[grid-template-columns:1fr] [&[data-layout='engineer']_.example-mini-shape]:[height:28px] [&[data-layout='minimal']]:[padding-inline:3rem] [&[data-layout='minimal']_.example-mini-intro_strong]:[font-size:1.35rem] [&[data-layout='minimal']_.example-mini-work]:[display:block] [&[data-layout='minimal']_.example-mini-shape]:[display:none] [&[data-layout='consultant']_.example-mini-intro]:[width:58%] [&[data-layout='consultant']_.example-mini-intro_strong]:[font-size:1.4rem] [&[data-layout='consultant']_.example-mini-work]:[margin-top:1rem] theme-preview min-w-0 wrap-anywhere rounded-xl border border-border bg-background p-8 text-foreground max-[600px]:p-[22px]"
      data-layout={profile.portfolioType}
      data-portfolio-theme={theme}
      data-theme={profile.appearance?.defaultTheme}
      style={
        {
          ...getPortfolioThemeVariables(theme),
          ...getPreviewAccent(profile.appearance?.accent ?? "cyan"),
        } as CSSProperties
      }
    >
      <div className="example-mini-nav [display:flex] [align-items:center] [justify-content:space-between] [padding-bottom:0.6rem] [border-bottom:1px_solid_color-mix(in_srgb,_currentColor_28%,_transparent)] [&_b]:[font-size:1rem] [&_>_span]:[font-size:0.4rem] [letter-spacing:0.15em]">
        <b>
          {profile.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
          .
        </b>
        <span>WORK / ABOUT / CV</span>
      </div>
      <div className="example-mini-intro [max-width:90%] [padding-block:1.4rem] [&_small]:[display:block] [margin-bottom:0.6rem] [font-size:0.5rem] [opacity:0.65] [&_strong]:[display:block] [font-family:var(--portfolio-display)] [font-size:1.65rem] [font-weight:var(--portfolio-heading-weight)] [line-height:1.1] [letter-spacing:-0.04em] [&_>_span]:[display:block] [max-width:85%] [margin-top:0.7rem] [font-size:0.45rem] [line-height:1.6] max-[700px]:[&_strong]:[font-size:1.35rem]">
        <small>{profile.title}</small>
        <strong>{item.category}</strong>
        <span>{profile.summary}</span>
      </div>
      <div className="example-mini-work [display:grid] [grid-template-columns:1fr_1fr] [gap:0.75rem] [&_img]:[width:100%] [height:80px] [object-fit:cover] [border-radius:var(--portfolio-radius)] [&_b]:[display:block] [margin-top:0.4rem] [font-size:0.5rem] [font-weight:500]">
        {profile.projects.map((project, index) => (
          <div key={project.id}>
            {item.covers[project.id] ? (
              <img
                alt=""
                height="400"
                loading="lazy"
                src={`/examples/${item.covers[project.id]}`}
                width="600"
              />
            ) : (
              <div className="example-mini-shape [display:flex] [gap:0.7rem] [align-items:center] [height:50px] [padding:0.65rem] [border:1px_solid_currentColor] [border-radius:var(--portfolio-radius)] [opacity:0.6] [&_span]:[font-size:0.8rem] [&_i]:[width:25%] [height:3px] [background:currentColor] [opacity:0.3]">
                <span>0{index + 1}</span>
                <i />
                <i />
              </div>
            )}
            <b>{project.name}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
