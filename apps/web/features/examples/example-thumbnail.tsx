import type { CSSProperties } from "react";

import { getPortfolioThemeVariables, getPreviewAccent } from "@shared/content";

import type { PortfolioExample } from "./data";

export function ExampleThumbnail({ item }: { item: PortfolioExample }) {
  const { profile } = item;
  const theme = profile.appearance?.theme ?? "studio";
  return (
    <div
      aria-hidden="true"
      className="example-thumbnail theme-preview"
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
      <div className="example-mini-nav">
        <b>
          {profile.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
          .
        </b>
        <span>WORK / ABOUT / CV</span>
      </div>
      <div className="example-mini-intro">
        <small>{profile.title}</small>
        <strong>{item.category}</strong>
        <span>{profile.summary}</span>
      </div>
      <div className="example-mini-work">
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
              <div className="example-mini-shape">
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
