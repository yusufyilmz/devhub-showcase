import "./examples.css";

import { cvLayouts, portfolioThemes } from "@shared/config";

import { Card } from "../../cards";
import { Section } from "../../layout/section";
import { homeOptionsSectionClassName, optionsStyles } from "./styles";

export function HomeOptionsSection() {
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
            <h3>Four themes. Your character.</h3>
            <p>
              Mix any layout with any theme, choose an accent, and switch between light and dark.
            </p>
            <ul className={optionsStyles.element5}>
              {portfolioThemes.map((theme) => (
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
