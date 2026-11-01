import { homeFaq } from "@shared/content";
import { SectionAccordion } from "@shared/ui/section";

export function HomeFAQSection() {
  return (
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
          surface="portfolio"
          label="Common questions"
          items={homeFaq.map(([question, answer]) => ({
            id: question,
            title: question,
            content: <p>{answer}</p>,
          }))}
        />
      </div>
    </section>
  );
}
