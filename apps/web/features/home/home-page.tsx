import { Card } from "@shared/components/cards";
import { ThemeToggle } from "@shared/ui/theme";

import type { HomeAction } from "../../lib/home-links";
import { ExampleCarousel } from "../examples/example-carousel";
import { HomeLibrary } from "./home-library";
import { HomeOptions } from "./home-options";
import { PortfolioPreview } from "./portfolio-preview";
import "./home.css";

function Brand() {
  return (
    <a aria-label="MyDevStudio home" className="home-brand" href="/">
      <svg aria-hidden="true" height="32" viewBox="0 0 32 32" width="32">
        <rect fill="currentColor" height="30" opacity=".12" rx="9" width="30" x="1" y="1" />
        <path
          d="M9 23V10l7 8 7-8v13"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      </svg>
      <span>
        mydev<span className="home-brand-light">studio</span>
        <b>.</b>
      </span>
    </a>
  );
}
const faq = [
  [
    "Can I start with my existing CV?",
    "Yes. Sign in, open Import CV in your studio and upload a PDF, DOCX or text file up to 3 MB. With your permission, OpenAI extracts details for review. Choose what to apply, correct mistakes and save your draft. Availability depends on service configuration; importing does not publish your portfolio.",
  ],
  [
    "Can I reuse my sections?",
    "Yes. Save private section templates or export a JSON configuration. Review native or compatible PageForge imports before applying them. Configuration exports omit authored content by default.",
  ],
  [
    "Can I switch layouts later?",
    "Yes. Choose Engineer, Designer, Consultant or Minimal, then change your layout and theme in the editor whenever you like. Your saved information stays with you.",
  ],
  [
    "Are the example portfolios real people?",
    "The eight carousel examples use fictional identities and sample work. Open any example to explore its layout and download a clearly labeled sample CV.",
  ],
  [
    "Does changing language translate my writing?",
    "Language settings change portfolio and CV labels and dates independently. English, Spanish and Turkish are available. Write your own biography and project descriptions in the language you want to share.",
  ],
  [
    "Is my portfolio public as soon as I sign up?",
    "No. Your portfolio starts private. Publish it when you’re ready, and turn public sharing off again whenever you need to.",
  ],
  [
    "Do I need to write any code?",
    "No code is needed. Add your details, projects, experience and skills in the editor. Choose your colors and theme, then save your changes.",
  ],
  [
    "How does the downloadable CV work?",
    "Your portfolio and CV use the same saved information. Choose your PDF page size, text size and included sections, then download it from your studio. PDF contact settings affect the PDF only; published portfolio details are public.",
  ],
  [
    "Can I update it after publishing?",
    "Yes. Sign in to your studio to update your work, change the design or keep adding to your story. You can also change your username, which changes your public link.",
  ],
] as const;
export function HomePage({
  action,
  exampleHref,
}: {
  action: HomeAction;
  exampleHref: string | null;
}) {
  return (
    <div className="home-page">
      <a className="skip-link" href="#home-content">
        Skip to content
      </a>
      <header className="home-header">
        <div className="home-container home-header-inner">
          <Brand />
          <nav aria-label="Main navigation" className="home-nav">
            <a href="#examples">Examples</a>
            <a href="#features">Why MyDevStudio</a>
            <a href="#how-it-works">How it works</a>
            <a href="#questions">Questions</a>
          </nav>
          <div className="home-header-actions">
            <ThemeToggle />
            <a className="home-signin" href={action.href}>
              {action.signedIn ? "My studio" : "Sign in"} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>
      <main id="home-content">
        <section aria-labelledby="home-title" className="home-container home-hero">
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
              A portfolio that feels like you, with a CV to match. Bring your projects, experience
              and ideas together in a place you can call your own.
            </p>
            <div className="home-hero-actions">
              <a className="home-button home-button-primary" href={action.href}>
                {action.label} <span aria-hidden="true">↗</span>
              </a>
              <a
                className="home-example-link"
                href={exampleHref ?? "https://mydevstudio.vercel.app/yusufyilmz"}
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
        <section aria-label="What you can include" className="home-container home-capabilities">
          <span>A PLACE FOR</span>
          <span>Your projects</span>
          <i aria-hidden="true">✳</i>
          <span>Your experience</span>
          <i aria-hidden="true">✳</i>
          <span>Your personality</span>
          <i aria-hidden="true">✳</i>
          <span>Your next chapter</span>
        </section>
        <ExampleCarousel />
        <section
          aria-labelledby="features-title"
          className="home-container home-features"
          id="features"
        >
          <div className="home-section-intro">
            <p className="home-eyebrow">MORE THAN A DOCUMENT</p>
            <h2 id="features-title">
              A portfolio first.
              <br />
              <span>A CV when you need it.</span>
            </h2>
            <p>
              Your work deserves more than a list of bullet points. Give it context, make it
              personal, and keep everything connected.
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
                  Share what you’ve built, what you’ve learned and where you want to go. Your
                  projects and experience take center stage.
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
              <div aria-hidden="true" className="home-style-demo">
                <span />
                <span />
                <span />
                <div>
                  Aa<span>you.</span>
                </div>
              </div>
              <h3>A little more you.</h3>
              <p>
                Choose Studio, Paper, Graphite or Bloom. Pair any layout with your favorite theme,
                accent and light or dark mode.
              </p>
            </Card>
            <Card className="home-feature-card home-feature-wide">
              <div aria-hidden="true" className="home-file-icon">
                <span>CV</span>↗
              </div>
              <div>
                <span className="home-feature-index">03 / ALWAYS CONNECTED</span>
                <h3>One update. Both ready.</h3>
                <p>
                  Your CV comes from your saved portfolio details. Choose its Classic, Editorial or
                  Compact format and sections, then download a PDF when the opportunity comes.
                </p>
              </div>
              <span className="home-file-tag">Portfolio + PDF</span>
            </Card>
          </div>
        </section>
        <HomeOptions />
        <HomeLibrary href={action.href} />
        <section
          aria-labelledby="process-title"
          className="home-container home-process"
          id="how-it-works"
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
                Import and review your CV or add details yourself. Choose sections, a layout, theme
                and languages for a look that feels right.
              </p>
            </li>
            <li>
              <span>03</span>
              <h3>Share it when you’re ready</h3>
              <p>Choose your username, publish your portfolio and take your CV with you.</p>
            </li>
          </ol>
        </section>
        <section
          aria-labelledby="questions-title"
          className="home-container home-faq"
          id="questions"
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
          <span aria-hidden="true" className="home-final-glyph">
            ↗
          </span>
        </section>
      </main>
      <footer className="home-container home-footer">
        <Brand />
        <p className="home-footer-copy">For the work you do. And the person behind it.</p>
        <div>
          <a
            href="https://github.com/yusufyilmz/devhub-showcase"
            rel="noopener noreferrer"
            target="_blank"
          >
            Source on GitHub ↗
          </a>
          <a href={action.href}>{action.signedIn ? "Open studio" : "Sign in"} ↗</a>
        </div>
      </footer>
    </div>
  );
}
