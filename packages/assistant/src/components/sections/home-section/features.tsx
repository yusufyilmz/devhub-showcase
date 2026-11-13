import { RevealCardBase } from "@shared/ui/cards";
import { Section } from "@shared/ui/section";

import { HomeProcessSection } from "./process";
import { featuresStyles } from "./styles";

export function HomeFeaturesSection() {
  return (
    <Section asChild>
      <section aria-labelledby="features-title" className={featuresStyles.element1} id="features">
        <div className={featuresStyles.element2}>
          <h2 id="features-title">
            Build your portfolio and CV.
            <br />
            <span>Keep your job search organized.</span>
          </h2>
          <p>
            Set up your portfolio, choose how to share it, and keep job matches and application
            drafts in your private studio.
          </p>
        </div>
        <div className={featuresStyles.element4}>
          <RevealCardBase
            backdrop="accent"
            brief="Share what you’ve built, what you’ve learned and where you want to go. Your projects and experience take center stage."
            className={featuresStyles.element5}
            heading={
              <>
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
            backdrop="accent"
            brief="Pair any layout with a theme, color palette and light or dark mode."
            className={featuresStyles.element9}
            heading={
              <>
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
              <li>Portfolio themes, color palettes and light or dark mode</li>
              <li>Engineer, Designer, Consultant, Minimal, Trainer and Content creator layouts</li>
              <li>Separate portfolio and CV language settings</li>
            </ul>
          </RevealCardBase>
          <RevealCardBase
            backdrop="accent"
            brief="Keep your portfolio and CV connected through the same saved details."
            className={featuresStyles.element9}
            heading={
              <div className={featuresStyles.element13}>
                <div aria-hidden="true" className={featuresStyles.element14}>
                  <span>CV</span>↗
                </div>
                <div>
                  <h3>One update. Both ready.</h3>
                </div>
              </div>
            }
            title="your portfolio and CV"
          >
            <p>
              Choose what goes on your site and what goes into your PDF. CV formats include Classic,
              Editorial, Compact and two ATS-friendly layouts.
            </p>
          </RevealCardBase>
          <HomeProcessSection />
          <RevealCardBase
            backdrop="accent"
            brief="Save roles and track applications in your private Job Hunter workspace."
            className={featuresStyles.element9}
            heading={<h3>Find and track jobs</h3>}
            title="Job Hunter"
          >
            <p>
              Save searches and review matches against your CV when discovery is configured. Prepare
              a tailored CV and cover letter for review, then apply on the employer’s site. With
              email forwarding configured, you can also review LinkedIn job alerts here.
            </p>
          </RevealCardBase>
          <RevealCardBase
            backdrop="accent"
            brief="Set your Studio appearance and choose how the companion helps."
            className={featuresStyles.element9}
            heading={<h3>Make the studio work for you</h3>}
            title="Studio preferences"
          >
            <p>
              Sign in to sync appearance and companion preferences across devices. Use the
              companion’s feature guide to explore the studio and keep track of what you’ve tried.
            </p>
          </RevealCardBase>
        </div>
      </section>
    </Section>
  );
}
