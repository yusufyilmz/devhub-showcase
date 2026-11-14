"use client";

import { type CSSProperties, useId, useRef, useState } from "react";

import {
  getPortfolioThemeVariables,
  getPreviewAccent,
  getThemePalette,
  type PortfolioAccentId,
  type PortfolioTheme,
  portfolioAccentIds,
  portfolioAccents,
  portfolioThemes,
} from "@shared/config";
import { Button } from "@shared/ui/button";

import { portfolioPreviewInlineStyle1, portfolioPreviewStyles } from "./styles";

const views = ["Portfolio", "CV"] as const;
function tabIndexForKey(key: string, index: number) {
  if (key === "Home") return 0;
  if (key === "End") return 1;
  return ["ArrowLeft", "ArrowRight"].includes(key) ? 1 - index : null;
}
function themeSwatchColor(id: PortfolioTheme) {
  const theme = portfolioThemes.find((item) => item.id === id);
  const palette = getThemePalette(id, theme?.swatch ?? "dark");
  return {
    backgroundColor: `rgb(${palette.surface.replaceAll(" ", ", ")})`,
    color: `rgb(${palette.text.replaceAll(" ", ", ")})`,
  };
}
function accentSwatchColor(id: PortfolioAccentId) {
  const { dark } = portfolioAccents[id];
  return `rgb(${dark.replaceAll(" ", ", ")})`;
}

