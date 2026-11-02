import { homeFaq } from "@shared/config";

import { Section, SectionAccordion } from "../../layout/section";
import { faqStyles } from "./styles";

export function HomeFAQSection() {
  return (
    <Section asChild>
      <section aria-labelledby="questions-title" className={faqStyles.element1} id="questions">
        <div className={faqStyles.element2}>
          <p className={faqStyles.element3}>A FEW THINGS TO KNOW</p>
          <h2 id="questions-title">
            Make yourself
            <br />
            <span>at home.</span>
          </h2>
        </div>
        <div className={faqStyles.element4}>
          <SectionAccordion
            items={homeFaq.map(([question, answer]) => ({
              content: <p>{answer}</p>,
              id: question,
              title: question,
            }))}
            label="Common questions"
            surface="portfolio"
            type="reveal"
          />
        </div>
      </section>
    </Section>
  );
}
