import { Card } from '@shared/components/cards'
import { ThemeToggle } from '@shared/ui/theme'
import type { HomeAction } from '../../lib/home-links'
import { PortfolioPreview } from './portfolio-preview'
import './home.css'

function Brand() {
  return (
    <a className="home-brand" href="/" aria-label="MyDevStudio home">
      <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="9"
          fill="currentColor"
          opacity=".12"
        />
        <path
          d="M9 23V10l7 8 7-8v13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        mydev<span className="home-brand-light">studio</span>
        <b>.</b>
      </span>
    </a>
  )
}
const faq = [
  [
    'Is my portfolio public as soon as I sign up?',
    'No. Your portfolio starts private. Publish it when you’re ready, and turn public sharing off again whenever you need to.'
  ],
  [
    'Do I need to write any code?',
    'No code is needed. Add your details, projects, experience and skills in the editor. Choose your colors and theme, then save your changes.'
  ],
  [
    'How does the downloadable CV work?',
    'Your portfolio and CV use the same saved information. Choose your PDF page size, text size and included sections, then download it from your studio. PDF contact settings affect the PDF only; published portfolio details are public.'
  ],
  [
    'Can I update it after publishing?',
    'Yes. Sign in to your studio to update your work, change the design or keep adding to your story. You can also change your username, which changes your public link.'
  ]
] as const
export function HomePage({
  action,
  exampleHref
}: {
  action: HomeAction
  exampleHref: string | null
}) {
  return (
    <div className="home-page">
      <a className="skip-link" href="#home-content">
        Skip to content
      </a>
      <header className="home-header">
        <div className="home-container home-header-inner">
          <Brand />
          <nav className="home-nav" aria-label="Main navigation">
            <a href="#features">Why MyDevStudio</a>
            <a href="#how-it-works">How it works</a>
            <a href="#questions">Questions</a>
          </nav>
          <div className="home-header-actions">
            <ThemeToggle />
            <a className="home-signin" href={action.href}>
              {action.signedIn ? 'My studio' : 'Sign in'}{' '}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>
      <main id="home-content">
        <section
          className="home-container home-hero"
          aria-labelledby="home-title"
        >
          <div className="home-hero-copy">
            <p className="home-eyebrow">
              <span /> A LITTLE SPACE. A LOT OF YOU.
            </p>
            <h1 id="home-title">
              Your work.
              <br />
              Your story.
              <br />
              <span>One place.</span>
            </h1>
            <p className="home-hero-description">
              A portfolio that feels like you, with a CV to match. Bring your
              projects, experience and ideas together in a place you can call
              your own.
            </p>
            <div className="home-hero-actions">
              <a className="home-button home-button-primary" href={action.href}>
                {action.label} <span aria-hidden="true">↗</span>
              </a>
              <a
                className="home-example-link"
                href={
                  exampleHref ?? 'https://mydevstudio.vercel.app/yusufyilmz'
                }
              >
                See a real portfolio <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="home-hero-notes">
              <span>
                <i aria-hidden="true">✓</i> No code needed
              </span>
              <span>
                <i aria-hidden="true">✓</i> Private until you publish
              </span>
            </div>
          </div>
          <PortfolioPreview />
        </section>
        <section
          className="home-container home-capabilities"
          aria-label="What you can include"
        >
          <span>A PLACE FOR</span>
          <span>Your projects</span>
          <i aria-hidden="true">✳</i>
          <span>Your experience</span>
          <i aria-hidden="true">✳</i>
          <span>Your personality</span>
          <i aria-hidden="true">✳</i>
          <span>Your next chapter</span>
        </section>
        <section
          className="home-container home-features"
          id="features"
          aria-labelledby="features-title"
        >
          <div className="home-section-intro">
            <p className="home-eyebrow">MORE THAN A DOCUMENT</p>
            <h2 id="features-title">
              A portfolio first.
              <br />
              <span>A CV when you need it.</span>
            </h2>
            <p>
              Your work deserves more than a list of bullet points. Give it
              context, make it personal, and keep everything connected.
            </p>
          </div>
          <div className="home-feature-grid">
            <Card className="home-feature-card home-feature-main">
              <div>
                <span className="home-feature-index">01 / YOUR OWN CORNER</span>
                <h3>
                  A link that’s
                  <br />
                  yours to share.
                </h3>
                <p>
                  Share what you’ve built, what you’ve learned and where you
                  want to go. Your projects and experience take center stage.
                </p>
              </div>
              <div className="home-url-demo">
                <span aria-hidden="true">↗</span>
                <div>
                  <small>YOUR PERSONAL LINK</small>
                  <p>
                    mydevstudio.vercel.app/<strong>yourname</strong>
                  </p>
                </div>
              </div>
            </Card>
            <Card className="home-feature-card">
              <span className="home-feature-index">02 / MAKE IT YOURS</span>
              <div className="home-style-demo" aria-hidden="true">
                <span />
                <span />
                <span />
                <div>
                  Aa<span>you.</span>
                </div>
              </div>
              <h3>A little more you.</h3>
              <p>
                Choose an accent and a light or dark theme. Give your portfolio
                its own character without starting from scratch.
              </p>
            </Card>
            <Card className="home-feature-card home-feature-wide">
              <div className="home-file-icon" aria-hidden="true">
                <span>CV</span>↗
              </div>
              <div>
                <span className="home-feature-index">
                  03 / ALWAYS CONNECTED
                </span>
                <h3>One update. Both ready.</h3>
                <p>
                  Your CV comes from your saved portfolio details. Choose its
                  format and sections, then download a PDF when the opportunity
                  comes.
                </p>
              </div>
              <span className="home-file-tag">Portfolio + PDF</span>
            </Card>
          </div>
        </section>
        <section
          className="home-container home-process"
          id="how-it-works"
          aria-labelledby="process-title"
        >
          <div className="home-section-intro">
            <p className="home-eyebrow">START WITH WHAT YOU HAVE</p>
            <h2 id="process-title">
              From a blank page
              <br />
              to <span>your own place.</span>
            </h2>
          </div>
          <ol className="home-steps">
            <li>
              <span>01</span>
              <h3>Open your studio</h3>
              <p>Sign in with Google and start with your own private space.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Put your story together</h3>
              <p>
                Add your work, experience and skills. Find a look that feels
                right.
              </p>
            </li>
            <li>
              <span>03</span>
              <h3>Share it when you’re ready</h3>
              <p>
                Choose your username, publish your portfolio and take your CV
                with you.
              </p>
            </li>
          </ol>
        </section>
        <section
          className="home-container home-faq"
          id="questions"
          aria-labelledby="questions-title"
        >
          <div className="home-section-intro">
            <p className="home-eyebrow">A FEW THINGS TO KNOW</p>
            <h2 id="questions-title">
              Make yourself
              <br />
              <span>at home.</span>
            </h2>
          </div>
          <div className="home-faq-list">
            {faq.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="home-container home-final">
          <div className="home-final-inner">
            <p className="home-eyebrow">YOUR WORK IS ALREADY THERE.</p>
            <h2>
              Give it a place
              <br />
              to live<span className="home-final-period">.</span>
            </h2>
            <p>Start with your story. Make the rest yours.</p>
            <a className="home-button home-button-primary" href={action.href}>
              {action.label} <span aria-hidden="true">↗</span>
            </a>
            <span className="home-final-note">Your portfolio. Your pace.</span>
          </div>
          <span className="home-final-glyph" aria-hidden="true">
            ↗
          </span>
        </section>
      </main>
      <footer className="home-container home-footer">
        <Brand />
        <p className="home-footer-copy">
          For the work you do. And the person behind it.
        </p>
        <div>
          <a
            href="https://github.com/yusufyilmz/devhub-showcase"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source on GitHub ↗
          </a>
          <a href={action.href}>
            {action.signedIn ? 'Open studio' : 'Sign in'} ↗
          </a>
        </div>
      </footer>
    </div>
  )
}