export function PortfolioPreview() {
  const [view, setView] = useState<(typeof views)[number]>("Portfolio");
  const [accent, setAccent] = useState<PortfolioAccentId>("cyan");
  const [theme, setTheme] = useState<PortfolioTheme>("studio");
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  return (
    <div className={portfolioPreviewStyles.element1} id="preview">
      <div className={portfolioPreviewStyles.element2}>
        <div aria-label="Example views" className={portfolioPreviewStyles.element3} role="tablist">
          {views.map((item, index) => (
            <Button
              aria-controls={`${id}-panel`}
              aria-selected={view === item}
              id={`${id}-${item}-tab`}
              key={item}
              onClick={() => setView(item)}
              onKeyDown={(event) => {
                const next = tabIndexForKey(event.key, index);
                if (next === null) return;
                event.preventDefault();
                const nextView = views[next];
                if (nextView) {
                  setView(nextView);
                  tabs.current[next]?.focus();
                }
              }}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              role="tab"
              tabIndex={view === item ? 0 : -1}
              type="button"
              variant="unstyled"
            >
              {item}
            </Button>
          ))}
        </div>
        <span className={portfolioPreviewStyles.element4}>Your story, two ways</span>
      </div>
      <div
        className={portfolioPreviewStyles.element5}
        data-portfolio-theme={theme}
        data-preview-accent={accent}
        style={
          {
            ...getPortfolioThemeVariables(theme),
            ...getPreviewAccent(accent),
          } as CSSProperties
        }
      >
        <div className={portfolioPreviewStyles.element6}>
          <span aria-hidden="true" className={portfolioPreviewStyles.element7}>
            <i />
            <i />
            <i />
          </span>
          <span>mydevstudio.vercel.app/yourname</span>
          <span aria-hidden="true">↗</span>
        </div>
        <div
          aria-labelledby={`${id}-${view}-tab`}
          className={portfolioPreviewStyles.element8}
          id={`${id}-panel`}
          role="tabpanel"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: Tab panel content needs a keyboard focus destination.
          tabIndex={0}
        >
          {view === "Portfolio" ? (
            <div className={portfolioPreviewStyles.element9}>
              <div className={portfolioPreviewStyles.element10}>
                <strong>
                  yn<span>.</span>
                </strong>
                <span>About&nbsp;&nbsp; Work&nbsp;&nbsp; Contact</span>
              </div>
              <div className={portfolioPreviewStyles.element11}>
                <div aria-hidden="true" className={portfolioPreviewStyles.element12}>
                  yn
                </div>
                <p>HELLO, I’M</p>
                <h2>
                  Your name<span>.</span>
                </h2>
                <p className={portfolioPreviewStyles.element13}>
                  Developer. Designer. A little of both.
                </p>
                <p className={portfolioPreviewStyles.element14}>
                  A few words about what you do,
                  <br />
                  and what makes it yours.
                </p>
                <Button
                  onClick={() => {
                    setView("CV");
                    tabs.current[1]?.focus();
                  }}
                  type="button"
                  variant="unstyled"
                >
                  Preview your CV <span aria-hidden="true">↗</span>
                </Button>
              </div>
              <div className={portfolioPreviewStyles.element15}>
                <span>SELECTED WORK</span>
                <span>01 / 02</span>
              </div>
              <div className={portfolioPreviewStyles.element16}>
                <div>
                  <img
                    alt="Illustrative interface project"
                    className={portfolioPreviewStyles.element17}
                    height={400}
                    src="/examples/atlas-interface.svg"
                    width={600}
                  />
                  <strong>A project you’re proud of</strong>
                  <small>Your craft, in action</small>
                </div>
                <div>
                  <img
                    alt="Illustrative brand identity project"
                    className={portfolioPreviewStyles.element18}
                    height={400}
                    src="/examples/orbit-brand.svg"
                    width={600}
                  />
                  <strong>Your next great idea</strong>
                  <small>A little room to grow</small>
                </div>
              </div>
              <div className={portfolioPreviewStyles.element19}>
                <span>Built around you.</span>
                <span>GitHub&nbsp; / &nbsp;LinkedIn</span>
              </div>
            </div>
          ) : (
            <div className={portfolioPreviewStyles.element20}>
              <div className={portfolioPreviewStyles.element21}>
                <p className={portfolioPreviewStyles.element22}>YOUR DOWNLOADABLE CV</p>
                <h2>Your name</h2>
                <p>Software engineer</p>
                <div className={portfolioPreviewStyles.element23}>
                  Your email · Your location · Your website
                </div>
                <h3>Profile</h3>
                <p>Your professional summary, in your own words.</p>
                <h3>Experience</h3>
                <div className={portfolioPreviewStyles.element24}>
                  <strong>Your latest role</strong>
                  <span>Present</span>
                </div>
                <p>Your company</p>
                <ul>
                  <li>A contribution that made a difference.</li>
                  <li>A challenge you helped solve.</li>
                  <li>What you built, and why it mattered.</li>
                </ul>
                <h3>Selected projects</h3>
                <strong>A project you’re proud of</strong>
                <p>Your work, the tools you used, and its impact.</p>
                <h3>Skills & education</h3>
                <p>Your expertise and the path that brought you here.</p>
                <div className={portfolioPreviewStyles.element25}>
                  One story. Ready for the next opportunity.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={portfolioPreviewStyles.element26}>
        <span>Try an accent</span>
        <fieldset className={portfolioPreviewStyles.element27}>
          <legend className={portfolioPreviewStyles.element28}>Preview accent color</legend>
          {portfolioAccentIds.map((item) => (
            <Button
              aria-label={`Preview in ${item}`}
              aria-pressed={accent === item}
              className={portfolioPreviewStyles.element29}
              key={item}
              onClick={() => setAccent(item)}
              style={portfolioPreviewInlineStyle1(accentSwatchColor(item))}
              title={item}
              type="button"
            >
              <span aria-hidden="true">{accent === item ? "✓" : ""}</span>
            </Button>
          ))}
        </fieldset>
        <fieldset className={portfolioPreviewStyles.element30}>
          <legend className={portfolioPreviewStyles.element31}>Preview theme</legend>
          {portfolioThemes.map((item) => (
            <Button
              aria-label={`Preview the ${item.name} theme`}
              aria-pressed={theme === item.id}
              className="home-accent [display:grid] [place-items:center] [width:19px] [height:19px] [font-size:10px] [color:#101929] [border-radius:50%] [&[aria-pressed='true']]:[outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] hover:[color:var(--accent)] [border-color:var(--accent)]:1px_solid_var(--muted-foreground)]"
              key={item.id}
              onClick={() => setTheme(item.id)}
              style={themeSwatchColor(item.id)}
              title={item.name}
              type="button"
            >
              <span aria-hidden="true">{theme === item.id ? "✓" : ""}</span>
            </Button>
          ))}
        </fieldset>
        <span className={portfolioPreviewStyles.element32}>Illustrative preview</span>
      </div>
    </div>
  );
}
