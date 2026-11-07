import "../../styles/components/sections/examples.css";

import { cvLayouts } from "@shared/config";

import { Card } from "../../cards";
import { Section } from "../../layout/section";
import registry from "../../registry/components.json";
import { homeOptionsSectionClassName, optionsStyles } from "./styles";

export function HomeOptionsSection() {
  const { attributes, portfolioAccents, presets } = registry.themes;
  const appearance = [
    { label: "Accent", options: portfolioAccents },
    { label: "Spacing", options: attributes.spacing },
    { label: "Corner radius", options: attributes.radius },
    { label: "Color mode", options: attributes.theme },
  ];
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
              Start with a portfolio theme, then make it yours with a color palette, accent, and
              light or dark mode.
            </p>
            <ul className={optionsStyles.element5}>
              {presets.map((theme) => (
                <li key={theme.id}>
                  <span aria-hidden="true" className={homeOptionsSectionClassName(theme.id)}>
                    Aa
                  </span>
                  <span>
                    <b>{theme.name}</b>
                    <small>{theme.description}</small>
                  </span>
                </li>
              ))}
            </ul>
            <h4 className="mt-6 text-sm font-semibold">Color palettes</h4>
            <ul aria-label="Available color palettes" className={optionsStyles.element5}>
              {attributes.brand.map((brand) => (
                <li key={brand}>
                  <span
                    aria-hidden="true"
                    className="home-theme-swatch rounded-lg bg-primary text-primary-foreground"
                    data-brand={brand}
                    data-theme="light"
                  >
                    Aa
                  </span>
                  <b className="capitalize">{brand}</b>
                </li>
              ))}
            </ul>
            <details className="mt-6 rounded-lg border p-s">
              <summary className="cursor-pointer text-sm font-semibold">
                More appearance options
              </summary>
              <dl className="mt-s grid gap-s">
                {appearance.map(({ label, options }) => (
                  <div className="grid gap-xs" key={label}>
                    <dt className="text-sm font-medium">{label}</dt>
                    <dd className="flex flex-wrap gap-xs">
                      {options.map((value) => (
                        <span
                          className="rounded-full border px-s py-1 text-xs capitalize"
                          key={value}
                        >
                          {value}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
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
