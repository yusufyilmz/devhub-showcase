import { Card, RevealCardBase } from "../../cards";
import { Section } from "../../layout/section";
import { featuresStyles } from "./styles";

export function HomeFeaturesSection() {
  return (
    <Section asChild>
      <section aria-labelledby="features-title" className={featuresStyles.element1} id="features">
        <div className={featuresStyles.element2}>
          <p className={featuresStyles.element3}>MORE THAN A DOCUMENT</p>
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
        <div className={featuresStyles.element4}>
          <RevealCardBase
            brief="Share what you’ve built, what you’ve learned and where you want to go. Your projects and experience take center stage."
            className={featuresStyles.element5}
            heading={
              <>
                <span className={featuresStyles.element6}>01 / YOUR OWN CORNER</span>
                <h3>
                  A link that’s
                  <br />
                  yours to share.
                </h3>
                <div className={featuresStyles.element7}>
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
              Give each project its context, bring your experience together, and let visitors
              explore the details at their own pace.
            </p>
            <ul className={featuresStyles.element8}>
              <li>Your own shareable portfolio link</li>
              <li>Projects, experience and the story behind them</li>
              <li>A private draft until you choose to publish</li>
            </ul>
          </RevealCardBase>
          <RevealCardBase
            brief="Choose Studio, Paper, Graphite or Bloom. Pair any layout with your favorite theme, accent and light or dark mode."
            className={featuresStyles.element9}
            heading={
              <>
                <span className={featuresStyles.element10}>02 / MAKE IT YOURS</span>
                <div aria-hidden="true" className={featuresStyles.element11}>
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
            <ul className={featuresStyles.element12}>
              <li>Four themes, each with its own character</li>
              <li>Engineer, Designer, Consultant, Minimal, Trainer and Content creator layouts</li>
              <li>Separate portfolio and CV language settings</li>
            </ul>
          </RevealCardBase>
          <Card className={featuresStyles.element13} layout="plain" surface="portfolio">
            <div aria-hidden="true" className={featuresStyles.element14}>
              <span>CV</span>↗
            </div>
            <div>
              <span className={featuresStyles.element15}>03 / ALWAYS CONNECTED</span>
              <h3>One update. Both ready.</h3>
              <p>
                Your CV comes from your saved portfolio details. Choose its Classic, Editorial or
                Compact format and sections, then download a PDF when the opportunity comes.
              </p>
            </div>
            <span className={featuresStyles.element16}>Portfolio + PDF</span>
          </Card>
        </div>
      </section>
    </Section>
  );
}
