import { cvLayouts, portfolioThemes } from '@shared/content'
export function HomeOptions() {
  return (
    <section
      className="home-container home-options"
      aria-labelledby="options-title"
    >
      <div className="home-section-intro">
        <p className="home-eyebrow">YOUR WORK, YOUR WAY</p>
        <h2 id="options-title">
          One story.
          <br />
          <span>Plenty of possibilities.</span>
        </h2>
        <p>
          Choose a layout for your work, then make the details your own. You can
          change your choices in the editor anytime.
        </p>
      </div>
      <div className="home-options-grid">
        <div>
          <h3>Four themes. Your character.</h3>
          <p>
            Mix any layout with any theme, choose an accent, and switch between
            light and dark.
          </p>
          <ul className="home-theme-list">
            {portfolioThemes.map((theme) => (
              <li key={theme.id}>
                <span
                  className={`home-theme-swatch home-theme-${theme.id}`}
                  aria-hidden="true"
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
        </div>
        <div>
          <h3>A CV that fits your story.</h3>
          <p>
            Your saved information becomes a PDF. Choose the format, page size,
            text size and sections.
          </p>
          <ul className="home-format-list">
            {cvLayouts.map((layout) => (
              <li key={layout.id}>
                <b>{layout.name}</b>
                <span>{layout.description}</span>
              </li>
            ))}
          </ul>
          <div className="home-language-note">
            <span className="home-eyebrow">EN / ES / TR</span>
            <h3>Speak to your audience.</h3>
            <p>
              Set portfolio and CV languages separately: English, Español or
              Türkçe. Labels and dates follow your selection. Your written
              content stays in the language you write it.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
