import { homeFaq } from "@shared/config";

import { Section, SectionAccordion } from "../../layout/section";

export function HomeFAQSection() {
  return (
    <Section asChild>
      <section aria-labelledby="questions-title" className="home-container home-faq" id="questions">
        <div className="home-section-intro">
          <p className="home-eyebrow">A FEW THINGS TO KNOW</p>
          <h2 id="questions-title">
            Make yourself
            <br />
            <span>at home.</span>
          </h2>
        </div>
        <div className="home-faq-list">
          <SectionAccordion
            items={homeFaq.map(([question, answer]) => ({
              content: <p>{answer}</p>,
              id: question,
              title: question,
            }))}
            label="Common questions"
            surface="portfolio"
          />
        </div>
      </section>
    </Section>
  );
}
