import "./examples.css";

import type { CSSProperties } from "react";

import {
  cvLayouts,
  getPortfolioThemeVariables,
  getThemePalette,
  type PortfolioAccentId,
  portfolioAccents,
  portfolioThemes,
} from "@shared/config";
import { Card } from "@shared/ui/cards";
import registry from "@shared/ui/registry.json";
import { Section } from "@shared/ui/section";

import { homeOptionsSectionClassName, optionsStyles } from "./styles";

function themeSampleStyle(id: string): CSSProperties {
  const theme = portfolioThemes.find((item) => item.id === id);
  if (!theme) return {};
  const palette = getThemePalette(theme.id, theme.swatch);
  const variables = getPortfolioThemeVariables(theme.id);
  const channel = (value: string) => `rgb(${value.replaceAll(" ", ", ")})`;
  return {
    background: channel(palette.surface),
    borderRadius: variables["--portfolio-radius"],
    color: channel(palette.text),
    fontFamily: variables["--portfolio-display"],
  };
}

function themeSwatchStyle(id: string): CSSProperties | undefined {
  if (id === "white") return { background: "#f7f8fb", color: "#192a3d" };
  const accent = portfolioAccents[id as PortfolioAccentId];
  if (!accent) return undefined;
  return { background: `rgb(${accent.light.replaceAll(" ", ", ")})`, color: "#f7f8fb" };
}

export function HomeOptionsSection() {
  const { attributes, presets } = registry.themes;
  return (
    <Section asChild>
      <section aria-labelledby="options-title" className={optionsStyles.element1}>
        <div className={optionsStyles.element2}>
          <p className={optionsStyles.element3}>YOUR WORK, YOUR WAY</p>
          <h2 id="options-title">
            One story.
            <br />
            <span>Plenty of possibilities.</span>
          </h2>
          <p>
            Choose a layout for your work, then make the details your own. You can change your
            choices in the editor anytime.
          </p>
        </div>
        <div className={optionsStyles.element4}>
          <Card layout="plain" surface="portfolio">
            <h3>Your theme. Your character.</h3>
            <p>
              Start with a ready theme, then choose a palette color and switch between light and
              dark.
            </p>
            <ul className={optionsStyles.element5}>
              {presets.map((theme) => (
                <li key={theme.id}>
                  <span
                    aria-hidden="true"
                    className={homeOptionsSectionClassName(theme.id)}
                    style={themeSampleStyle(theme.id)}
                  >
                    Aa
                  </span>
                  <span>
                    <b>{theme.name}</b>
                    <small>{theme.description}</small>
                  </span>
                </li>
              ))}
            </ul>
            <h4 className="mt-6 text-sm font-semibold">Palette colors</h4>
            <ul aria-label="Palette colors" className={optionsStyles.element5}>
              {attributes.brand.map((color) => (
                <li key={color}>
                  <span
                    aria-hidden="true"
                    className="home-theme-swatch [display:grid] [flex:0_0_40px] [place-items:center] [height:40px] [font-size:1.125rem] [border:1px_solid_#8885]"
                    style={themeSwatchStyle(color)}
                  >
                    Aa
                  </span>
                  <b className="capitalize">{color}</b>
                </li>
              ))}
            </ul>
          </Card>
          <Card layout="plain" surface="portfolio">
            <h3>A CV that fits your story.</h3>
            <p>
              Your saved information becomes a PDF. Choose the format, page size, text size and
              sections.
            </p>
            <ul className={optionsStyles.element6}>
              {cvLayouts.map((layout) => (
                <li key={layout.id}>
                  <b>{layout.name}</b>
                  <span>{layout.description}</span>
                </li>
              ))}
            </ul>
            <div className={optionsStyles.element7}>
              <span className={optionsStyles.element8}>EN / ES / TR</span>
              <h3>Speak to your audience.</h3>
              <p>
                Set portfolio and CV languages separately: English, Español or Türkçe. Labels and
                dates follow your selection. Your written content stays in the language you write
                it.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </Section>
  );
}
