'use client'
import { useId, useRef, useState } from 'react'

const views = ['Portfolio', 'CV'] as const
function tabIndexForKey(key: string, index: number) {
  if (key === 'Home') return 0
  if (key === 'End') return 1
  return ['ArrowLeft', 'ArrowRight'].includes(key) ? 1 - index : null
}
const accents = ['cyan', 'violet', 'emerald'] as const
export function PortfolioPreview() {
  const [view, setView] = useState<(typeof views)[number]>('Portfolio')
  const [accent, setAccent] = useState<(typeof accents)[number]>('cyan')
  const id = useId()
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  return (
    <div className="home-preview-wrap" id="preview">
      <div className="home-preview-tools">
        <div
          className="home-preview-tabs"
          role="tablist"
          aria-label="Example views"
        >
          {views.map((item, index) => (
            <button
              key={item}
              ref={(node) => {
                tabs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`${id}-${item}-tab`}
              aria-selected={view === item}
              aria-controls={`${id}-panel`}
              tabIndex={view === item ? 0 : -1}
              onClick={() => setView(item)}
              onKeyDown={(event) => {
                const next = tabIndexForKey(event.key, index)
                if (next === null) return
                event.preventDefault()
                const nextView = views[next]
                if (nextView) {
                  setView(nextView)
                  tabs.current[next]?.focus()
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="home-preview-caption">Your story, two ways</span>
      </div>
      <div className="home-preview-browser" data-preview-accent={accent}>
        <div className="home-preview-chrome">
          <span className="home-window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>mydevstudio.vercel.app/yourname</span>
          <span aria-hidden="true">↗</span>
        </div>
        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-${view}-tab`}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: Tab panel content needs a keyboard focus destination.
          tabIndex={0}
          className="home-preview-panel"
        >
          {view === 'Portfolio' ? (
            <div className="home-sample-site">
              <div className="home-sample-nav">
                <strong>
                  yn<span>.</span>
                </strong>
                <span>About&nbsp;&nbsp; Work&nbsp;&nbsp; Contact</span>
              </div>
              <div className="home-sample-intro">
                <div className="home-sample-avatar" aria-hidden="true">
                  yn
                </div>
                <p>HELLO, I’M</p>
                <h2>
                  Your name<span>.</span>
                </h2>
                <p className="home-sample-role">
                  Developer. Designer. A little of both.
                </p>
                <p className="home-sample-bio">
                  A few words about what you do,
                  <br />
                  and what makes it yours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setView('CV')
                    tabs.current[1]?.focus()
                  }}
                >
                  Preview your CV <span aria-hidden="true">↗</span>
                </button>
              </div>
              <div className="home-sample-work">
                <span>SELECTED WORK</span>
                <span>01 / 02</span>
              </div>
              <div className="home-sample-projects">
                <div>
                  <div
                    className="home-project-art home-project-art-one"
                    aria-hidden="true"
                  >
                    <span />
                    <span />
                    <span />
                    <b>build.</b>
                  </div>
                  <strong>A project you’re proud of</strong>
                  <small>Your craft, in action</small>
                </div>
                <div>
                  <div
                    className="home-project-art home-project-art-two"
                    aria-hidden="true"
                  >
                    <i />
                    <i />
                    <i />
                  </div>
                  <strong>Your next great idea</strong>
                  <small>A little room to grow</small>
                </div>
              </div>
              <div className="home-sample-footer">
                <span>Built around you.</span>
                <span>GitHub&nbsp; / &nbsp;LinkedIn</span>
              </div>
            </div>
          ) : (
            <div className="home-sample-cv">
              <div className="home-cv-paper">
                <p className="home-cv-label">YOUR DOWNLOADABLE CV</p>
                <h2>Your name</h2>
                <p>Software engineer</p>
                <div className="home-cv-contact">
                  Your email · Your location · Your website
                </div>
                <h3>Profile</h3>
                <p>Your professional summary, in your own words.</p>
                <h3>Experience</h3>
                <div className="home-cv-role">
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
                <div className="home-cv-footnote">
                  One story. Ready for the next opportunity.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="home-preview-bottom">
        <span>Try an accent</span>
        <fieldset className="home-preview-colors">
          <legend className="sr-only">Preview accent color</legend>
          {accents.map((item) => (
            <button
              key={item}
              type="button"
              className={`home-accent home-accent-${item}`}
              aria-label={`Preview in ${item}`}
              aria-pressed={accent === item}
              onClick={() => setAccent(item)}
            >
              <span aria-hidden="true">{accent === item ? '✓' : ''}</span>
            </button>
          ))}
        </fieldset>
        <span className="home-preview-note">Illustrative preview</span>
      </div>
    </div>
  )
}
