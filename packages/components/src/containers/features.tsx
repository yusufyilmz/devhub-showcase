import { Card } from "@shared/ui/card";
import { RevealCardBase } from "@shared/ui/cards";

export function Features() {
  return (
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
          Your work deserves more than a list of bullet points. Give it context, make it personal,
          and keep everything connected.
        </p>
      </div>
      <div className="home-feature-grid">
        <RevealCardBase
          brief="Share what you’ve built, what you’ve learned and where you want to go. Your projects and experience take center stage."
          className="home-feature-card home-feature-main"
          heading={
            <>
              <span className="home-feature-index">01 / YOUR OWN CORNER</span>
              <h3>
                A link that’s
                <br />
                yours to share.
              </h3>
              <div className="home-url-demo">
                <span aria-hidden="true">↗</span>
                <div>
                  <small>YOUR PERSONAL LINK</small>
                  <p>
                    mydevstudio.vercel.app/<strong>yourname</strong>
                  </p>
                </div>
              </div>
            </>
          }
          title="your own portfolio"
        >
          <p>
            Give each project its context, bring your experience together, and let visitors explore
            the details at their own pace.
          </p>
          <ul className="home-feature-details">
            <li>Your own shareable portfolio link</li>
            <li>Projects, experience and the story behind them</li>
            <li>A private draft until you choose to publish</li>
          </ul>
        </RevealCardBase>
        <RevealCardBase
          brief="Choose Studio, Paper, Graphite or Bloom. Pair any layout with your favorite theme, accent and light or dark mode."
          className="home-feature-card"
          heading={
            <>
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
            </>
          }
          title="your portfolio style"
        >
          <p>
            Find a starting point that feels right, then make the details your own. Your content
            stays with you when you change the look.
          </p>
          <ul className="home-feature-details">
            <li>Four themes, each with its own character</li>
            <li>Engineer, Designer, Consultant, Minimal, Trainer and Content creator layouts</li>
            <li>Separate portfolio and CV language settings</li>
          </ul>
        </RevealCardBase>
        <Card className="home-feature-card home-feature-wide" layout="plain" surface="portfolio">
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
  );
}
